import { DollarSign, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CreatorEconomyCard = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Creator Economy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-softchat-primary to-softchat-accent flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold">Silver Creator</div>
              <div className="text-sm text-muted-foreground">
                2,450 SoftPoints earned
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress to Gold</span>
              <span className="font-medium">2,450 / 5,000 SP</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-softchat-primary to-softchat-accent"
                style={{ width: "49%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-3">
            <div className="text-sm font-medium mb-2">Recent Earnings</div>
            <div className="space-y-3">
              {[
                {
                  action: "Video monetization",
                  amount: "+25 SP",
                  date: "Apr 12, 2025",
                },
                {
                  action: "Creator tips received",
                  amount: "+15 SP",
                  date: "Apr 10, 2025",
                },
                {
                  action: "Content engagement",
                  amount: "+10 SP",
                  date: "Apr 8, 2025",
                },
              ].map((earning, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <div>
                    <div>{earning.action}</div>
                    <div className="text-xs text-muted-foreground">
                      {earning.date}
                    </div>
                  </div>
                  <div className="font-medium text-green-500">
                    {earning.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full">
            <ArrowDown className="mr-2 h-4 w-4" />
            Withdraw Earnings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorEconomyCard;
