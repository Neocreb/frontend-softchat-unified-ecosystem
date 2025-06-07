
import { useState } from 'react';
import { MessageSquare, ShoppingBag, Wallet, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FeaturesSection = () => {
  const features = [
    {
      id: "feed",
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Feed",
      tagline: "Connect and grow your network",
      description: "Build meaningful connections, share updates, and engage with your community all in one place. Softchat's intelligent algorithms ensure you see content that matters most to you.",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=1280",
    },
    {
      id: "marketplace",
      icon: <ShoppingBag className="h-6 w-6" />,
      title: "Marketplace",
      tagline: "List, buy and sell locally",
      description: "Turn followers into customers with our integrated marketplace. List products in seconds, process payments seamlessly, and build your business right where your audience already is.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1280",
    },
    {
      id: "crypto",
      icon: <Wallet className="h-6 w-6" />,
      title: "Crypto",
      tagline: "P2P, Wallets, Conversions",
      description: "Buy, sell, and trade cryptocurrencies with confidence. Our secure wallet and P2P exchange are built for emerging markets, making crypto accessible to everyone.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1280",
    },
    {
      id: "rewards",
      icon: <Gift className="h-6 w-6" />,
      title: "Rewards",
      tagline: "Earn SoftPoints for every action",
      description: "Get rewarded just for using Softchat. Earn SoftPoints when you post, shop, or trade – then redeem for exclusive perks, discounts, and real-world benefits.",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1280",
    },
  ];

  const [activeFeature, setActiveFeature] = useState(features[0].id);

  return (
    <section className="py-24 bg-gray-50" id="features">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-lg mb-6">Experience the <span className="gradient-text">Full Suite</span></h2>
          <p className="body-md text-gray-600">
            Four powerful tools in one seamless experience. Softchat redefines what an app can do in emerging markets.
          </p>
        </div>

        <div className="mt-12">
          <Tabs defaultValue={features[0].id} value={activeFeature} onValueChange={setActiveFeature}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-transparent">
              {features.map((feature) => (
                <TabsTrigger 
                  key={feature.id}
                  value={feature.id}
                  className="data-[state=active]:bg-softchat-50 data-[state=active]:text-softchat-700 data-[state=active]:shadow border border-gray-200 bg-white"
                >
                  <div className="flex flex-col items-center text-center p-2">
                    <div className="mb-2 text-softchat-600">
                      {feature.icon}
                    </div>
                    <h3 className="text-base font-medium">{feature.title}</h3>
                    <p className="text-sm text-gray-500 hidden md:block">{feature.tagline}</p>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {features.map((feature) => (
              <TabsContent 
                key={feature.id} 
                value={feature.id}
                className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in"
              >
                <div className="grid md:grid-cols-2">
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-softchat-600 font-medium mb-4">{feature.tagline}</p>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    <Button className="btn-primary self-start">
                      Learn More
                    </Button>
                  </div>
                  <div className="bg-gray-100 flex items-center justify-center p-4 h-64 md:h-auto order-first md:order-last">
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="object-cover h-full w-full rounded-lg"
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
