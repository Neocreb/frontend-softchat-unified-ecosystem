import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { chatInitiationService } from "@/services/chatInitiationService";

interface QuickMessageButtonProps {
  type: 'user' | 'group' | 'page';
  targetId: string;
  targetName: string;
  context?: string;
  adminIds?: string[];
  ownerId?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export const QuickMessageButton: React.FC<QuickMessageButtonProps> = ({
  type,
  targetId,
  targetName,
  context,
  adminIds,
  ownerId,
  variant = "outline",
  size = "sm",
  className = "",
  children
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click events
    
    await chatInitiationService.handleMessageButton({
      type,
      targetId,
      targetName,
      context,
      adminIds,
      ownerId,
      navigate,
      toast
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
      title={`Message ${targetName}`}
    >
      {children || (
        <>
          <MessageSquare className="w-4 h-4 mr-2" />
          Message
        </>
      )}
    </Button>
  );
};

export default QuickMessageButton;
