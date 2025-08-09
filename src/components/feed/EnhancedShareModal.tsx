import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Copy,
  ExternalLink,
  Repeat,
  Quote,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Mail,
  Check,
  Share2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ActivityRewardService } from "@/services/activityRewardService";
import { useNotification } from "@/hooks/use-notification";

interface Post {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  image?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
}

interface EnhancedShareModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onRepost?: (content: string) => void;
  onQuotePost?: (content: string, quotedPost: Post) => void;
  onShareComplete?: () => void;
}

const EnhancedShareModal: React.FC<EnhancedShareModalProps> = ({
  post,
  isOpen,
  onClose,
  onRepost,
  onQuotePost,
  onShareComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'repost' | 'quote'>('share');
  const [repostContent, setRepostContent] = useState("");
  const [quoteContent, setQuoteContent] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const notification = useNotification();

  const postUrl = `${window.location.origin}/post/${post.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Track reward for sharing
      if (user?.id) {
        try {
          const reward = await ActivityRewardService.logShare(
            user.id,
            post.id,
            "post"
          );
          if (reward.success && reward.softPoints > 0) {
            notification.success(`+${reward.softPoints} SoftPoints earned for sharing!`);
          }
        } catch (error) {
          console.error("Failed to log share activity:", error);
        }
      }

      toast({
        title: "Link copied!",
        description: "Post link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleExternalShare = (platform: string) => {
    const text = `Check out this post by ${post.author.name}: ${post.content.slice(0, 100)}${post.content.length > 100 ? '...' : ''}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(postUrl);

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=Check out this post&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      default:
        return;
    }

    // Track reward for external sharing
    if (user?.id) {
      ActivityRewardService.logShare(user.id, post.id, "post").then((reward) => {
        if (reward.success && reward.softPoints > 0) {
          notification.success(`+${reward.softPoints} SoftPoints earned for sharing!`);
        }
      }).catch(console.error);
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    onShareComplete?.();
  };

  const handleRepost = () => {
    if (onRepost) {
      onRepost(repostContent);
      
      // Track reward for reposting
      if (user?.id) {
        ActivityRewardService.logShare(user.id, post.id, "repost").then((reward) => {
          if (reward.success && reward.softPoints > 0) {
            notification.success(`+${reward.softPoints} SoftPoints earned for reposting!`);
          }
        }).catch(console.error);
      }

      toast({
        title: "Reposted!",
        description: "Post has been shared to your feed",
      });
    }
    onClose();
  };

  const handleQuotePost = () => {
    if (onQuotePost && quoteContent.trim()) {
      onQuotePost(quoteContent, post);
      
      // Track reward for quote posting
      if (user?.id) {
        ActivityRewardService.logShare(user.id, post.id, "quote").then((reward) => {
          if (reward.success && reward.softPoints > 0) {
            notification.success(`+${reward.softPoints} SoftPoints earned for quote posting!`);
          }
        }).catch(console.error);
      }

      toast({
        title: "Quote posted!",
        description: "Your quote post has been shared to your feed",
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Post
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={activeTab === 'share' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('share')}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Share Link
          </Button>
          <Button
            variant={activeTab === 'repost' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('repost')}
            className="flex-1"
          >
            <Repeat className="h-4 w-4 mr-2" />
            Repost
          </Button>
          <Button
            variant={activeTab === 'quote' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('quote')}
            className="flex-1"
          >
            <Quote className="h-4 w-4 mr-2" />
            Quote Post
          </Button>
        </div>

        <div className="space-y-4">
          {/* Share Link Tab */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              {/* Copy Link */}
              <div className="space-y-3">
                <h4 className="font-medium">Copy Link</h4>
                <div className="flex gap-2">
                  <Input value={postUrl} readOnly className="flex-1" />
                  <Button onClick={handleCopyLink} variant="outline">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* External Platforms */}
              <div className="space-y-3">
                <h4 className="font-medium">Share to Platform</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleExternalShare('twitter')}
                    className="justify-start"
                  >
                    <Twitter className="h-4 w-4 mr-2 text-blue-500" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExternalShare('facebook')}
                    className="justify-start"
                  >
                    <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExternalShare('linkedin')}
                    className="justify-start"
                  >
                    <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExternalShare('whatsapp')}
                    className="justify-start"
                  >
                    <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExternalShare('email')}
                    className="justify-start col-span-2"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Repost Tab */}
          {activeTab === 'repost' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Repost to your feed</h4>
                <Textarea
                  placeholder="Add your thoughts (optional)..."
                  value={repostContent}
                  onChange={(e) => setRepostContent(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Original Post Preview */}
              <div className="border rounded-lg p-3 bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{post.author.name}</span>
                      {post.author.verified && (
                        <Badge variant="default" className="px-1 py-0 h-4 text-xs">✓</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">@{post.author.username}</span>
                  </div>
                </div>
                <p className="text-sm">{post.content}</p>
                {post.image && (
                  <img src={post.image} alt="Post" className="mt-2 rounded max-h-32 object-cover" />
                )}
              </div>

              <Button onClick={handleRepost} className="w-full">
                <Repeat className="h-4 w-4 mr-2" />
                Repost
              </Button>
            </div>
          )}

          {/* Quote Post Tab */}
          {activeTab === 'quote' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Add your comment</h4>
                <Textarea
                  placeholder="What's your take on this?"
                  value={quoteContent}
                  onChange={(e) => setQuoteContent(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Original Post Preview */}
              <div className="border rounded-lg p-3 bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{post.author.name}</span>
                      {post.author.verified && (
                        <Badge variant="default" className="px-1 py-0 h-4 text-xs">✓</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">@{post.author.username}</span>
                  </div>
                </div>
                <p className="text-sm">{post.content}</p>
                {post.image && (
                  <img src={post.image} alt="Post" className="mt-2 rounded max-h-32 object-cover" />
                )}
              </div>

              <Button 
                onClick={handleQuotePost} 
                disabled={!quoteContent.trim()}
                className="w-full"
              >
                <Quote className="h-4 w-4 mr-2" />
                Quote Post
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedShareModal;
