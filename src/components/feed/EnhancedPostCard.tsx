
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, MoreHorizontal, MessageCircle, Share2, Bookmark } from "lucide-react";
import Reactions from "./Reactions";
import { Post } from "./PostCard";
import { cn } from "@/utils/utils";

interface EnhancedPostCardProps {
  post: Post;
}

const EnhancedPostCard: React.FC<EnhancedPostCardProps> = ({ post }) => {
  const [bookmarked, setBookmarked] = useState(post.bookmarked || false);

  const handleReact = (postId: string, reaction: string) => {
    console.log(`Reacted with ${reaction} to post ${postId}`);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <Card className="overflow-hidden shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-blue-100">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {post.author.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <span className="font-semibold text-gray-900">{post.author.name}</span>
              {post.author.verified && (
                <Badge variant="outline" className="ml-2 bg-blue-500 border-blue-500 p-0 h-5 w-5 rounded-full">
                  <Check className="h-3 w-3 text-white" />
                </Badge>
              )}
              {post.isAd && (
                <Badge variant="secondary" className="ml-2 text-xs bg-gray-100 text-gray-600">
                  Sponsored
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>@{post.author.username}</span>
              <span>·</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-gray-500 hover:bg-gray-100">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-3">
        <p className="whitespace-pre-wrap text-gray-800 leading-relaxed mb-3">{post.content}</p>
        
        {post.image && (
          <div className="overflow-hidden rounded-xl bg-gray-100 group">
            <img
              src={post.image}
              alt="Post attachment"
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}
        
        {post.isAd && post.adUrl && (
          <div className="mt-4">
            <Button
              variant="default"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02]"
              onClick={() => window.open(post.adUrl, '_blank')}
            >
              {post.adCta || "Learn More"} 
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 p-0">
        <div className="w-full p-4 space-y-3">
          {/* Reaction counts display */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <span className="flex -space-x-1">
                <span className="text-base">👍</span>
                <span className="text-base">❤️</span>
                <span className="text-base">😮</span>
              </span>
              <span>{post.likes || 0}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{post.comments || 0} comments</span>
              <span>{post.shares || 0} shares</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <Reactions
              postId={post.id}
              initialReactions={{
                like: Math.floor((post.likes || 0) * 0.7),
                love: Math.floor((post.likes || 0) * 0.2),
                wow: Math.floor((post.likes || 0) * 0.05),
                angry: Math.floor((post.likes || 0) * 0.03),
                sad: Math.floor((post.likes || 0) * 0.02)
              }}
              onReact={handleReact}
            />
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800 px-4 py-2 rounded-full transition-all duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Comment</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800 px-4 py-2 rounded-full transition-all duration-200"
            >
              <Share2 className="h-5 w-5" />
              <span className="font-medium">Share</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-600 hover:bg-gray-50 p-2 rounded-full transition-all duration-200",
                bookmarked && "text-blue-600 hover:text-blue-700"
              )}
              onClick={handleBookmark}
            >
              <Bookmark className={cn("h-5 w-5", bookmarked && "fill-current")} />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnhancedPostCard;
