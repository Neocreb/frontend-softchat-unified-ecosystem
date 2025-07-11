import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Play,
  TrendingUp,
  ShoppingCart,
  Palette,
  Trophy,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const EventsBanner = () => {
  const featuredEvents = [
    {
      id: "1",
      title: "Live Crypto Trading",
      type: "trading",
      participants: 234,
      isLive: true,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      id: "2",
      title: "Flash Marketplace Sale",
      type: "marketplace",
      participants: 89,
      isLive: false,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      id: "3",
      title: "AI Art Workshop",
      type: "workshop",
      participants: 156,
      isLive: false,
      icon: Palette,
      color: "bg-purple-500",
    },
  ];

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                NEW FEATURE
              </Badge>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              🎉 Introducing Live Community Events!
            </h2>

            <p className="text-muted-foreground mb-4 text-lg">
              Join real-time collaborative experiences - from crypto trading
              sessions to marketplace flash sales. Connect, learn, and earn
              together with the community!
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">
                  Live & Scheduled Events
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">
                  Interactive Participation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Earn Rewards</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/app/events">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white w-full sm:w-auto">
                  <Play className="w-4 h-4 mr-2" />
                  Explore Live Events
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link to="/app/events?tab=create">
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 w-full sm:w-auto"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Create Your Event
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Featured Events Preview */}
          <div className="lg:w-80">
            <div className="space-y-3">
              <h3 className="font-semibold text-center lg:text-left mb-3">
                🔥 Happening Now
              </h3>

              {featuredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border hover:bg-background/70 transition-colors cursor-pointer"
                >
                  <div className={`p-2 rounded-full ${event.color} text-white`}>
                    <event.icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {event.title}
                      </p>
                      {event.isLive && (
                        <Badge className="bg-red-500 text-white text-xs px-1 py-0 animate-pulse">
                          LIVE
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{event.participants} participants</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}

              <Link to="/app/events">
                <div className="text-center p-2 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                  View all events →
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Event Types Icons */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Trading</span>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingCart className="w-4 h-4 text-blue-500" />
              <span>Shopping</span>
            </div>
            <div className="flex items-center gap-1">
              <Palette className="w-4 h-4 text-purple-500" />
              <span>Workshops</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Challenges</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-pink-500" />
              <span>Social</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsBanner;
