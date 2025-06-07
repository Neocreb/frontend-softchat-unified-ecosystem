
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Users, Gift, Star, Plus } from "lucide-react";

const FeedSidebar = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Who to Follow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {[
            {
              name: "Sarah Johnson",
              username: "sarahj",
              avatar: "/placeholder.svg",
              verified: true,
            },
            {
              name: "Alex Rivera",
              username: "alexr",
              avatar: "/placeholder.svg",
              verified: false,
            },
            {
              name: "Maya Patel",
              username: "mayap",
              avatar: "/placeholder.svg",
              verified: true,
            },
          ].map((profile, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{profile.name}</span>
                    {profile.verified && (
                      <Badge variant="default" className="ml-1 px-1 py-0 h-4 bg-softchat-primary hover:bg-softchat-primary/90">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-2 w-2"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">@{profile.username}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                Follow
              </Button>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full text-xs">
            Show more
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {[
            {
              topic: "Bitcoin hits new high",
              category: "Crypto",
              posts: 1432
            },
            {
              topic: "New smartphone release",
              category: "Technology",
              posts: 984
            },
            {
              topic: "Fashion week highlights",
              category: "Fashion",
              posts: 754
            },
          ].map((trend, index) => (
            <div key={index}>
              <Link to="#" className="block space-y-1">
                <div className="text-sm font-medium hover:underline">#{trend.topic}</div>
                <div className="flex text-xs text-muted-foreground gap-1">
                  <span>{trend.category}</span>
                  <span>•</span>
                  <span>{trend.posts} posts</span>
                </div>
              </Link>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full text-xs">
            Show more
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Award className="h-4 w-4" />
            Your Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-softchat-primary to-softchat-accent flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium">Bronze Level</div>
                <div className="text-xs text-muted-foreground">2,450 points</div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
              <Gift className="h-3 w-3" />
              Redeem
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span>Progress to Silver</span>
                <span className="font-medium">2,450 / 5,000</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-softchat-primary to-softchat-accent"
                  style={{ width: "49%" }}
                ></div>
              </div>
            </div>

            <div className="rounded-md border p-3 text-xs">
              <div className="mb-2 font-medium">Earn more points!</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Plus className="h-3 w-3 text-softchat-accent" />
                  Create a post (+10 points)
                </li>
                <li className="flex items-center gap-2">
                  <Plus className="h-3 w-3 text-softchat-accent" />
                  Make a purchase (+50 points)
                </li>
                <li className="flex items-center gap-2">
                  <Plus className="h-3 w-3 text-softchat-accent" />
                  Refer a friend (+200 points)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedSidebar;
