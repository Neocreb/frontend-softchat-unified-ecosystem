import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare } from "lucide-react";

const ChatTest = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatType = searchParams.get("type");

  const goBack = () => {
    navigate("/app/chat");
  };

  const testLocalStorage = () => {
    try {
      const data = localStorage.getItem(`chat_${threadId}`);
      console.log("localStorage data:", data);
      return data;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen p-4 bg-background">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat Test Page
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Route Parameters</h3>
              <div className="text-sm space-y-1">
                <p><strong>Thread ID:</strong> {threadId || "None"}</p>
                <p><strong>Chat Type:</strong> {chatType || "None"}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">URL Info</h3>
              <div className="text-sm space-y-1">
                <p><strong>Pathname:</strong> {window.location.pathname}</p>
                <p><strong>Search:</strong> {window.location.search || "None"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">LocalStorage Data</h3>
            <div className="bg-muted p-3 rounded-lg text-sm font-mono">
              <pre>{testLocalStorage() || "No data found"}</pre>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Test Actions</h3>
            <div className="flex gap-2">
              <Button onClick={goBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat List
              </Button>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
              <Button 
                onClick={() => {
                  try {
                    navigate(`/app/chat/${threadId}?type=${chatType}`);
                  } catch (error) {
                    console.error("Navigation error:", error);
                  }
                }}
                variant="outline"
              >
                Try ChatRoom
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Debug Info</h3>
            <div className="text-xs text-muted-foreground">
              <p>This page loads successfully, which means routing works.</p>
              <p>If you can see this page but ChatRoom fails, the issue is in ChatRoom component.</p>
              <p>Check the browser console for JavaScript errors.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatTest;
