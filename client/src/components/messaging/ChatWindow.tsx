
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X } from 'lucide-react';
import { useRealtimeMessaging } from '@/hooks/use-realtime-messaging';
import { useAuth } from '@/contexts/AuthContext';

interface ChatWindowProps {
  conversationId: string | null;
  onClose: () => void;
  otherUser?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onClose, otherUser }) => {
  const [messageInput, setMessageInput] = useState('');
  const { messages, sendMessage } = useRealtimeMessaging();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    await sendMessage(messageInput);
    setMessageInput('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!conversationId) {
    return (
      <Card className="w-full max-w-md h-96">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Select a conversation to start chatting</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md h-96 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          {otherUser && (
            <>
              <Avatar className="h-8 w-8">
                <AvatarImage src={otherUser.avatar} />
                <AvatarFallback>{otherUser.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{otherUser.name}</span>
            </>
          )}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 py-2">
            {messages.map((message) => {
              const isOwnMessage = message.sender_id === user?.id;
              return (
                <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg px-3 py-2 ${
                    isOwnMessage 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" size="sm" disabled={!messageInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;
