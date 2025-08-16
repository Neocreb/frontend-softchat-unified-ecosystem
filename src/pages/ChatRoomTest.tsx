import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ChatRoomTest = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const chatType = searchParams.get("type") || "social";

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/app/chat")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="font-semibold">Test Chat Room</h3>
            <p className="text-sm text-muted-foreground">
              Chat ID: {chatId} | Type: {chatType}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">✅ Chat Room Loaded Successfully!</h2>
          <p className="text-muted-foreground mb-4">
            If you can see this, the navigation is working correctly.
          </p>
          <div className="bg-muted p-4 rounded-lg mb-4">
            <p><strong>Chat ID:</strong> {chatId}</p>
            <p><strong>Chat Type:</strong> {chatType}</p>
          </div>
          <Button onClick={() => navigate("/app/chat")}>
            Back to Chat List
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomTest;
