import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image, Video, Smile } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CreatePostTriggerProps {
  onOpenCreatePost: () => void;
}

const CreatePostTrigger: React.FC<CreatePostTriggerProps> = ({ onOpenCreatePost }) => {
  const { user } = useAuth();

  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "@user"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          
          <button
            onClick={onOpenCreatePost}
            className="flex-1 text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            What's on your mind?
          </button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenCreatePost}
            className="text-gray-500 hover:text-gray-700"
          >
            <Image className="h-6 w-6" />
          </Button>
        </div>
        
        <hr className="my-3" />
        
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenCreatePost}
            className="flex-1 text-gray-600 hover:bg-gray-100 flex items-center justify-center gap-2"
          >
            <Video className="h-5 w-5 text-red-500" />
            Live video
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenCreatePost}
            className="flex-1 text-gray-600 hover:bg-gray-100 flex items-center justify-center gap-2"
          >
            <Image className="h-5 w-5 text-green-500" />
            Photo/video
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenCreatePost}
            className="flex-1 text-gray-600 hover:bg-gray-100 flex items-center justify-center gap-2"
          >
            <Smile className="h-5 w-5 text-yellow-500" />
            Feeling/activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePostTrigger;
