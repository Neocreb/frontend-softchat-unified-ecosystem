import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHybridFeed } from "@/contexts/HybridFeedContext";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, List, TestTube } from "lucide-react";

const ModeTestButton: React.FC = () => {
  const { viewMode, setViewMode, addPost, posts, getCurrentModePosts } = useHybridFeed();
  const { user } = useAuth();
  const [testCounter, setTestCounter] = useState(1);

  const createTestPost = (mode: 'classic' | 'threaded' | 'both') => {
    const postId = `test_${Date.now()}`;
    
    const newPost = {
      content: `Test post #${testCounter} created for ${mode} mode(s)`,
      author: {
        name: user?.name || 'Test User',
        username: user?.username || 'testuser',
        avatar: user?.avatar || '/placeholder.svg',
        verified: false,
      },
      likes: 0,
      comments: 0,
      shares: 0,
      gifts: 0,
      type: 'post' as const,
      isReply: false,
      privacy: 'public',
      isThreadPost: mode === 'threaded',
      isClassicPost: mode === 'classic',
      isUniversalPost: mode === 'both',
      settings: {
        enableComments: true,
        preferredMode: mode,
        publishedFromMode: viewMode,
      },
    };

    addPost(newPost);
    setTestCounter(prev => prev + 1);
  };

  const allPosts = posts.length;
  const modePosts = getCurrentModePosts().length;

  return (
    <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
      <div className="flex items-center gap-2">
        <TestTube className="h-4 w-4" />
        <span className="font-medium">Mode Testing</span>
        <Badge variant="outline">
          Current: {viewMode}
        </Badge>
        <Badge variant="secondary">
          {modePosts}/{allPosts} posts
        </Badge>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === 'classic' ? 'threaded' : 'classic')}
        >
          {viewMode === 'classic' ? <MessageSquare className="h-3 w-3 mr-1" /> : <List className="h-3 w-3 mr-1" />}
          Switch to {viewMode === 'classic' ? 'Threaded' : 'Classic'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => createTestPost('classic')}
        >
          Test Classic Post
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => createTestPost('threaded')}
        >
          Test Threaded Post
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => createTestPost('both')}
        >
          Test Universal Post
        </Button>
      </div>
    </div>
  );
};

export default ModeTestButton;
