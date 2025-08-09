import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  ExternalLink, 
  Repeat, 
  Quote,
  MessageSquareQuote,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Send,
  Link,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNotification } from '@/hooks/use-notification';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedActivityService } from '@/services/unifiedActivityService';
import { cn } from '@/lib/utils';

interface ShareDialogProps {
  postId: string;
  postContent: string;
  postAuthor: {
    name: string;
    username: string;
  };
  trigger: React.ReactNode;
  onRepost?: (content: string) => void;
  onQuotePost?: (content: string) => void;
}

const EnhancedShareDialog: React.FC<ShareDialogProps> = ({
  postId,
  postContent,
  postAuthor,
  trigger,
  onRepost,
  onQuotePost
}) => {
  const [open, setOpen] = useState(false);
  const [repostContent, setRepostContent] = useState('');
  const [quoteContent, setQuoteContent] = useState('');
  const [activeTab, setActiveTab] = useState<'share' | 'repost' | 'quote'>('share');
  const [copied, setCopied] = useState(false);
  const notification = useNotification();
  const { user } = useAuth();

  const postUrl = `${window.location.origin}/app/post/${postId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      notification.success('Link copied to clipboard!');
      
      // Track reward for sharing
      if (user?.id) {
        const reward = await UnifiedActivityService.trackShare(user.id, postId, 'copy_link');
        if (reward.success && reward.softPoints > 0) {
          notification.success(`+${reward.softPoints} SoftPoints earned!`, {
            description: 'Thanks for sharing!'
          });
        }
      }
    } catch (error) {
      notification.error('Failed to copy link');
    }
  };

  const handleExternalShare = async (platform: string) => {
    let shareUrl = '';
    const text = `Check out this post by @${postAuthor.username}: "${postContent.substring(0, 100)}${postContent.length > 100 ? '...' : ''}"`;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${postUrl}`)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    // Track reward for external sharing
    if (user?.id) {
      const reward = await UnifiedActivityService.trackShare(user.id, postId, platform);
      if (reward.success && reward.softPoints > 0) {
        notification.success(`+${reward.softPoints} SoftPoints earned!`, {
          description: `Thanks for sharing to ${platform}!`
        });
      }
    }
    
    notification.success(`Shared to ${platform}!`);
  };

  const handleRepost = async () => {
    if (!onRepost) return;
    
    onRepost(repostContent);
    setRepostContent('');
    setOpen(false);
    
    // Track reward for reposting
    if (user?.id) {
      const reward = await UnifiedActivityService.trackShare(user.id, postId, 'repost');
      if (reward.success && reward.softPoints > 0) {
        notification.success(`+${reward.softPoints} SoftPoints earned!`, {
          description: 'Thanks for reposting!'
        });
      }
    }
    
    notification.success('Post reposted successfully!');
  };

  const handleQuotePost = async () => {
    if (!onQuotePost || !quoteContent.trim()) return;
    
    onQuotePost(quoteContent);
    setQuoteContent('');
    setOpen(false);
    
    // Track reward for quote posting
    if (user?.id) {
      await ActivityRewardService.logShare(user.id, postId, 'quote_post');
    }
    
    notification.success('Quote post created successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Post
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === 'share' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('share')}
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
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
            Quote
          </Button>
        </div>

        <div className="space-y-4">
          {/* Share Tab */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              {/* Copy Link */}
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <div className="flex-1">
                  <Input
                    value={postUrl}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className={cn(copied && "bg-green-50 border-green-200")}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Separator />

              {/* External Platforms */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Share to social media</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExternalShare('twitter')}
                    className="justify-start"
                  >
                    <Twitter className="h-4 w-4 mr-2 text-blue-500" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExternalShare('facebook')}
                    className="justify-start"
                  >
                    <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExternalShare('linkedin')}
                    className="justify-start"
                  >
                    <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExternalShare('whatsapp')}
                    className="justify-start"
                  >
                    <Send className="h-4 w-4 mr-2 text-green-500" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Repost Tab */}
          {activeTab === 'repost' && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    <Repeat className="h-3 w-3 mr-1" />
                    Reposting
                  </Badge>
                  <span className="text-sm font-medium">@{postAuthor.username}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {postContent.substring(0, 150)}
                  {postContent.length > 150 && '...'}
                </p>
              </div>
              
              <Textarea
                placeholder="Add your thoughts (optional)..."
                value={repostContent}
                onChange={(e) => setRepostContent(e.target.value)}
                className="min-h-[80px]"
              />
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRepost}>
                  <Repeat className="h-4 w-4 mr-2" />
                  Repost
                </Button>
              </div>
            </div>
          )}

          {/* Quote Post Tab */}
          {activeTab === 'quote' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Add your comment..."
                value={quoteContent}
                onChange={(e) => setQuoteContent(e.target.value)}
                className="min-h-[100px]"
                required
              />
              
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    <MessageSquareQuote className="h-3 w-3 mr-1" />
                    Quoting
                  </Badge>
                  <span className="text-sm font-medium">@{postAuthor.username}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {postContent.substring(0, 150)}
                  {postContent.length > 150 && '...'}
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleQuotePost}
                  disabled={!quoteContent.trim()}
                >
                  <Quote className="h-4 w-4 mr-2" />
                  Quote Post
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedShareDialog;
