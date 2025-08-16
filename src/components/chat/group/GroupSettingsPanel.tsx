import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
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
import {
  Settings,
  Shield,
  Users,
  MessageSquare,
  Bell,
  Link,
  Trash2,
  RefreshCw,
  Copy,
  ExternalLink,
  Timer,
  Eye,
  EyeOff,
  Archive,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  GroupChatThread, 
  GroupChatSettings,
  UpdateGroupRequest,
  GroupInvite,
} from "@/types/group-chat";

interface GroupSettingsPanelProps {
  group: GroupChatThread;
  currentUserId: string;
  isCurrentUserAdmin: boolean;
  inviteLinks?: GroupInvite[];
  onUpdateSettings?: (groupId: string, settings: Partial<GroupChatSettings>) => Promise<void>;
  onUpdateGroup?: (request: UpdateGroupRequest) => Promise<void>;
  onCreateInviteLink?: (groupId: string) => Promise<string>;
  onRevokeInviteLink?: (groupId: string, linkId: string) => Promise<void>;
  onArchiveGroup?: (groupId: string) => Promise<void>;
  onExportChatHistory?: (groupId: string) => Promise<void>;
  onDeleteGroup?: (groupId: string) => Promise<void>;
  className?: string;
}

export const GroupSettingsPanel: React.FC<GroupSettingsPanelProps> = ({
  group,
  currentUserId,
  isCurrentUserAdmin,
  inviteLinks = [],
  onUpdateSettings,
  onUpdateGroup,
  onCreateInviteLink,
  onRevokeInviteLink,
  onArchiveGroup,
  onExportChatHistory,
  onDeleteGroup,
  className,
}) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [settings, setSettings] = useState<GroupChatSettings>(group.settings);

  const isCreator = group.createdBy === currentUserId;
  const canManageSettings = isCurrentUserAdmin;
  const canDeleteGroup = isCreator;

  const handleSettingChange = async <K extends keyof GroupChatSettings>(
    key: K,
    value: GroupChatSettings[K]
  ) => {
    if (!canManageSettings || !onUpdateSettings) return;

    setIsUpdating(true);
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await onUpdateSettings(group.id, { [key]: value });
      
      toast({
        title: "Settings updated",
        description: "Group settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      // Revert the local state
      setSettings(group.settings);
      toast({
        title: "Update failed",
        description: "Failed to update group settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateInviteLink = async () => {
    if (!onCreateInviteLink) return;

    setIsCreatingLink(true);
    try {
      const link = await onCreateInviteLink(group.id);
      toast({
        title: "Invite link created",
        description: "New invite link has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating invite link:", error);
      toast({
        title: "Failed to create invite link",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingLink(false);
    }
  };

  const handleCopyInviteLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copied",
        description: "Invite link has been copied to clipboard.",
      });
    } catch (error) {
      console.error("Error copying link:", error);
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleRevokeInviteLink = async (linkId: string) => {
    if (!onRevokeInviteLink) return;

    try {
      await onRevokeInviteLink(group.id, linkId);
      toast({
        title: "Invite link revoked",
        description: "The invite link has been revoked and is no longer valid.",
      });
    } catch (error) {
      console.error("Error revoking invite link:", error);
      toast({
        title: "Failed to revoke link",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Privacy & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Permissions
          </CardTitle>
          <CardDescription>
            Control who can perform various actions in the group
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Message Permissions */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Message Permissions</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Who can send messages</Label>
                  <p className="text-xs text-muted-foreground">
                    Control who can send messages in the group
                  </p>
                </div>
                <Select
                  value={settings.whoCanSendMessages}
                  onValueChange={(value: 'everyone' | 'admins_only') =>
                    handleSettingChange('whoCanSendMessages', value)
                  }
                  disabled={!canManageSettings || isUpdating}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="admins_only">Admins only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Mute non-admin messages</Label>
                  <p className="text-xs text-muted-foreground">
                    Reduce notifications from regular members
                  </p>
                </div>
                <Switch
                  checked={settings.muteNonAdminMessages}
                  onCheckedChange={(checked) =>
                    handleSettingChange('muteNonAdminMessages', checked)
                  }
                  disabled={!canManageSettings || isUpdating}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Member Permissions */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Member Permissions</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Who can add members</Label>
                  <p className="text-xs text-muted-foreground">
                    Control who can invite new people
                  </p>
                </div>
                <Select
                  value={settings.whoCanAddMembers}
                  onValueChange={(value: 'everyone' | 'admins_only') =>
                    handleSettingChange('whoCanAddMembers', value)
                  }
                  disabled={!canManageSettings || isUpdating}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="admins_only">Admins only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Who can edit group info</Label>
                  <p className="text-xs text-muted-foreground">
                    Control who can change group name, description, etc.
                  </p>
                </div>
                <Select
                  value={settings.whoCanEditGroupInfo}
                  onValueChange={(value: 'everyone' | 'admins_only') =>
                    handleSettingChange('whoCanEditGroupInfo', value)
                  }
                  disabled={!canManageSettings || isUpdating}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="admins_only">Admins only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Allow member invites</Label>
                  <p className="text-xs text-muted-foreground">
                    Let members create invite links
                  </p>
                </div>
                <Switch
                  checked={settings.allowMemberInvites}
                  onCheckedChange={(checked) =>
                    handleSettingChange('allowMemberInvites', checked)
                  }
                  disabled={!canManageSettings || isUpdating}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure group notification settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Show member join notifications</Label>
              <p className="text-xs text-muted-foreground">
                Notify when someone joins the group
              </p>
            </div>
            <Switch
              checked={settings.showMemberAddNotifications}
              onCheckedChange={(checked) =>
                handleSettingChange('showMemberAddNotifications', checked)
              }
              disabled={!canManageSettings || isUpdating}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Show member exit notifications</Label>
              <p className="text-xs text-muted-foreground">
                Notify when someone leaves the group
              </p>
            </div>
            <Switch
              checked={settings.showMemberExitNotifications}
              onCheckedChange={(checked) =>
                handleSettingChange('showMemberExitNotifications', checked)
              }
              disabled={!canManageSettings || isUpdating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Advanced security and privacy options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Disappearing messages</Label>
              <p className="text-xs text-muted-foreground">
                Messages automatically delete after a set time
              </p>
            </div>
            <Switch
              checked={settings.disappearingMessages}
              onCheckedChange={(checked) =>
                handleSettingChange('disappearingMessages', checked)
              }
              disabled={!canManageSettings || isUpdating}
            />
          </div>

          {settings.disappearingMessages && (
            <div className="ml-4 p-4 border border-border rounded-lg bg-muted/50">
              <Label>Delete messages after</Label>
              <Select
                value={settings.disappearingMessagesDuration?.toString() || "24"}
                onValueChange={(value) =>
                  handleSettingChange('disappearingMessagesDuration', parseInt(value))
                }
                disabled={!canManageSettings || isUpdating}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="168">7 days</SelectItem>
                  <SelectItem value="720">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Invite Links
          </CardTitle>
          <CardDescription>
            Manage group invite links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create New Link */}
          {canManageSettings && (
            <Button
              onClick={handleCreateInviteLink}
              disabled={isCreatingLink}
              className="w-full"
            >
              {isCreatingLink ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  Create New Invite Link
                </>
              )}
            </Button>
          )}

          {/* Existing Links */}
          {inviteLinks.length > 0 && (
            <div className="space-y-3">
              {inviteLinks.map((inviteLink) => (
                <div key={inviteLink.id} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={inviteLink.isActive ? "default" : "secondary"}>
                          {inviteLink.isActive ? "Active" : "Expired"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Uses: {inviteLink.currentUses}
                          {inviteLink.maxUses && `/${inviteLink.maxUses}`}
                        </span>
                      </div>
                      <p className="text-sm font-mono bg-muted p-2 rounded text-wrap break-all">
                        {inviteLink.link}
                      </p>
                      {inviteLink.expiresAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Expires: {new Date(inviteLink.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyInviteLink(inviteLink.link)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {canManageSettings && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke Invite Link</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to revoke this invite link? It will no longer work.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRevokeInviteLink(inviteLink.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Revoke Link
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {inviteLinks.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Link className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No invite links created yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Actions
          </CardTitle>
          <CardDescription>
            Additional group management options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => onExportChatHistory?.(group.id)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Chat History
            </Button>
            
            {canManageSettings && (
              <Button
                variant="outline"
                onClick={() => onArchiveGroup?.(group.id)}
                className="flex items-center gap-2"
              >
                <Archive className="h-4 w-4" />
                Archive Group
              </Button>
            )}
          </div>

          {/* Danger Zone */}
          {canDeleteGroup && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Group
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Group</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to permanently delete "{group.groupName}"? 
                        This action cannot be undone and all messages, media, and group data will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteGroup?.(group.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Group Permanently
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
