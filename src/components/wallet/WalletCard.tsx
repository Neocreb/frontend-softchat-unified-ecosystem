import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useWalletContext } from "@/contexts/WalletContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Contact {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

const WalletCard = () => {
  const { walletBalance } = useWalletContext();
  const balance = walletBalance?.total || 0;
  const [activeTab, setActiveTab] = useState("coins");
  const { toast } = useToast();

  // Mock contacts data
  const contacts: Contact[] = [
    { id: "1", name: "John Doe", username: "mysteriox", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: "2", name: "Alicia Smith", username: "aliciasmith", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: "3", name: "Raj Patel", username: "mysterxxx", avatar: "https://randomuser.me/api/portraits/men/68.jpg" },
    { id: "4", name: "Sarah Chen", username: "thesemper", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
    { id: "5", name: "Jonathan Miller", username: "jona", avatar: "https://randomuser.me/api/portraits/men/41.jpg" },
  ];

  const handleSend = () => {
    toast({
      title: "Send money",
      description: "Choose a contact to send money to",
    });
  };

  const handleReceive = () => {
    toast({
      title: "Receive money",
      description: "Your wallet address has been copied to clipboard",
    });
  };

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal initiated",
      description: "Your funds will be transferred to your bank account",
    });
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-eloity-primary/90 to-eloity-600/90 dark:from-eloity-primary/80 dark:to-eloity-700/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6 space-y-6">
        {/* Balance Section */}
        <div className="text-center space-y-2">
          <div className="text-sm text-white/80 flex items-center justify-center gap-1 font-medium">
            Total Balance
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 12L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-4xl sm:text-5xl font-bold text-white drop-shadow-sm">${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleSend}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm py-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 font-semibold"
          >
            <ArrowUp className="h-5 w-5" />
            <span className="text-lg">Send</span>
          </Button>
          <Button
            onClick={handleReceive}
            className="bg-white text-eloity-primary hover:bg-white/90 border border-white py-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 font-semibold"
          >
            <ArrowDown className="h-5 w-5" />
            <span className="text-lg">Receive</span>
          </Button>
        </div>

        {/* Contacts Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-medium text-white">Contacts</div>
            <Button variant="link" className="text-white/80 hover:text-white p-0 font-medium">view all</Button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex flex-col items-center min-w-[80px]">
                <Avatar className="h-16 w-16 rounded-full border-2 border-white shadow">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-white/80 mt-1 font-medium">@{contact.username}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-white/10 backdrop-blur-sm border-b border-white/20 justify-start gap-6 h-auto pb-2 rounded-lg">
              <TabsTrigger
                value="coins"
                className={`text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white data-[state=active]:shadow-none px-0 pb-2 transition-colors ${activeTab === 'coins' ? 'text-white' : 'text-white/60'}`}
              >
                Coins
              </TabsTrigger>
              <TabsTrigger
                value="nfts"
                className={`text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white data-[state=active]:shadow-none px-0 pb-2 transition-colors ${activeTab === 'nfts' ? 'text-white' : 'text-white/60'}`}
              >
                NFTs
              </TabsTrigger>
              <TabsTrigger
                value="dapps"
                className={`text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white data-[state=active]:shadow-none px-0 pb-2 transition-colors ${activeTab === 'dapps' ? 'text-white' : 'text-white/60'}`}
              >
                dApps
              </TabsTrigger>
              <div className="ml-auto">
                <Button variant="ghost" size="icon" className="rounded-full text-white/80 hover:text-white hover:bg-white/10">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Bank Withdrawal Section */}
        <div className="mt-4 border-t border-white/20 pt-4">
          <Button onClick={handleWithdraw} className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm font-semibold transition-all duration-200 hover:scale-[1.02]">
            Withdraw to Bank Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
