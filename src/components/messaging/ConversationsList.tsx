
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRealtimeMessaging } from '@/hooks/use-realtime-messaging';
import { useAuth } from '@/contexts/AuthContext';

interface ConversationsListProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId: string | null;
}

const ConversationsList: React.FC<ConversationsListProps> = ({ 
  onSelectConversation, 
  selectedConversationId 
}) => {
  const { conversations, loading } = useRealtimeMessaging();
  const { user } = useAuth();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getOtherParticipant = (participants: string[]) => {
    return participants.find(p => p !== user?.id) || 'Unknown';
  };

  if (loading) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64">
          {conversations.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4">
              <p className="text-muted-foreground text-sm">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => {
                const otherParticipantId = getOtherParticipant(conversation.participants);
                const isSelected = conversation.id === selectedConversationId;
                
                return (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors ${
                      isSelected ? 'bg-muted' : ''
                    }`}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">
                          User {otherParticipantId.substring(0, 8)}
                        </p>
                        <div className="flex items-center gap-1">
                          {conversation.last_message && (
                            <span className="text-xs text-muted-foreground">
                              {formatTime(conversation.last_message.created_at)}
                            </span>
                          )}
                          {conversation.unread_count && conversation.unread_count > 0 && (
                            <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {conversation.last_message && (
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationsList;
