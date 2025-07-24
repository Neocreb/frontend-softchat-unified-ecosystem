import { useToast } from "@/hooks/use-toast";

export interface SyncEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  attendees: number;
  isAttending: boolean;
  cover?: string;
  // Group/Page context
  sourceType: 'group' | 'page';
  sourceId: string;
  sourceName: string;
  // Event metadata
  isPublic: boolean;
  category?: string;
  maxAttendees?: number;
  requiresApproval?: boolean;
  tags?: string[];
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
}

class EventSyncService {
  private events: SyncEvent[] = [];
  
  // Mock data for demonstration
  private getMockEvents(): SyncEvent[] {
    return [
      {
        id: "event-1",
        title: "Tech Meetup 2024",
        description: "Join us for an exciting tech meetup discussing the latest in AI and web development",
        date: "2024-02-15",
        time: "18:00",
        location: "San Francisco, CA",
        attendees: 125,
        isAttending: false,
        cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
        sourceType: "group",
        sourceId: "tech-group-1",
        sourceName: "Tech Enthusiasts",
        isPublic: true,
        category: "Technology",
        maxAttendees: 200,
        organizer: {
          id: "user-1",
          name: "Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b2bab1d3?w=100"
        },
        tags: ["technology", "networking", "ai"]
      },
      {
        id: "event-2",
        title: "Business Networking Event",
        description: "Connect with fellow entrepreneurs and business professionals",
        date: "2024-02-20",
        time: "19:00",
        location: "New York, NY",
        attendees: 89,
        isAttending: true,
        cover: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600",
        sourceType: "page",
        sourceId: "business-page-1",
        sourceName: "Business Network NYC",
        isPublic: true,
        category: "Business",
        maxAttendees: 150,
        organizer: {
          id: "user-2",
          name: "Mike Chen",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
        },
        tags: ["business", "networking", "entrepreneur"]
      },
      {
        id: "event-3",
        title: "Community Volunteer Day",
        description: "Help make our community better by joining our volunteer activities",
        date: "2024-02-25",
        time: "09:00",
        location: "Community Center",
        attendees: 67,
        isAttending: false,
        cover: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600",
        sourceType: "group",
        sourceId: "community-group-1",
        sourceName: "Local Community Group",
        isPublic: true,
        category: "Community",
        maxAttendees: 100,
        organizer: {
          id: "user-3",
          name: "Lisa Rodriguez",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
        },
        tags: ["volunteer", "community", "social good"]
      }
    ];
  }

  // Get all events
  async getAllEvents(): Promise<SyncEvent[]> {
    // In a real app, this would fetch from an API
    return this.getMockEvents();
  }

  // Get events from a specific group
  async getGroupEvents(groupId: string): Promise<SyncEvent[]> {
    const allEvents = await this.getAllEvents();
    return allEvents.filter(event => event.sourceType === 'group' && event.sourceId === groupId);
  }

  // Get events from a specific page
  async getPageEvents(pageId: string): Promise<SyncEvent[]> {
    const allEvents = await this.getAllEvents();
    return allEvents.filter(event => event.sourceType === 'page' && event.sourceId === pageId);
  }

  // Add event from group to main events
  async syncGroupEvent(groupId: string, groupName: string, eventData: Partial<SyncEvent>): Promise<SyncEvent> {
    const newEvent: SyncEvent = {
      id: `event-${Date.now()}`,
      title: eventData.title || '',
      description: eventData.description || '',
      date: eventData.date || '',
      time: eventData.time || '',
      location: eventData.location,
      attendees: 0,
      isAttending: false,
      cover: eventData.cover,
      sourceType: 'group',
      sourceId: groupId,
      sourceName: groupName,
      isPublic: eventData.isPublic ?? true,
      category: eventData.category,
      maxAttendees: eventData.maxAttendees,
      requiresApproval: eventData.requiresApproval,
      tags: eventData.tags || [],
      organizer: eventData.organizer || {
        id: 'current-user',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
      }
    };

    // In a real app, this would save to an API
    this.events.push(newEvent);
    return newEvent;
  }

  // Add event from page to main events
  async syncPageEvent(pageId: string, pageName: string, eventData: Partial<SyncEvent>): Promise<SyncEvent> {
    const newEvent: SyncEvent = {
      id: `event-${Date.now()}`,
      title: eventData.title || '',
      description: eventData.description || '',
      date: eventData.date || '',
      time: eventData.time || '',
      location: eventData.location,
      attendees: 0,
      isAttending: false,
      cover: eventData.cover,
      sourceType: 'page',
      sourceId: pageId,
      sourceName: pageName,
      isPublic: eventData.isPublic ?? true,
      category: eventData.category,
      maxAttendees: eventData.maxAttendees,
      requiresApproval: eventData.requiresApproval,
      tags: eventData.tags || [],
      organizer: eventData.organizer || {
        id: 'current-user',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
      }
    };

    // In a real app, this would save to an API
    this.events.push(newEvent);
    return newEvent;
  }

  // Join/leave event
  async toggleEventAttendance(eventId: string): Promise<SyncEvent | null> {
    const allEvents = await this.getAllEvents();
    const event = allEvents.find(e => e.id === eventId);
    
    if (event) {
      event.isAttending = !event.isAttending;
      event.attendees += event.isAttending ? 1 : -1;
      return event;
    }
    
    return null;
  }

  // Get events by category
  async getEventsByCategory(category: string): Promise<SyncEvent[]> {
    const allEvents = await this.getAllEvents();
    return allEvents.filter(event => 
      event.isPublic && 
      event.category?.toLowerCase() === category.toLowerCase()
    );
  }

  // Search events
  async searchEvents(query: string): Promise<SyncEvent[]> {
    const allEvents = await this.getAllEvents();
    const searchTerm = query.toLowerCase();
    
    return allEvents.filter(event => 
      event.isPublic && (
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.sourceName.toLowerCase().includes(searchTerm) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    );
  }

  // Get upcoming events
  async getUpcomingEvents(limit?: number): Promise<SyncEvent[]> {
    const allEvents = await this.getAllEvents();
    const now = new Date();
    
    const upcoming = allEvents
      .filter(event => event.isPublic && new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return limit ? upcoming.slice(0, limit) : upcoming;
  }
}

export const eventSyncService = new EventSyncService();
export default eventSyncService;
