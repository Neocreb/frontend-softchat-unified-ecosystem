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
import { supabase } from "@/lib/supabase/client";
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
    fetchGroups();
    fetchEvents();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data: allGroups, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .eq('privacy', 'public')
        .order('member_count', { ascending: false });

      if (groupsError) throw groupsError;

      const { data: memberships, error: membershipsError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user?.id);

      if (membershipsError) throw membershipsError;

      if (allGroups) {
        const memberGroupIds = memberships?.map((m: any) => m.group_id) || [];
        const enhancedGroups = allGroups.map((group: any) => ({
          ...group,
          is_member: memberGroupIds.includes(group.id)
        }));
        setGroups(enhancedGroups);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data: allEvents, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          groups:group_id (
            name
          )
        `)
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (eventsError) throw eventsError;

      const { data: rsvps, error: rsvpsError } = await supabase
        .from('event_rsvps')
        .select('event_id, status')
        .eq('user_id', user?.id);

      if (rsvpsError) throw rsvpsError;

      if (allEvents) {
        const enhancedEvents = allEvents.map((event: any) => {
          const userRsvp = rsvps?.find((r: any) => r.event_id === event.id);
          return {
            ...event,
            rsvp_status: userRsvp?.status || null
          };
        });
        setEvents(enhancedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user?.id
        });

      if (!error) {
        fetchGroups();
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const rsvpToEvent = async (eventId: string, status: 'going' | 'maybe' | 'not_going') => {
    try {
      const { error } = await supabase
        .from('event_rsvps')
        .upsert({
          event_id: eventId,
          user_id: user?.id,
          status
        });

      if (!error) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
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
