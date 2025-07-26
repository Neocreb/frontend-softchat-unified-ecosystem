import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Sword, Gift, Trophy, Zap, Star } from "lucide-react";

const FeatureShowcase: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">🎉 New Features Added!</h1>
        <p className="text-gray-400">Duet & Battle Features with SoftPoints Monetization</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Duet Feature */}
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Users className="w-6 h-6" />
              Video Duets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-300">Create side-by-side videos with any content!</p>
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                ✨ Multiple layout styles
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                🎵 Audio mixing options
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                💰 Revenue sharing
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                🎁 Tip integration
              </Badge>
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Click the <Users className="w-4 h-4 inline text-purple-400" /> button on any video to start duetting!
            </div>
          </CardContent>
        </Card>

        {/* Battle Feature */}
        <Card className="bg-red-500/10 border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Sword className="w-6 h-6" />
              Live Battles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-300">Challenge creators to epic live competitions!</p>
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                ⚔️ Real-time scoring
              </Badge>
              <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                🎁 Live gift battles
              </Badge>
              <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                🏆 Prize pools
              </Badge>
              <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                📊 Leaderboards
              </Badge>
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Click the <Sword className="w-4 h-4 inline text-red-400" /> button to start a battle challenge!
            </div>
          </CardContent>
        </Card>

        {/* Monetization Feature */}
        <Card className="bg-yellow-500/10 border-yellow-500/30 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Zap className="w-6 h-6" />
              SoftPoints Monetization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <Gift className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Tips & Gifts</h3>
                <p className="text-sm text-gray-400">Send SoftPoints to creators</p>
              </div>
              <div className="text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Battle Prizes</h3>
                <p className="text-sm text-gray-400">Win SoftPoints in battles</p>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Revenue Sharing</h3>
                <p className="text-sm text-gray-400">Split earnings with original creators</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-green-500/10 border-green-500/30">
        <CardContent className="p-4">
          <div className="text-center">
            <h3 className="text-green-400 font-semibold mb-2">🚀 How to Access</h3>
            <p className="text-gray-300">
              Go to the <strong>Videos</strong> page to see the new Duet and Battle buttons on every video!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureShowcase;
