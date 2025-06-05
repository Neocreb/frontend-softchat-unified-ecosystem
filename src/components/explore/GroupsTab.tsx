
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Calendar } from "lucide-react";

const GroupsTab = () => {
  const groups = [
    {
      id: 1,
      name: "Crypto Traders United",
      members: 15420,
      description: "A community for cryptocurrency enthusiasts and traders",
      category: "Finance",
      isJoined: true,
    },
    {
      id: 2,
      name: "Digital Artists Hub",
      members: 8934,
      description: "Share and discover amazing digital artwork",
      category: "Art",
      isJoined: false,
    },
    {
      id: 3,
      name: "Tech Innovators",
      members: 12567,
      description: "Discussing the latest in technology and innovation",
      category: "Technology",
      isJoined: false,
    },
    {
      id: 4,
      name: "Startup Founders",
      members: 6789,
      description: "Network with fellow entrepreneurs and startup founders",
      category: "Business",
      isJoined: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Discover Groups</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{group.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{group.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {group.members.toLocaleString()} members
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
              <Button
                variant={group.isJoined ? "outline" : "default"}
                className="w-full"
              >
                {group.isJoined ? "Joined" : "Join Group"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupsTab;
