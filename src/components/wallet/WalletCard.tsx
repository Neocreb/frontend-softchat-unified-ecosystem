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
  const [balance, setBalance] = useState(17034.81);
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
    <Card className="overflow-hidden bg-gradient-to-b from-white to-blue-50 border-0 shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* Balance Section */}
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
            Balance 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 12L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-5xl font-bold">${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={handleSend} 
            className="bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-xl flex items-center justify-center gap-2"
          >
            <ArrowUp className="h-5 w-5" />
            <span className="text-lg">Send</span>
          </Button>
          <Button 
            onClick={handleReceive} 
            variant="outline" 
            className="bg-white border-gray-200 py-6 rounded-xl flex items-center justify-center gap-2"
          >
            <ArrowDown className="h-5 w-5" />
            <span className="text-lg">Receive</span>
          </Button>
        </div>

        {/* Contacts Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-medium">Contacts</div>
            <Button variant="link" className="text-blue-500 p-0">view all</Button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex flex-col items-center min-w-[80px]">
                <Avatar className="h-16 w-16 rounded-full border-2 border-white shadow">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-500 mt-1">@{contact.username}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-transparent border-b justify-start gap-6 h-auto pb-2">
              <TabsTrigger 
                value="coins" 
                className={`text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:shadow-none px-0 pb-2 ${activeTab === 'coins' ? 'text-black' : 'text-gray-400'}`}
              >
                Coins
              </TabsTrigger>
              <TabsTrigger 
                value="nfts" 
                className={`text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:shadow-none px-0 pb-2 ${activeTab === 'nfts' ? 'text-black' : 'text-gray-400'}`}
              >
                NFTs
              </TabsTrigger>
              <TabsTrigger 
                value="dapps" 
                className={`text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:shadow-none px-0 pb-2 ${activeTab === 'dapps' ? 'text-black' : 'text-gray-400'}`}
              >
                dApps
              </TabsTrigger>
              <div className="ml-auto">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Bank Withdrawal Section */}
        <div className="mt-4 border-t pt-4">
          <Button onClick={handleWithdraw} className="w-full bg-green-500 hover:bg-green-600">
            Withdraw to Bank Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
