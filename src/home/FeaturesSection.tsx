import { useState } from "react";
import {
  MessageSquare,
  ShoppingBag,
  Wallet,
  Gift,
  Brain,
  BarChart3,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FeaturesSection = () => {
  const features = [
    {
      id: "social",
      icon: <Brain className="h-6 w-6" />,
      title: "Social & AI",
      tagline: "Smart connections with AI-powered recommendations",
      description:
        "Build meaningful connections with AI-powered feed curation, smart content suggestions, and personalized recommendations. Advanced search helps you discover exactly what you need across all content types.",
      image:
        "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=1280",
    },
    {
      id: "marketplace",
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Marketplace & Analytics",
      tagline: "E-commerce with powerful insights",
      description:
        "Advanced marketplace with detailed analytics, performance tracking, and data-driven insights. Track your sales, understand your customers, and grow your business with comprehensive dashboard tools.",
      image:
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1280",
    },
    {
      id: "crypto",
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Crypto & Trading",
      tagline: "Advanced trading with AI predictions",
      description:
        "Professional-grade crypto trading with AI price predictions, advanced charting tools, portfolio analytics, and secure P2P trading. Built for both beginners and experienced traders.",
      image:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1280",
    },
    {
      id: "platform",
      icon: <Zap className="h-6 w-6" />,
      title: "Platform & Rewards",
      tagline: "Gamified experience with accessibility",
      description:
        "Earn rewards through gamification, track achievements, compete on leaderboards. Full accessibility support, PWA capabilities, and seamless data import/export across all your platforms.",
      image:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1280",
    },
  ];

  const [activeFeature, setActiveFeature] = useState(features[0].id);

  return (
    <section className="py-24 bg-gray-50" id="features">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-lg mb-6">
            Experience the <span className="gradient-text">Full Suite</span>
          </h2>
          <p className="body-md text-gray-600">
            Four powerful tools in one seamless experience. Softchat redefines
            what an app can do in emerging markets.
          </p>
        </div>

        <div className="mt-12">
          <Tabs
            defaultValue={features[0].id}
            value={activeFeature}
            onValueChange={setActiveFeature}
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-transparent">
              {features.map((feature) => (
                <TabsTrigger
                  key={feature.id}
                  value={feature.id}
                  className="data-[state=active]:bg-softchat-50 data-[state=active]:text-softchat-700 data-[state=active]:shadow border border-gray-200 bg-white"
                >
                  <div className="flex flex-col items-center text-center p-2">
                    <div className="mb-2 text-softchat-600">{feature.icon}</div>
                    <h3 className="text-base font-medium">{feature.title}</h3>
                    <p className="text-sm text-gray-500 hidden md:block">
                      {feature.tagline}
                    </p>
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
                    <p className="text-softchat-600 font-medium mb-4">
                      {feature.tagline}
                    </p>
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
