
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Mic, 
  MicOff, 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  Heart,
  ThumbsUp,
  Laugh,
  Reply,
  Download
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/utils/utils";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'voice' | 'file' | 'image' | 'video';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  duration?: number;
  reply_to_id?: string;
  created_at: string;
  read: boolean;
  sender: {
    name: string;
    avatar: string;
  };
  reactions?: Array<{
    emoji: string;
    user_id: string;
    count: number;
  }>;
  reply_to?: Message;
}

interface EnhancedMessagingProps {
  conversationId: string;
  recipientName: string;
  recipientAvatar: string;
}

const EnhancedMessaging = ({ conversationId, recipientName, recipientAvatar }: EnhancedMessagingProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profiles:sender_id (
          name,
          avatar_url
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (data) {
      const formattedMessages = data.map(msg => ({
        ...msg,
        sender: {
          name: msg.profiles?.name || 'Unknown',
          avatar: msg.profiles?.avatar_url || '/placeholder.svg'
        }
      }));
      setMessages(formattedMessages);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        fetchMessages(); // Refetch to get complete message with sender info
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !replyingTo) return;

    const messageData = {
      conversation_id: conversationId,
      sender_id: user?.id,
      content: newMessage,
      message_type: 'text' as const,
      reply_to_id: replyingTo?.id
    };

    const { error } = await supabase
      .from('chat_messages')
      .insert(messageData);

    if (!error) {
      setNewMessage("");
      setReplyingTo(null);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      recordedChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(recordedChunks.current, { type: 'audio/webm' });
        await uploadVoiceMessage(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const uploadVoiceMessage = async (blob: Blob) => {
    // In a real implementation, you would upload to Supabase storage
    // For now, we'll simulate it
    const messageData = {
      conversation_id: conversationId,
      sender_id: user?.id,
      content: "Voice message",
      message_type: 'voice' as const,
      duration: 10 // Placeholder duration
    };

    await supabase
      .from('chat_messages')
      .insert(messageData);
  };

  const addReaction = async (messageId: string, emoji: string) => {
    const { error } = await supabase
      .from('message_reactions')
      .insert({
        message_id: messageId,
        user_id: user?.id,
        emoji
      });

    if (!error) {
      // Refresh messages to show new reaction
      fetchMessages();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={recipientAvatar} />
            <AvatarFallback>{recipientName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{recipientName}</h3>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="group">
            {/* Reply indicator */}
            {message.reply_to && (
              <div className="ml-12 mb-2 p-2 bg-muted rounded text-sm text-muted-foreground border-l-2 border-muted-foreground">
                Replying to: {message.reply_to.content}
              </div>
            )}
            
            <div className={cn(
              "flex gap-3",
              message.sender_id === user?.id ? "justify-end" : "justify-start"
            )}>
              {message.sender_id !== user?.id && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={message.sender.avatar} />
                  <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                </Avatar>
              )}
              
              <div className={cn(
                "max-w-[70%] space-y-1",
                message.sender_id === user?.id ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "rounded-lg p-3 relative group",
                  message.sender_id === user?.id
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                )}>
                  {/* Message content based on type */}
                  {message.message_type === 'text' && (
                    <p className="text-sm">{message.content}</p>
                  )}
                  
                  {message.message_type === 'voice' && (
                    <div className="flex items-center gap-2 min-w-[200px]">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </Button>
                      <div className="flex-1">
                        <div className="bg-white/20 h-1 rounded-full">
                          <div className="bg-white h-full w-1/3 rounded-full"></div>
                        </div>
                      </div>
                      <span className="text-xs">{formatDuration(message.duration || 0)}</span>
                    </div>
                  )}
                  
                  {message.message_type === 'file' && (
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <Paperclip className="h-4 w-4" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{message.file_name}</p>
                        <p className="text-xs opacity-70">{formatFileSize(message.file_size || 0)}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {(message.message_type === 'image' || message.message_type === 'video') && (
                    <div className="max-w-[300px]">
                      {message.message_type === 'image' ? (
                        <img 
                          src={message.file_url} 
                          alt="Shared image" 
                          className="rounded max-h-[300px] object-cover"
                        />
                      ) : (
                        <video 
                          src={message.file_url} 
                          controls 
                          className="rounded max-h-[300px]"
                        />
                      )}
                    </div>
                  )}

                  {/* Reaction picker */}
                  <div className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1 bg-background border rounded-full p-1 shadow-lg">
                      {['❤️', '👍', '😂', '😮', '😢', '🔥'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(message.id, emoji)}
                          className="hover:scale-110 transition-transform text-sm p-1"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Message actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(message)}
                    className="h-6 px-2 text-xs"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>

                {/* Reactions display */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {message.reactions.map((reaction, index) => (
                      <span
                        key={index}
                        className="bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1"
                      >
                        {reaction.emoji} {reaction.count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-muted border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Reply className="h-4 w-4" />
              <span className="text-sm">Replying to {replyingTo.sender.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
            >
              Cancel
            </Button>
          </div>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {replyingTo.content}
          </p>
        </div>
      )}

      {/* Message input */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-full px-4 py-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
          </div>

          {newMessage.trim() ? (
            <Button onClick={sendMessage} size="icon">
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant={isRecording ? "destructive" : "ghost"}
              size="icon"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessaging;
