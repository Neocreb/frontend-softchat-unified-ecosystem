import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  users: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  isMobile?: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  users,
  isMobile = false,
}) => {
  if (users.length === 0) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 p-3 mx-4 mb-2",
      isMobile ? "mx-2" : "mx-4"
    )}>
      <div className="flex -space-x-2">
        {users.slice(0, 3).map((user) => (
          <Avatar key={user.id} className="w-6 h-6 border-2 border-background">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl px-4 py-2 relative shadow-sm">
          <div className="flex items-center gap-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
          {/* Chat bubble tail */}
          <div className="absolute bottom-0 -left-1 w-3 h-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rotate-45 transform origin-bottom-right" />
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          {users.length === 1 
            ? `${users[0].name} is typing...`
            : users.length === 2
            ? `${users[0].name} and ${users[1].name} are typing...`
            : `${users[0].name} and ${users.length - 1} others are typing...`
          }
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
