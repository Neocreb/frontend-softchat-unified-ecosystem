
import { Copy, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ReferralCard = () => {
  const { toast } = useToast();

  const copyReferralLink = () => {
    navigator.clipboard.writeText("https://softchat.com/ref/johndoe123");
    toast({
      title: "Referral link copied",
      description: "Share it with friends to earn rewards!",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Referral Program</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium mb-2">Your Referral Link</div>
          <div className="flex">
            <div className="flex-1 bg-muted rounded-l-md px-3 py-2 text-sm overflow-hidden text-ellipsis">
              https://softchat.com/ref/johndoe123
            </div>
            <Button 
              variant="secondary" 
              className="rounded-l-none" 
              onClick={copyReferralLink}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Friends Referred</div>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold">600</div>
            <div className="text-sm text-muted-foreground">Points Earned</div>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <div className="text-sm font-medium mb-2">How it Works</div>
          <ol className="space-y-2 text-sm pl-5 list-decimal">
            <li>Share your unique referral link with friends</li>
            <li>Friends sign up using your link</li>
            <li>You earn 200 points for each friend who joins</li>
            <li>Your friend gets 100 bonus points</li>
          </ol>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Referral Stats
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;
