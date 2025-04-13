
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export type Post = {
  id: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
    verified?: boolean;
  };
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
  bookmarked?: boolean;
};

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(post.bookmarked || false);

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 pt-4 px-4 flex flex-row gap-3 items-start">
        <Avatar className="h-9 w-9">
          <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
          <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center">
            <span className="font-semibold">{post.author.name}</span>
            {post.author.verified && (
              <Badge variant="default" className="ml-1 px-1 py-0 h-5 bg-softchat-primary hover:bg-softchat-primary/90">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3 w-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>@{post.author.username}</span>
            <span className="mx-1">·</span>
            <span>{post.createdAt}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-4 py-3 text-sm">
        <p className="mb-3">{post.content}</p>
        {post.image && (
          <div className="overflow-hidden rounded-md -mx-1">
            <img
              src={post.image}
              alt="Post image"
              className="w-full object-cover transition-all hover:scale-105"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 pt-1 pb-3 border-t flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1 text-muted-foreground",
            liked && "text-softchat-accent"
          )}
          onClick={handleLike}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-current")} />
          <span>{likesCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-muted-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-muted-foreground"
        >
          <Share2 className="h-4 w-4" />
          <span>{post.shares}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-muted-foreground",
            bookmarked && "text-softchat-primary"
          )}
          onClick={handleBookmark}
        >
          <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
