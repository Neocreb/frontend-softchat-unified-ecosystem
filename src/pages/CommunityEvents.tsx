import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveCommunityEvents from "@/components/community/LiveCommunityEvents";
import LiveEventRoom from "@/components/community/LiveEventRoom";
import {
  useCommunityEvents,
  useEventAnalytics,
} from "@/hooks/use-community-events";
import { useAuth } from "@/contexts/AuthContext";
import { formatNumber } from "@/utils/formatters";
import {
  Search,
  Calendar,
  TrendingUp,
  Users,
  Award,
  DollarSign,
  Eye,
  MessageSquare,
  Plus,
  BarChart3,
  Clock,
  Star,
  Filter,
  SortDesc,
  Grid,
  List,
  Play,
  Bookmark,
  Share2,
  Settings,
} from "lucide-react";

const CommunityEvents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { events, loading, searchEvents, createEvent } = useCommunityEvents();
  const { user } = useAuth();
  const { analytics } = useEventAnalytics(undefined, user?.id);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchEvents(searchQuery);
    }
  };

  const handleJoinLiveEvent = (eventId: string) => {
    setSelectedEvent(eventId);
  };

  const liveEvent = events.find((e) => e.id === selectedEvent);

  // Analytics summary
  const analyticsStats = analytics
    ? {
        totalEvents: analytics.totalEvents || 0,
        totalViewers: analytics.totalViewers || 0,
        avgEngagement: analytics.averageEngagement || 0,
        revenue: analytics.revenue || 0,
      }
    : null;

  if (selectedEvent && liveEvent) {
    return (
      <LiveEventRoom
        eventId={selectedEvent}
        eventTitle={liveEvent.title}
        eventType={liveEvent.type}
        isHost={liveEvent.host.id === user?.id}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Live Community Events | SoftChat</title>
        <meta
          name="description"
          content="Join real-time collaborative experiences with the SoftChat community"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  Live Community Events
                </h1>
                <p className="text-muted-foreground text-lg">
                  Join real-time collaborative experiences with the community
                </p>
              </div>

              <div className="flex items-center gap-3">
                {user && (
                  <Button
                    variant="outline"
                    onClick={() => setShowAnalytics(!showAnalytics)}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                )}
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Live Now</p>
                      <p className="text-2xl font-bold">
                        {formatNumber(events.filter((e) => e.isLive).length)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Viewers
                      </p>
                      <p className="text-2xl font-bold">
                        {formatNumber(
                          events.reduce((acc, e) => acc + e.participants, 0),
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">This Week</p>
                      <p className="text-2xl font-bold">
                        {formatNumber(
                          events.filter((e) => {
                            const eventDate = new Date(e.startTime);
                            const now = new Date();
                            const weekAgo = new Date(
                              now.getTime() - 7 * 24 * 60 * 60 * 1000,
                            );
                            return eventDate >= weekAgo;
                          }).length,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Trending</p>
                      <p className="text-2xl font-bold">🔥</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Analytics Panel */}
          {showAnalytics && analyticsStats && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Your Event Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500">
                      {analyticsStats.totalEvents}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Events Created
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">
                      {formatNumber(analyticsStats.totalViewers)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Viewers
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500">
                      {analyticsStats.avgEngagement.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Avg. Engagement
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500">
                      ${formatNumber(analyticsStats.revenue)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Revenue Generated
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search events, topics, or hosts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4"
                    />
                  </div>
                </form>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <SortDesc className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                  <div className="flex border border-border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events Section */}
          <LiveCommunityEvents />

          {/* Featured Live Events Spotlight */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">🔴 Live Right Now</h2>
              <Button variant="outline">View All Live</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter((event) => event.isLive)
                .slice(0, 3)
                .map((event) => (
                  <Card
                    key={event.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      <Badge className="absolute top-3 left-3 bg-red-500 text-white animate-pulse">
                        <Eye className="w-3 h-3 mr-1" />
                        LIVE
                      </Badge>

                      <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {formatNumber(event.participants)} watching
                      </div>

                      <Button
                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 m-4 rounded-lg"
                        onClick={() => handleJoinLiveEvent(event.id)}
                      >
                        <Play className="w-8 h-8" />
                      </Button>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <img
                          src={event.host.avatar}
                          alt={event.host.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm font-medium">
                          {event.host.name}
                        </span>
                        {event.host.verified && (
                          <Badge variant="secondary" className="px-1 py-0">
                            ✓
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {event.type}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Event Categories Quick Access */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                {
                  type: "trading",
                  label: "Trading",
                  icon: "📈",
                  color: "bg-green-500",
                },
                {
                  type: "marketplace",
                  label: "Shopping",
                  icon: "🛒",
                  color: "bg-blue-500",
                },
                {
                  type: "workshop",
                  label: "Workshops",
                  icon: "🎨",
                  color: "bg-purple-500",
                },
                {
                  type: "freelance",
                  label: "Freelance",
                  icon: "💼",
                  color: "bg-orange-500",
                },
                {
                  type: "challenge",
                  label: "Challenges",
                  icon: "🏆",
                  color: "bg-red-500",
                },
                {
                  type: "social",
                  label: "Social",
                  icon: "❤️",
                  color: "bg-pink-500",
                },
              ].map((category) => (
                <Card
                  key={category.type}
                  className="hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}
                    >
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <h3 className="font-medium">{category.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {events.filter((e) => e.type === category.type).length}{" "}
                      events
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityEvents;
