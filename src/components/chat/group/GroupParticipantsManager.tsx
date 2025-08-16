import React, { useState } from "react";
import { Search, Crown, Shield, UserMinus, UserPlus, MoreVertical, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { GroupParticipant } from "@/types/group-chat";
import { ChatParticipant } from "@/types/chat";
import { ParticipantSelector } from "./ParticipantSelector";

interface GroupParticipantsManagerProps {
  groupId: string;
  participants: GroupParticipant[];
  currentUserId: string;
  isCurrentUserAdmin: boolean;
  availableContacts?: ChatParticipant[];
  onAddMembers?: (groupId: string, userIds: string[]) => Promise<void>;
  onRemoveMember?: (groupId: string, userId: string, reason?: string) => Promise<void>;
  onPromoteMember?: (groupId: string, userId: string, customTitle?: string) => Promise<void>;
  onDemoteMember?: (groupId: string, userId: string) => Promise<void>;
  onUpdateMemberTitle?: (groupId: string, userId: string, title: string) => Promise<void>;
  className?: string;
}

export const GroupParticipantsManager: React.FC<GroupParticipantsManagerProps> = ({
  groupId,
  participants,
  currentUserId,
  isCurrentUserAdmin,
  availableContacts = [],
  onAddMembers,
  onRemoveMember,
  onPromoteMember,
  onDemoteMember,
  onUpdateMemberTitle,
  className,
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [selectedNewMembers, setSelectedNewMembers] = useState<string[]>([]);
  const [isAddingMembers, setIsAddingMembers] = useState(false);

  // Filter participants based on search
  const filteredParticipants = participants.filter((participant) =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get available contacts (exclude existing members)
  const existingMemberIds = participants.map(p => p.id);
  const availableNewContacts = availableContacts.filter(
    contact => !existingMemberIds.includes(contact.id)
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAddMembers = async () => {
    if (!onAddMembers || selectedNewMembers.length === 0) return;

    setIsAddingMembers(true);
    try {
      await onAddMembers(groupId, selectedNewMembers);
      setSelectedNewMembers([]);
      setShowAddMembers(false);
      toast({
        title: "Members added",
        description: `${selectedNewMembers.length} member(s) have been added to the group.`,
      });
    } catch (error) {
      console.error("Error adding members:", error);
      toast({
        title: "Failed to add members",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingMembers(false);
    }
  };

  const handleMemberAction = async (action: string, participant: GroupParticipant) => {
    try {
      switch (action) {
        case "promote":
          if (onPromoteMember) {
            await onPromoteMember(groupId, participant.id);
            toast({
              title: "Member promoted",
              description: `${participant.name} has been promoted to admin.`,
            });
          }
          break;
        case "demote":
          if (onDemoteMember) {
            await onDemoteMember(groupId, participant.id);
            toast({
              title: "Admin removed",
              description: `${participant.name} is no longer an admin.`,
            });
          }
          break;
        case "remove":
          if (onRemoveMember) {
            await onRemoveMember(groupId, participant.id);
            toast({
              title: "Member removed",
              description: `${participant.name} has been removed from the group.`,
            });
          }
          break;
      }
    } catch (error) {
      console.error(`Error ${action} member:`, error);
      toast({
        title: `Failed to ${action} member`,
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderParticipantActions = (participant: GroupParticipant) => {
    if (!isCurrentUserAdmin || participant.id === currentUserId) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {participant.role === 'member' ? (
            <DropdownMenuItem onClick={() => handleMemberAction('promote', participant)}>
              <Crown className="h-4 w-4 mr-2" />
              Promote to Admin
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => handleMemberAction('demote', participant)}>
              <Shield className="h-4 w-4 mr-2" />
              Remove Admin Rights
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem 
                className="text-destructive" 
                onSelect={(e) => e.preventDefault()}
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Remove from Group
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Member</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove {participant.name} from the group? 
                  They won't be able to see new messages.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleMemberAction('remove', participant)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Remove Member
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (showAddMembers) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add New Members</h3>
          <Button
            variant="ghost"
            onClick={() => {
              setShowAddMembers(false);
              setSelectedNewMembers([]);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ParticipantSelector
          contacts={availableNewContacts}
          selectedParticipants={selectedNewMembers}
          onParticipantsChange={setSelectedNewMembers}
          excludeUserIds={existingMemberIds}
          showSelectedCount={true}
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowAddMembers(false);
              setSelectedNewMembers([]);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMembers}
            disabled={selectedNewMembers.length === 0 || isAddingMembers}
          >
            {isAddingMembers ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Add {selectedNewMembers.length} Member{selectedNewMembers.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Members ({participants.filter(p => p.isActive).length})
        </h3>
        {isCurrentUserAdmin && availableNewContacts.length > 0 && (
          <Button
            onClick={() => setShowAddMembers(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Members
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Members List */}
      <ScrollArea className="h-96">
        <div className="space-y-2">
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  !participant.isActive && "opacity-60"
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={participant.avatar} alt={participant.name} />
                    <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                  </Avatar>
                  {participant.isOnline && participant.isActive && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{participant.name}</h4>
                    {participant.role === 'admin' && (
                      <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    )}
                    {participant.id === currentUserId && (
                      <Badge variant="outline" className="text-xs">You</Badge>
                    )}
                    {!participant.isActive && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        Left
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {participant.customTitle || (participant.role === 'admin' ? 'Admin' : 'Member')}
                    {participant.joinedAt && (
                      <span className="ml-2">
                        • Joined {format(new Date(participant.joinedAt), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                  
                  {participant.lastSeen && !participant.isOnline && (
                    <div className="text-xs text-muted-foreground">
                      Last seen {format(new Date(participant.lastSeen), 'MMM d, HH:mm')}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {participant.isActive && renderParticipantActions(participant)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No members found matching your search" : "No members found"}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold">
            {participants.filter(p => p.isActive).length}
          </div>
          <div className="text-xs text-muted-foreground">Active Members</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">
            {participants.filter(p => p.role === 'admin' && p.isActive).length}
          </div>
          <div className="text-xs text-muted-foreground">Admins</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">
            {participants.filter(p => p.isOnline && p.isActive).length}
          </div>
          <div className="text-xs text-muted-foreground">Online</div>
        </div>
      </div>
    </div>
  );
};
