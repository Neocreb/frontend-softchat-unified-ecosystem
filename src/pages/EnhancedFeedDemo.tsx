import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  MessageSquare,
  Share2,
  Gift,
  ShoppingCart,
  Briefcase,
  Calendar,
  Video,
  Users,
  TrendingUp,
  Globe,
  Heart,
  Bookmark,
  ArrowRight,
} from "lucide-react";
import UnifiedEnhancedFeed from "@/components/feed/UnifiedEnhancedFeed";
import { EnhancedFeedProvider } from "@/contexts/EnhancedFeedContext";
import { useNavigate } from "react-router-dom";

const EnhancedFeedDemo: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: "Functional Comments",
      description: "Full comment system with threading, replies, and promotion to posts",
      color: "text-blue-500",
    },
    {
      icon: Share2,
      title: "Enhanced Sharing",
      description: "Copy links, external sharing, repost, and quote post functionality",
      color: "text-green-500",
    },
    {
      icon: Gift,
      title: "Virtual Gifts",
      description: "Send tips and gifts to content creators with integrated wallet",
      color: "text-purple-500",
    },
    {
      icon: ShoppingCart,
      title: "Smart Action Buttons",
      description: "Context-aware buttons for buying, applying, hiring, and joining",
      color: "text-orange-500",
    },
    {
      icon: Sparkles,
      title: "SoftPoints Rewards",
      description: "Earn rewards for all interactions and activities on the platform",
      color: "text-yellow-500",
    },
    {
      icon: Users,
      title: "Publishing Options",
      description: "Choose to publish to Classic mode, Thread mode, or both",
      color: "text-indigo-500",
    },
  ];

  const contentTypes = [
    { icon: MessageSquare, label: "Regular Posts", description: "Standard social media posts" },
    { icon: ShoppingCart, label: "Products", description: "E-commerce listings with buy buttons" },
    { icon: Briefcase, label: "Job Postings", description: "Freelance and full-time opportunities" },
    { icon: Calendar, label: "Events", description: "Conferences, workshops, and meetups" },
    { icon: Users, label: "Services", description: "Professional services and consulting" },
    { icon: Video, label: "Videos", description: "Educational and entertainment content" },
    { icon: Globe, label: "Live Streams", description: "Real-time broadcasting and tutorials" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="h-16 w-16 text-primary animate-pulse" />
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Enhanced Social Feed
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience the unified social media, e-commerce, and freelancing platform with 
            fully functional interactions, smart routing, and integrated rewards system.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="px-3 py-1">
              <Heart className="h-4 w-4 mr-1" />
              Functional Interactions
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              Smart Routing
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Sparkles className="h-4 w-4 mr-1" />
              SoftPoints Rewards
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Users className="h-4 w-4 mr-1" />
              Unified Experience
            </Badge>
          </div>
          
          <Button 
            size="lg" 
            onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Try the Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Enhanced Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All social interactions now work seamlessly with smart routing and integrated rewards
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Content Types */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Unified Content Types</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create and interact with different types of content, each with smart action buttons
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contentTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">{type.label}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div id="demo-section" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Interactive Demo</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Try all the features! Like posts, open comments, share content, send gifts, and click action buttons
          </p>
        </div>
        
        <EnhancedFeedProvider>
          <UnifiedEnhancedFeed />
        </EnhancedFeedProvider>
      </div>

      {/* Implementation Summary */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">What's Been Implemented</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Thread Mode Enhancements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Enhanced share modal with all options</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Functional comment system</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Virtual gifts and tips integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Post publishing to Thread mode</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-500" />
                  Classic Mode Enhancements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Smart action buttons for all content types</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Unified interaction experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">SoftPoints rewards integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Publishing destination options</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 p-6 bg-primary/10 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">🎉 All Features Now Functional!</h3>
            <p className="text-muted-foreground mb-4">
              Comment, share, and gift icons work perfectly in both modes. Action buttons (Buy, Apply, Hire, Join events) 
              now route correctly to their respective pages. The reward system is integrated for all interactions, 
              and users can choose where to publish their posts.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => navigate('/marketplace')}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Visit Marketplace
              </Button>
              <Button variant="outline" onClick={() => navigate('/freelance')}>
                <Briefcase className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
              <Button variant="outline" onClick={() => navigate('/events')}>
                <Calendar className="h-4 w-4 mr-2" />
                Find Events
              </Button>
              <Button variant="outline" onClick={() => navigate('/videos')}>
                <Video className="h-4 w-4 mr-2" />
                Watch Videos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFeedDemo;
