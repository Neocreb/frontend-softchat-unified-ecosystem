import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Megaphone,
  Send,
  X,
  Bell,
  Users,
  Pin,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { GroupMentionInput } from "./GroupMentionInput";
import { GroupParticipant } from "@/types/group-chat";

interface AnnouncementOptions {
  pinMessage: boolean;
  notifyAll: boolean;
  mentionEveryone: boolean;
  scheduleMessage: boolean;
  scheduledTime?: string;
}

interface GroupAnnouncementComposerProps {
  trigger: React.ReactNode;
  groupId: string;
  groupName: string;
  participants: GroupParticipant[];
  currentUserId: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSendAnnouncement: (
    content: string,
    mentionedUsers: Array<{id: string, name: string}>,
    options: AnnouncementOptions
  ) => Promise<void>;
}

export const GroupAnnouncementComposer: React.FC<GroupAnnouncementComposerProps> = ({
  trigger,
  groupId,
  groupName,
  participants,
  currentUserId,
  isOpen: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSendAnnouncement,
}) => {
  const { toast } = useToast();
  
  // Modal state
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange || setInternalOpen;

  // Form state
  const [content, setContent] = useState("");
  const [mentionedUsers, setMentionedUsers] = useState<Array<{id: string, name: string}>>([]);
  const [options, setOptions] = useState<AnnouncementOptions>({
    pinMessage: true,
    notifyAll: true,
    mentionEveryone: false,
    scheduleMessage: false,
  });
  const [isSending, setIsSending] = useState(false);

  const resetForm = () => {
    setContent("");
    setMentionedUsers([]);
    setOptions({
      pinMessage: true,
      notifyAll: true,
      mentionEveryone: false,
      scheduleMessage: false,
    });
  };

  const handleContentChange = (newContent: string, mentions: Array<{id: string, name: string}>) => {
    setContent(newContent);
    setMentionedUsers(mentions);
  };

  const handleMentionEveryone = () => {
    if (options.mentionEveryone) {
      // Remove @everyone from content and add individual mentions
      const everyoneText = "@everyone ";
      const newContent = content.replace(everyoneText, "");
      setContent(newContent);
      
      // Add all active participants as mentions
      const allMentions = participants
        .filter(p => p.isActive && p.id !== currentUserId)
        .map(p => ({ id: p.id, name: p.name }));
      setMentionedUsers(prev => {
        const combined = [...prev, ...allMentions];
        return combined.filter((mention, index, arr) => 
          arr.findIndex(m => m.id === mention.id) === index
        );
      });
    } else {
      // Add @everyone to content
      setContent(prev => "@everyone " + prev);
      setMentionedUsers([]); // Clear individual mentions
    }
    
    setOptions(prev => ({ ...prev, mentionEveryone: !prev.mentionEveryone }));
  };

  const handleSendAnnouncement = async () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter an announcement message.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      await onSendAnnouncement(content.trim(), mentionedUsers, options);
      
      toast({
        title: "Announcement sent!",
        description: `Your announcement has been sent to ${groupName}.`,
      });

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending announcement:", error);
      toast({
        title: "Failed to send announcement",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const activeParticipants = participants.filter(p => p.isActive);
  const mentionedCount = options.mentionEveryone ? activeParticipants.length : mentionedUsers.length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Create Announcement
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="hover:bg-accent rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <DialogDescription>
            Send an important message to all members of {groupName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview */}
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                  📢 Announcement Preview
                </Badge>
                {options.pinMessage && (
                  <Badge variant="outline" className="text-xs">
                    <Pin className="h-3 w-3 mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                {content || "Your announcement will appear here..."}
              </div>
              {mentionedCount > 0 && (
                <div className="flex items-center gap-1 mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                  <Users className="h-3 w-3" />
                  <span>
                    {options.mentionEveryone 
                      ? `All ${activeParticipants.length} members will be notified`
                      : `${mentionedCount} member${mentionedCount !== 1 ? 's' : ''} mentioned`
                    }
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Input */}
          <div className="space-y-2">
            <Label htmlFor="announcement-content">Announcement Message</Label>
            <GroupMentionInput
              value={content}
              onChange={handleContentChange}
              participants={participants}
              currentUserId={currentUserId}
              placeholder="Write your announcement here... Use @ to mention specific members"
              maxLength={2000}
              className="min-h-24"
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Announcement Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="pin-message" className="font-medium">
                    Pin Message
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Pin this announcement to the top of the chat
                  </p>
                </div>
                <Switch
                  id="pin-message"
                  checked={options.pinMessage}
                  onCheckedChange={(checked) =>
                    setOptions(prev => ({ ...prev, pinMessage: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="notify-all" className="font-medium">
                    Notify All
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Send push notifications to all members
                  </p>
                </div>
                <Switch
                  id="notify-all"
                  checked={options.notifyAll}
                  onCheckedChange={(checked) =>
                    setOptions(prev => ({ ...prev, notifyAll: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="mention-everyone" className="font-medium">
                    Mention Everyone
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Mention all {activeParticipants.length} active members
                  </p>
                </div>
                <Switch
                  id="mention-everyone"
                  checked={options.mentionEveryone}
                  onCheckedChange={handleMentionEveryone}
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg opacity-50">
                <div className="space-y-1">
                  <Label htmlFor="schedule-message" className="font-medium">
                    Schedule Message
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Send at a specific time (coming soon)
                  </p>
                </div>
                <Switch
                  id="schedule-message"
                  checked={false}
                  disabled={true}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold">
                {activeParticipants.length}
              </div>
              <div className="text-xs text-muted-foreground">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">
                {mentionedCount}
              </div>
              <div className="text-xs text-muted-foreground">Will be Notified</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">
                {content.length}
              </div>
              <div className="text-xs text-muted-foreground">Characters</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4" />
            <span>
              {options.notifyAll ? "All members will be notified" : "No notifications"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendAnnouncement}
              disabled={isSending || !content.trim()}
              className="flex items-center gap-2"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Announcement
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
