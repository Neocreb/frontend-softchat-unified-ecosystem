
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, MapPin, Clock, Plus, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Group {
  id: string;
  name: string;
  description: string;
  avatar_url?: string;
  member_count: number;
  privacy: 'public' | 'private';
  creator_id: string;
  joined?: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location?: string;
  start_date: string;
  creator_id: string;
  attendee_count: number;
  max_attendees?: number;
  attending?: boolean;
}

const GroupsAndEvents = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("groups");

  useEffect(() => {
    fetchGroups();
    fetchEvents();
  }, []);

  const fetchGroups = async () => {
    // Mock groups data
    const mockGroups: Group[] = [
      {
        id: '1',
        name: 'Crypto Traders',
        description: 'A community for cryptocurrency trading enthusiasts',
        avatar_url: '/placeholder.svg',
        member_count: 1250,
        privacy: 'public',
        creator_id: 'user1',
        joined: true
      },
      {
        id: '2',
        name: 'Video Content Creators',
        description: 'Share tips and collaborate on video content',
        avatar_url: '/placeholder.svg',
        member_count: 856,
        privacy: 'public',
        creator_id: 'user2',
        joined: false
      },
      {
        id: '3',
        name: 'Local Community',
        description: 'Connect with people in your area',
        avatar_url: '/placeholder.svg',
        member_count: 342,
        privacy: 'private',
        creator_id: 'user3',
        joined: true
      }
    ];
    setGroups(mockGroups);
  };

  const fetchEvents = async () => {
    // Mock events data
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Crypto Trading Workshop',
        description: 'Learn advanced trading strategies and market analysis',
        location: 'Virtual Event',
        start_date: new Date(Date.now() + 86400000 * 3).toISOString(),
        creator_id: 'user1',
        attendee_count: 45,
        max_attendees: 100,
        attending: false
      },
      {
        id: '2',
        title: 'Community Meetup',
        description: 'Monthly in-person meetup for local members',
        location: 'Central Park, NYC',
        start_date: new Date(Date.now() + 86400000 * 7).toISOString(),
        creator_id: 'user2',
        attendee_count: 23,
        max_attendees: 50,
        attending: true
      },
      {
        id: '3',
        title: 'Content Creation Bootcamp',
        description: 'Intensive workshop on creating engaging content',
        location: 'Online',
        start_date: new Date(Date.now() + 86400000 * 14).toISOString(),
        creator_id: 'user3',
        attendee_count: 67,
        attending: false
      }
    ];
    setEvents(mockEvents);
  };

  const joinGroup = async (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, joined: true, member_count: group.member_count + 1 }
        : group
    ));
  };

  const leaveGroup = async (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, joined: false, member_count: group.member_count - 1 }
        : group
    ));
  };

  const attendEvent = async (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, attending: true, attendee_count: event.attendee_count + 1 }
        : event
    ));
  };

  const unattendEvent = async (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, attending: false, attendee_count: event.attendee_count - 1 }
        : event
    ));
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Groups & Events</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search groups and events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <Card key={group.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={group.avatar_url} />
                      <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-base">{group.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={group.privacy === 'public' ? 'default' : 'secondary'}>
                          {group.privacy}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {group.member_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
                  <Button
                    variant={group.joined ? "outline" : "default"}
                    className="w-full"
                    onClick={() => group.joined ? leaveGroup(group.id) : joinGroup(group.id)}
                  >
                    {group.joined ? 'Leave Group' : 'Join Group'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.start_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(event.start_date).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  {event.location && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      {event.attendee_count} attending
                      {event.max_attendees && ` • ${event.max_attendees} max`}
                    </span>
                  </div>
                  <Button
                    variant={event.attending ? "outline" : "default"}
                    className="w-full"
                    onClick={() => event.attending ? unattendEvent(event.id) : attendEvent(event.id)}
                  >
                    {event.attending ? 'Cancel RSVP' : 'RSVP'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupsAndEvents;
