import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Play,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const EventsBannerCard = () => {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-dashed border-blue-300 dark:border-blue-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white">
            <Calendar className="w-6 h-6" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs">
                NEW
              </Badge>
            </div>

            <h3 className="font-bold text-lg mb-1">
              🎉 Live Community Events Now Available!
            </h3>

            <p className="text-muted-foreground text-sm mb-3">
              Join real-time trading sessions, marketplace flash sales, and
              interactive workshops. Connect and earn with the community!
            </p>

            <div className="flex items-center gap-4 mb-3 text-xs">
              <div className="flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Trading Live</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <Users className="w-3 h-3" />
                <span>Marketplace Sales</span>
              </div>
              <div className="flex items-center gap-1 text-orange-600">
                <TrendingUp className="w-3 h-3" />
                <span>Workshop Rewards</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link to="/app/events" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm">
                  <Play className="w-4 h-4 mr-2" />
                  Join Live Events
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsBannerCard;
