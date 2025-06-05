
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  Globe, 
  Lock, 
  UserPlus 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/utils/utils";

interface Group {
  id: string;
  name: string;
  description: string;
  avatar_url?: string;
  cover_url?: string;
  privacy: 'public' | 'private' | 'invite_only';
  creator_id: string;
  member_count: number;
  created_at: string;
  is_member?: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location?: string;
  start_date: string;
  end_date?: string;
  creator_id: string;
  group_id?: string;
  max_attendees?: number;
  attendee_count: number;
  created_at: string;
  rsvp_status?: 'going' | 'maybe' | 'not_going' | null;
  groups?: {
    name: string;
  };
}

const GroupsAndEvents = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'groups' | 'events'>('groups');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock groups data
    const mockGroups: Group[] = [
      {
        id: '1',
        name: 'Crypto Enthusiasts',
        description: 'A community for cryptocurrency traders and enthusiasts',
        avatar_url: '/placeholder.svg',
        cover_url: '/placeholder.svg',
        privacy: 'public',
        creator_id: 'user1',
        member_count: 1247,
        created_at: new Date().toISOString(),
        is_member: false
      },
      {
        id: '2',
        name: 'Tech Innovators',
        description: 'Discussing the latest in technology and innovation',
        avatar_url: '/placeholder.svg',
        privacy: 'public',
        creator_id: 'user2',
        member_count: 892,
        created_at: new Date().toISOString(),
        is_member: true
      },
      {
        id: '3',
        name: 'Investment Club',
        description: 'Private group for serious investors',
        avatar_url: '/placeholder.svg',
        privacy: 'private',
        creator_id: 'user3',
        member_count: 156,
        created_at: new Date().toISOString(),
        is_member: false
      }
    ];

    // Mock events data
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Crypto Trading Workshop',
        description: 'Learn advanced trading strategies and risk management',
        location: 'Virtual Event',
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        creator_id: 'user1',
        group_id: '1',
        max_attendees: 100,
        attendee_count: 45,
        created_at: new Date().toISOString(),
        rsvp_status: null,
        groups: { name: 'Crypto Enthusiasts' }
      },
      {
        id: '2',
        title: 'Tech Meetup',
        description: 'Monthly meetup for tech professionals',
        location: 'Downtown Conference Center',
        start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        creator_id: 'user2',
        group_id: '2',
        max_attendees: 50,
        attendee_count: 23,
        created_at: new Date().toISOString(),
        rsvp_status: 'going',
        groups: { name: 'Tech Innovators' }
      },
      {
        id: '3',
        title: 'Investment Strategy Session',
        description: 'Exclusive session for investment club members',
        location: 'Private Office',
        start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        creator_id: 'user3',
        group_id: '3',
        attendee_count: 12,
        created_at: new Date().toISOString(),
        rsvp_status: 'maybe',
        groups: { name: 'Investment Club' }
      }
    ];

    setGroups(mockGroups);
    setEvents(mockEvents);
  };

  const joinGroup = async (groupId: string) => {
    // Simulate joining a group
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, is_member: true, member_count: group.member_count + 1 }
        : group
    ));
  };

  const rsvpToEvent = async (eventId: string, status: 'going' | 'maybe' | 'not_going') => {
    // Simulate RSVP to event
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, rsvp_status: status }
        : event
    ));
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
      case 'invite_only': return <UserPlus className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Groups & Events</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'groups' ? "default" : "ghost"}
          onClick={() => setActiveTab('groups')}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Groups
        </Button>
        <Button
          variant={activeTab === 'events' ? "default" : "ghost"}
          onClick={() => setActiveTab('events')}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Events
        </Button>
      </div>

      {/* Groups tab */}
      {activeTab === 'groups' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              {group.cover_url && (
                <div 
                  className="h-32 bg-cover bg-center"
                  style={{ backgroundImage: `url(${group.cover_url})` }}
                />
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={group.avatar_url} />
                    <AvatarFallback>{group.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-1">{group.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getPrivacyIcon(group.privacy)}
                      <span className="text-sm text-muted-foreground capitalize">
                        {group.privacy.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {group.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {group.member_count} members
                  </span>
                  {group.is_member ? (
                    <Badge>Joined</Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => joinGroup(group.id)}
                    >
                      Join
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Events tab */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Date badge */}
                  <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-lg p-3 text-center min-w-[80px]">
                    <div className="text-sm font-medium">
                      {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="text-2xl font-bold">
                      {new Date(event.start_date).getDate()}
                    </div>
                  </div>

                  {/* Event details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatEventDate(event.start_date)}
                        {event.end_date && ` - ${formatEventDate(event.end_date)}`}
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                      
                      {event.groups && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {event.groups.name}
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {event.attendee_count} {event.max_attendees && `of ${event.max_attendees}`} attending
                      </span>
                      
                      <div className="flex gap-2">
                        <Button
                          variant={event.rsvp_status === 'going' ? "default" : "outline"}
                          size="sm"
                          onClick={() => rsvpToEvent(event.id, 'going')}
                        >
                          Going
                        </Button>
                        <Button
                          variant={event.rsvp_status === 'maybe' ? "default" : "outline"}
                          size="sm"
                          onClick={() => rsvpToEvent(event.id, 'maybe')}
                        >
                          Maybe
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupsAndEvents;
