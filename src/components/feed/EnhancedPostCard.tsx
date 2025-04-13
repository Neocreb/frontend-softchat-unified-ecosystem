
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import PostActions from "./PostActions";
import { Post } from "./PostCard";

interface EnhancedPostCardProps {
  post: Post;
}

const EnhancedPostCard: React.FC<EnhancedPostCardProps> = ({ post }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <span className="font-semibold">{post.author.name}</span>
              {post.author.verified && (
                <Badge variant="outline" className="ml-1 bg-blue-500 p-0">
                  <Check className="h-3 w-3 text-white" />
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>@{post.author.username}</span>
              <span>·</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <div className="mt-3 overflow-hidden rounded-lg">
            <img
              src={post.image}
              alt="Post attachment"
              className="h-auto w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-0 px-4">
        <PostActions
          postId={post.id}
          initialLikes={post.likes}
          initialComments={post.comments}
          initialShares={post.shares}
          initialLiked={post.liked}
        />
      </CardFooter>
    </Card>
  );
};

export default EnhancedPostCard;
