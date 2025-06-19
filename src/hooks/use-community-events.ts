import { useState, useEffect, useCallback } from "react";
import {
  communityEventsService,
  LiveEvent,
  EventParticipant,
  EventMessage,
  EventStats,
} from "@/services/communityEventsService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useCommunityEvents = () => {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadEvents = useCallback(
    async (filters?: any) => {
      try {
        setLoading(true);
        setError(null);
        const response = await communityEventsService.getEvents(filters);
        setEvents(response.events);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load events";
        setError(message);
        console.error("Error loading events:", err);

        // Don't show error toast for fallback data usage
        if (!message.includes("API not available")) {
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const createEvent = useCallback(
    async (eventData: Partial<LiveEvent>) => {
      try {
        const newEvent = await communityEventsService.createEvent(eventData);
        setEvents((prev) => [newEvent, ...prev]);
        toast({
          title: "Event Created!",
          description: "Your event has been successfully created.",
        });
        return newEvent;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create event";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      }
    },
    [toast],
  );

  const joinEvent = useCallback(
    async (eventId: string) => {
      try {
        const result = await communityEventsService.joinEvent(eventId);
        if (result.success) {
          // Update the event's participant count
          setEvents((prev) =>
            prev.map((event) =>
              event.id === eventId
                ? { ...event, participants: event.participants + 1 }
                : event,
            ),
          );
          toast({
            title: "Joined Event!",
            description: "You've successfully joined the event.",
          });
        }
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to join event";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      }
    },
    [toast],
  );

  const leaveEvent = useCallback(
    async (eventId: string) => {
      try {
        const result = await communityEventsService.leaveEvent(eventId);
        if (result.success) {
          setEvents((prev) =>
            prev.map((event) =>
              event.id === eventId
                ? {
                    ...event,
                    participants: Math.max(0, event.participants - 1),
                  }
                : event,
            ),
          );
          toast({
            title: "Left Event",
            description: "You've left the event.",
          });
        }
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to leave event";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      }
    },
    [toast],
  );

  const searchEvents = useCallback(async (query: string, filters?: any) => {
    try {
      setLoading(true);
      const searchResults = await communityEventsService.searchEvents(
        query,
        filters,
      );
      setEvents(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    error,
    loadEvents,
    createEvent,
    joinEvent,
    leaveEvent,
    searchEvents,
    refresh: () => loadEvents(),
  };
};

export const useLiveEventRoom = (eventId: string) => {
  const [event, setEvent] = useState<LiveEvent | null>(null);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [messages, setMessages] = useState<EventMessage[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadEventData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventData, participantsData, messagesData, statsData] =
        await Promise.all([
          communityEventsService.getEvent(eventId),
          communityEventsService.getParticipants(eventId),
          communityEventsService.getEventMessages(eventId),
          communityEventsService.getEventStats(eventId),
        ]);

      setEvent(eventData);
      setParticipants(participantsData);
      setMessages(messagesData);
      setStats(statsData);
    } catch (err) {
      console.error("Error loading event data:", err);
      toast({
        title: "Error",
        description: "Failed to load event data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [eventId, toast]);

  const sendMessage = useCallback(
    async (message: string) => {
      try {
        const newMessage = await communityEventsService.sendMessage(
          eventId,
          message,
        );
        setMessages((prev) => [...prev, newMessage]);
        return newMessage;
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
        throw err;
      }
    },
    [eventId, toast],
  );

  const sendReaction = useCallback(
    async (reactionType: string) => {
      try {
        await communityEventsService.sendReaction(eventId, reactionType);
        toast({
          title: "Reaction sent!",
          description: `You reacted with ${reactionType}`,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to send reaction",
          variant: "destructive",
        });
      }
    },
    [eventId, toast],
  );

  const updateParticipantStatus = useCallback(
    async (status: any) => {
      if (!user) return;

      try {
        await communityEventsService.updateParticipantStatus(
          eventId,
          user.id,
          status,
        );
        setParticipants((prev) =>
          prev.map((p) =>
            p.userId === user.id
              ? { ...p, status: { ...p.status, ...status } }
              : p,
          ),
        );
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive",
        });
      }
    },
    [eventId, user, toast],
  );

  const startStream = useCallback(async () => {
    try {
      const streamData = await communityEventsService.startLiveStream(eventId);
      if (event) {
        setEvent({ ...event, isLive: true });
      }
      toast({
        title: "Stream Started!",
        description: "Your live stream is now active.",
      });
      return streamData;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to start stream",
        variant: "destructive",
      });
      throw err;
    }
  }, [eventId, event, toast]);

  const stopStream = useCallback(async () => {
    try {
      const result = await communityEventsService.stopLiveStream(eventId);
      if (event) {
        setEvent({ ...event, isLive: false });
      }
      toast({
        title: "Stream Ended",
        description: "Your live stream has been stopped.",
      });
      return result;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to stop stream",
        variant: "destructive",
      });
      throw err;
    }
  }, [eventId, event, toast]);

  useEffect(() => {
    if (eventId) {
      loadEventData();
    }
  }, [eventId, loadEventData]);

  // Set up real-time connections (WebSocket, etc.)
  useEffect(() => {
    if (!eventId || !event?.isLive) return;

    // Simulate real-time connection
    setIsConnected(true);

    // Real-time message updates would be implemented here
    // WebSocket connection, Server-Sent Events, etc.

    return () => {
      setIsConnected(false);
    };
  }, [eventId, event?.isLive]);

  return {
    event,
    participants,
    messages,
    stats,
    loading,
    isConnected,
    sendMessage,
    sendReaction,
    updateParticipantStatus,
    startStream,
    stopStream,
    refresh: loadEventData,
  };
};

export const useEventAnalytics = (eventId?: string, hostId?: string) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    if (!eventId && !hostId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      if (eventId) {
        const stats = await communityEventsService.getEventStats(eventId);
        setAnalytics(stats);
      } else if (hostId) {
        const hostAnalytics =
          await communityEventsService.getHostAnalytics(hostId);
        setAnalytics(hostAnalytics);
      }
    } catch (err) {
      console.warn("Analytics not available:", err);
      // Don't throw error, just log it
    } finally {
      setLoading(false);
    }
  }, [eventId, hostId]);

  useEffect(() => {
    if (eventId || hostId) {
      loadAnalytics();
    }
  }, [eventId, hostId, loadAnalytics]);

  return {
    analytics,
    loading,
    refresh: loadAnalytics,
  };
};
