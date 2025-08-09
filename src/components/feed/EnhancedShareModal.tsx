import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Share2,
  MessageSquareQuote,
  Link,
  MessageCircle,
  Twitter,
  Facebook,
  Instagram,
  Copy,
  Send,
} from "lucide-react";
import { useNotification } from "@/hooks/use-notification";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface EnhancedShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: string;
    content: string;
    author: {
      name: string;
      username: string;
      avatar: string;
      verified?: boolean;
    };
    media?: { type: string; url: string; alt?: string }[];
  };
  onShare?: (type: 'share' | 'repost' | 'quote', content?: string) => void;
}

const EnhancedShareModal: React.FC<EnhancedShareModalProps> = ({
  isOpen,
  onClose,
  post,
  onShare,
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'repost' | 'quote'>('share');
  const [quoteContent, setQuoteContent] = useState("");
  const notification = useNotification();
  const { user } = useAuth();

  const handleShare = async (platform: string) => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    let shareUrl = '';

    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(postUrl);
        notification.success("Link copied to clipboard!");
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.content.substring(0, 100) + '...')}`;
        window.open(shareUrl, '_blank');
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(post.content + ' ' + postUrl)}`;
        window.open(shareUrl, '_blank');
        break;
    }

    onShare?.('share');
    onClose();
  };

  const handleRepost = () => {
    onShare?.('repost');
    notification.success("Post reposted to your timeline!");
    onClose();
  };

  const handleQuotePost = () => {
    if (!quoteContent.trim()) {
      notification.error("Please add your thoughts to quote this post");
      return;
    }
    onShare?.('quote', quoteContent);
    notification.success("Quote post created!");
    setQuoteContent("");
    onClose();
  };

  const shareOptions = [
    { id: 'copy', icon: Copy, label: 'Copy Link', color: 'text-gray-600' },
    { id: 'twitter', icon: Twitter, label: 'Twitter', color: 'text-blue-400' },
    { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-600' },
    { id: 'whatsapp', icon: Send, label: 'WhatsApp', color: 'text-green-500' },
  ];

  const tabs = [
    { id: 'share', icon: Share2, label: 'Share' },
    { id: 'repost', icon: MessageSquareQuote, label: 'Repost' },
    { id: 'quote', icon: MessageCircle, label: 'Quote' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={cn(
                "flex-1 rounded-none border-b-2 border-transparent",
                activeTab === tab.id && "border-primary bg-primary/5"
              )}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Original Post Preview */}
          <div className="border rounded-lg p-3 bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{post.author.name}</span>
              <span className="text-sm text-muted-foreground">@{post.author.username}</span>
              {post.author.verified && (
                <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <p className="text-sm">{post.content}</p>
            {post.media && post.media.length > 0 && (
              <div className="mt-2">
                <img
                  src={post.media[0].url}
                  alt={post.media[0].alt}
                  className="w-full max-h-32 object-cover rounded"
                />
              </div>
            )}
          </div>

          {/* Share Tab */}
          {activeTab === 'share' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Share this post on other platforms
              </p>
              <div className="grid grid-cols-2 gap-2">
                {shareOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => handleShare(option.id)}
                  >
                    <option.icon className={cn("h-4 w-4", option.color)} />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Repost Tab */}
          {activeTab === 'repost' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Repost this to your timeline without adding a comment
              </p>
              <Button onClick={handleRepost} className="w-full">
                <MessageSquareQuote className="h-4 w-4 mr-2" />
                Repost
              </Button>
            </div>
          )}

          {/* Quote Tab */}
          {activeTab === 'quote' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Add your thoughts to this post
              </p>
              {user && (
                <div className="flex items-start gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add your thoughts..."
                      value={quoteContent}
                      onChange={(e) => setQuoteContent(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              )}
              <Button 
                onClick={handleQuotePost} 
                disabled={!quoteContent.trim()}
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
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
