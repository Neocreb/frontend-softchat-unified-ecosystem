
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plus } from "lucide-react";

const EventsTab = () => {
  const events = [
    {
      id: 1,
      title: "Crypto Trading Workshop",
      date: "2025-01-15",
      time: "14:00",
      location: "Virtual Event",
      attendees: 234,
      category: "Education",
      description: "Learn advanced trading strategies from industry experts",
      isAttending: false,
    },
    {
      id: 2,
      title: "Digital Art Exhibition",
      date: "2025-01-20",
      time: "18:00",
      location: "New York, NY",
      attendees: 156,
      category: "Art",
      description: "Showcase of the latest digital art and NFT collections",
      isAttending: true,
    },
    {
      id: 3,
      title: "Startup Pitch Night",
      date: "2025-01-25",
      time: "19:00",
      location: "San Francisco, CA",
      attendees: 89,
      category: "Business",
      description: "Watch innovative startups pitch their ideas to investors",
      isAttending: false,
    },
    {
      id: 4,
      title: "Blockchain Developer Meetup",
      date: "2025-01-28",
      time: "16:00",
      location: "Virtual Event",
      attendees: 312,
      category: "Technology",
      description: "Network with blockchain developers and learn about new protocols",
      isAttending: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{event.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{event.category}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{event.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>

              <Button
                variant={event.isAttending ? "outline" : "default"}
                className="w-full"
              >
                {event.isAttending ? "Attending" : "Attend Event"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventsTab;
