
import { formatNumber } from "@/utils/formatters";
import { Calendar, MapPin, Users } from "lucide-react";

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  attendees: number;
  category: string;
  cover: string;
  organizer: string;
}

interface ExploreEventsProps {
  events: Event[];
}

const ExploreEvents = ({ events }: ExploreEventsProps) => {
  return (
    <div className="mt-4 space-y-4">
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="rounded-lg overflow-hidden border cursor-pointer hover:shadow-md transition-shadow">
            <div className="h-32 overflow-hidden">
              <img src={event.cover} alt={event.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{formatNumber(event.attendees)} interested</span>
                </div>
                <p className="text-xs text-gray-500">Organized by {event.organizer}</p>
              </div>
              <button className="mt-3 w-full text-center py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">
                Join Event
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No events found</p>
        </div>
      )}
    </div>
  );
};

export default ExploreEvents;
