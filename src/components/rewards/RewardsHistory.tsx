
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Plus } from "lucide-react";

const RewardsHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewards History</CardTitle>
        <CardDescription>
          Track your rewards activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { type: "earned", description: "Created a post", points: 10, date: "Apr 13, 2025" },
            { type: "earned", description: "Daily login", points: 5, date: "Apr 13, 2025" },
            { type: "earned", description: "Referred a friend", points: 200, date: "Apr 12, 2025" },
            { type: "redeemed", description: "10% Discount", points: 500, date: "Apr 10, 2025" },
            { type: "earned", description: "Made a purchase", points: 50, date: "Apr 8, 2025" },
            { type: "earned", description: "Traded cryptocurrency", points: 25, date: "Apr 5, 2025" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
              <div className="flex items-center">
                <div className={`rounded-full p-2 mr-3 ${
                  item.type === "earned" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                }`}>
                  {item.type === "earned" ? (
                    <Plus className="h-4 w-4" />
                  ) : (
                    <Gift className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
              <div className={`font-medium ${
                item.type === "earned" ? "text-green-600" : "text-orange-600"
              }`}>
                {item.type === "earned" ? "+" : "-"}{item.points}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsHistory;
