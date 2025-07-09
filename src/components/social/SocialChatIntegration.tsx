import React from "react";
import { useSocialChat } from "@/hooks/use-chat-integration";
import { SocialChatButton } from "@/components/chat/ChatActionButtons";
import { Button } from "@/components/ui/button";
import { MessageCircle, Reply, Heart, Share, Users } from "lucide-react";

interface PostChatIntegrationProps {
  postId: string;
  authorId: string;
  authorName: string;
  isOwnPost?: boolean;
}

export const PostChatIntegration: React.FC<PostChatIntegrationProps> = ({
  postId,
  authorId,
  authorName,
  isOwnPost = false,
}) => {
  const { replyToPost, isCreatingChat } = useSocialChat();

  const handleReplyToPost = () => {
    replyToPost(authorId, postId);
  };

  if (isOwnPost) {
    return null; // Don't show chat button for own posts
  }

  return (
    <SocialChatButton
      context="reply"
      variant="ghost"
      size="sm"
      loading={isCreatingChat}
      onClick={handleReplyToPost}
    >
      <Reply className="w-4 h-4" />
      Reply to {authorName}
    </SocialChatButton>
  );
};

// Profile chat integration
interface ProfileChatIntegrationProps {
  userId: string;
  userName: string;
  isOwnProfile?: boolean;
  relationship?: "none" | "following" | "follower" | "mutual";
}

export const ProfileChatIntegration: React.FC<ProfileChatIntegrationProps> = ({
  userId,
  userName,
  isOwnProfile = false,
  relationship = "none",
}) => {
  const { startSocialChat, isCreatingChat } = useSocialChat();

  const handleSendMessage = () => {
    startSocialChat(userId);
  };

  if (isOwnProfile) {
    return null;
  }

  return (
    <SocialChatButton
      context="dm"
      loading={isCreatingChat}
      onClick={handleSendMessage}
      className="flex items-center gap-2"
    >
      <MessageCircle className="w-4 h-4" />
      Message {userName}
    </SocialChatButton>
  );
};

// Comment reply integration
interface CommentReplyIntegrationProps {
  commentId: string;
  commenterUid: string;
  commenterName: string;
  postId: string;
}

export const CommentReplyIntegration: React.FC<
  CommentReplyIntegrationProps
> = ({ commentId, commenterUid, commenterName, postId }) => {
  const { startSocialChat, isCreatingChat } = useSocialChat();

  const handleReplyToComment = () => {
    startSocialChat(commenterUid, {
      postId,
      interactionType: "comment_reply",
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleReplyToComment}
      disabled={isCreatingChat}
      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
    >
      <Reply className="w-3 h-3 mr-1" />
      Reply
    </Button>
  );
};

// Group/Event chat integration
interface GroupChatIntegrationProps {
  groupId: string;
  groupName: string;
  eventId?: string;
  eventName?: string;
  memberCount?: number;
  isJoined?: boolean;
}

export const GroupChatIntegration: React.FC<GroupChatIntegrationProps> = ({
  groupId,
  groupName,
  eventId,
  eventName,
  memberCount,
  isJoined = false,
}) => {
  const { startSocialChat, isCreatingChat } = useSocialChat();

  const handleJoinDiscussion = () => {
    startSocialChat(groupId, {
      groupId,
      eventId,
      interactionType: eventId ? "event_discussion" : "group_chat",
    });
  };

  if (!isJoined) {
    return (
      <Button variant="outline" disabled>
        <Users className="w-4 h-4 mr-2" />
        Join to Chat
      </Button>
    );
  }

  return (
    <SocialChatButton
      context="group"
      loading={isCreatingChat}
      onClick={handleJoinDiscussion}
      className="flex items-center gap-2"
    >
      <Users className="w-4 h-4" />
      {eventName ? `Discuss ${eventName}` : `Chat in ${groupName}`}
      {memberCount && (
        <span className="text-xs text-muted-foreground">
          ({memberCount} members)
        </span>
      )}
    </SocialChatButton>
  );
};

// Social action bar with chat integration
interface SocialActionBarProps {
  postId: string;
  authorId: string;
  authorName: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isOwnPost?: boolean;
}

export const SocialActionBar: React.FC<SocialActionBarProps> = ({
  postId,
  authorId,
  authorName,
  likes,
  comments,
  shares,
  isLiked = false,
  isOwnPost = false,
}) => {
  const { replyToPost, isCreatingChat } = useSocialChat();

  const handleLike = () => {
    // Handle like action
    console.log("Liked post:", postId);
  };

  const handleShare = () => {
    // Handle share action
    console.log("Shared post:", postId);
  };

  const handleComment = () => {
    if (!isOwnPost) {
      replyToPost(authorId, postId);
    }
  };

  return (
    <div className="flex items-center justify-between pt-3 border-t">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center gap-1 ${isLiked ? "text-red-500" : ""}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          <span className="text-sm">{likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleComment}
          disabled={isOwnPost || isCreatingChat}
          className="flex items-center gap-1"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{comments}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-1"
        >
          <Share className="w-4 h-4" />
          <span className="text-sm">{shares}</span>
        </Button>
      </div>

      {!isOwnPost && (
        <SocialChatButton
          context="reply"
          variant="ghost"
          size="sm"
          loading={isCreatingChat}
          onClick={() => replyToPost(authorId, postId)}
        >
          Message {authorName}
        </SocialChatButton>
      )}
    </div>
  );
};

// Follow/Message user component
interface FollowMessageProps {
  userId: string;
  userName: string;
  isFollowing?: boolean;
  isOwnProfile?: boolean;
}

export const FollowMessage: React.FC<FollowMessageProps> = ({
  userId,
  userName,
  isFollowing = false,
  isOwnProfile = false,
}) => {
  const { startSocialChat, isCreatingChat } = useSocialChat();

  const handleFollow = () => {
    // Handle follow action
    console.log("Followed user:", userId);
  };

  const handleMessage = () => {
    startSocialChat(userId);
  };

  if (isOwnProfile) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={isFollowing ? "outline" : "default"}
        onClick={handleFollow}
        className="flex-1"
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>

      <SocialChatButton
        context="dm"
        variant="outline"
        loading={isCreatingChat}
        onClick={handleMessage}
        className="flex-1"
      >
        Message
      </SocialChatButton>
    </div>
  );
};
