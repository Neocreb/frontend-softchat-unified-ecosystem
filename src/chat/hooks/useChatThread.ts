import { useState, useEffect, useCallback } from "react";
import { ChatThread, ChatMessage, ChatFilter } from "@/types/chat";
import { chatService } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useChatThread = (threadId?: string) => {
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load thread data
  const loadThread = useCallback(async () => {
    if (!threadId) return;

    try {
      setLoading(true);
      setError(null);

      const threadData = await chatService.getChatThread(threadId);
      if (threadData) {
        setThread(threadData);

        // Mark thread as read
        await chatService.markAsRead(threadId, "user_1"); // Current user ID
      } else {
        setError("Chat thread not found");
      }
    } catch (err) {
      setError("Failed to load chat thread");
      console.error("Error loading thread:", err);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  // Load messages
  const loadMessages = useCallback(
    async (offset: number = 0) => {
      if (!threadId) return;

      try {
        setLoading(offset === 0);
        const newMessages = await chatService.getMessages(threadId, 50, offset);

        if (offset === 0) {
          setMessages(newMessages);
        } else {
          setMessages((prev) => [...newMessages, ...prev]);
        }

        setHasMore(newMessages.length === 50);
      } catch (err) {
        setError("Failed to load messages");
        console.error("Error loading messages:", err);
      } finally {
        setLoading(false);
      }
    },
    [threadId],
  );

  // Send message
  const sendMessage = useCallback(
    async (
      content: string,
      attachments?: string[],
      replyTo?: string,
    ): Promise<ChatMessage | null> => {
      if (!threadId || !content.trim()) return null;

      try {
        const newMessage = await chatService.sendMessage({
          threadId,
          content: content.trim(),
          attachments,
          replyTo,
          messageType: "text",
        });

        // Add message to local state
        setMessages((prev) => [...prev, newMessage]);

        // Update thread last message
        if (thread) {
          setThread((prev) =>
            prev
              ? {
                  ...prev,
                  lastMessage: content,
                  lastMessageAt: newMessage.timestamp,
                  updatedAt: newMessage.timestamp,
                }
              : null,
          );
        }

        return newMessage;
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
        console.error("Error sending message:", err);
        return null;
      }
    },
    [threadId, thread, toast],
  );

  // Upload and send file
  const sendFile = useCallback(
    async (file: File): Promise<ChatMessage | null> => {
      if (!threadId) return null;

      try {
        toast({
          title: "Uploading...",
          description: `Uploading ${file.name}`,
        });

        const fileUrl = await chatService.uploadAttachment(file);

        const newMessage = await chatService.sendMessage({
          threadId,
          content: `📎 ${file.name}`,
          attachments: [fileUrl],
          messageType: file.type.startsWith("image/") ? "image" : "file",
        });

        setMessages((prev) => [...prev, newMessage]);

        toast({
          title: "Success",
          description: "File uploaded successfully",
        });

        return newMessage;
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to upload file",
          variant: "destructive",
        });
        console.error("Error uploading file:", err);
        return null;
      }
    },
    [threadId, toast],
  );

  // Add reaction to message
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      await chatService.addReaction(messageId, emoji, "user_1");

      // Update local message state
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || [];
            const existingReaction = reactions.find((r) => r.emoji === emoji);

            if (existingReaction) {
              if (!existingReaction.userIds.includes("user_1")) {
                existingReaction.userIds.push("user_1");
                existingReaction.count++;
              }
            } else {
              reactions.push({
                emoji,
                userIds: ["user_1"],
                count: 1,
              });
            }

            return { ...msg, reactions };
          }
          return msg;
        }),
      );
    } catch (err) {
      console.error("Error adding reaction:", err);
    }
  }, []);

  // Delete message
  const deleteMessage = useCallback(
    async (messageId: string) => {
      try {
        const success = await chatService.deleteMessage(messageId, "user_1");

        if (success) {
          setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
          toast({
            title: "Message deleted",
            description: "Message has been removed",
          });
        } else {
          toast({
            title: "Error",
            description: "Unable to delete message",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete message",
          variant: "destructive",
        });
        console.error("Error deleting message:", err);
      }
    },
    [toast],
  );

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(() => {
    if (!loading && hasMore) {
      loadMessages(messages.length);
    }
  }, [loading, hasMore, messages.length, loadMessages]);

  // Send typing indicator
  const sendTypingIndicator = useCallback(() => {
    if (threadId) {
      chatService.sendTypingIndicator(threadId, "user_1");
    }
  }, [threadId]);

  // Initialize
  useEffect(() => {
    if (threadId) {
      loadThread();
      loadMessages();
    } else {
      setThread(null);
      setMessages([]);
    }
  }, [threadId, loadThread, loadMessages]);

  return {
    thread,
    messages,
    loading,
    error,
    hasMore,
    sendMessage,
    sendFile,
    addReaction,
    deleteMessage,
    loadMoreMessages,
    sendTypingIndicator,
    refresh: () => {
      loadThread();
      loadMessages();
    },
  };
};

export const useChatThreads = (filter?: ChatFilter) => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadThreads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const threadsData = await chatService.getChatThreads(filter);
      setThreads(threadsData);
    } catch (err) {
      setError("Failed to load chat threads");
      console.error("Error loading threads:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  return {
    threads,
    loading,
    error,
    refresh: loadThreads,
  };
};
