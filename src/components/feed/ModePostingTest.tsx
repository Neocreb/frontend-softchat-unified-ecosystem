import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHybridFeed } from "@/contexts/HybridFeedContext";
import CreatePostWithModeSelection from "./CreatePostWithModeSelection";
import { MessageSquare, List } from "lucide-react";

const ModePostingTest: React.FC = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { viewMode, setViewMode, posts, getCurrentModePosts } = useHybridFeed();

  const allPosts = posts;
  const modePosts = getCurrentModePosts();

  const getPostModeInfo = (post: any) => {
    const settings = post.settings;
    if (settings?.preferredMode) {
      return settings.preferredMode;
    }
    if (post.isUniversalPost) return 'both';
    if (post.isClassicPost) return 'classic';
    if (post.isThreadPost) return 'threaded';
    return 'legacy';
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Mode Posting Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Mode Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Current Mode:</span>
              <Badge variant="outline" className="flex items-center gap-1">
                {viewMode === 'classic' ? <List className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                {viewMode === 'classic' ? 'Classic' : 'Threaded'}
              </Badge>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'classic' ? 'threaded' : 'classic')}
            >
              Switch to {viewMode === 'classic' ? 'Threaded' : 'Classic'}
            </Button>
            
            <Button
              onClick={() => setShowCreatePost(true)}
              size="sm"
            >
              Create Test Post
            </Button>
          </div>

          {/* Post Statistics */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold">{allPosts.length}</p>
              <p className="text-sm text-muted-foreground">Total Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{modePosts.length}</p>
              <p className="text-sm text-muted-foreground">Visible in {viewMode} Mode</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {allPosts.filter(p => getPostModeInfo(p) === 'both').length}
              </p>
              <p className="text-sm text-muted-foreground">Universal Posts</p>
            </div>
          </div>

          {/* Post List */}
          <div className="space-y-2">
            <h4 className="font-medium">Recent Posts:</h4>
            {modePosts.slice(0, 5).map((post) => (
              <div key={post.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{post.author.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {getPostModeInfo(post)}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                </div>
                <p className="text-sm">{post.content}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span>🔄 {post.shares}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mode Analysis */}
          <div className="space-y-2">
            <h4 className="font-medium">Mode Distribution:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Classic Only:</span>
                <span>{allPosts.filter(p => getPostModeInfo(p) === 'classic').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Threaded Only:</span>
                <span>{allPosts.filter(p => getPostModeInfo(p) === 'threaded').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Both Modes:</span>
                <span>{allPosts.filter(p => getPostModeInfo(p) === 'both').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Legacy Posts:</span>
                <span>{allPosts.filter(p => getPostModeInfo(p) === 'legacy').length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Post Modal */}
      <CreatePostWithModeSelection
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
    </div>
  );
};

export default ModePostingTest;
