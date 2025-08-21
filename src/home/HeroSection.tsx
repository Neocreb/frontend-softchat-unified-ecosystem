import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-eloity-purple via-blue-500 to-eloity-blue py-16 sm:py-20 md:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] sm:h-[800px] sm:w-[800px] -translate-x-1/2 opacity-30 bg-gradient-radial from-white/20 to-transparent"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] translate-x-1/3 translate-y-1/3 opacity-30 bg-gradient-radial from-white/20 to-transparent"></div>
      </div>

      <div className="container-wide relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-eloity-headline text-4xl sm:text-5xl lg:text-6xl mb-6 text-white">
            Experience the Future of{" "}
            <span className="block mt-2">Social Platforms</span>
          </h1>

          <p className="font-eloity-body text-lg sm:text-xl mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who are already enjoying the most
            advanced social platform ever built.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col gap-4 max-w-md mx-auto mb-12">
            {/* Launch App Button - Gradient with rocket emoji */}
            <Link to="/auth" className="w-full">
              <Button
                size="lg"
                className="font-eloity-subheading w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
              >
                🚀 Launch App Now
              </Button>
            </Link>

            {/* Join Waitlist Button - Outlined with gradient border */}
            <a href="#contact" className="w-full">
              <Button
                size="lg"
                variant="outline"
                className="font-eloity-body w-full bg-transparent border-2 border-white/40 hover:bg-white/10 text-white hover:text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
              >
                📄 Join Waitlist
              </Button>
            </a>
          </div>

          {/* Additional Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {/* Become a Driver */}
            <Link to="/delivery/apply" className="group">
              <div className="relative p-4 rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-950/30 dark:to-emerald-900/20 border-2 border-green-300 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    🚛
                  </div>
                  <div>
                    <h4 className="font-extrabold text-green-900 dark:text-green-100">Become a Driver</h4>
                    <p className="text-xs text-green-700 dark:text-green-300">Start earning today</p>
                  </div>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Join our delivery network and earn competitive rates
                </p>
              </div>
            </Link>

            {/* Track Product */}
            <Link to="/delivery/track" className="group">
              <div className="relative p-4 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-950/30 dark:to-indigo-900/20 border-2 border-blue-300 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    📦
                  </div>
                  <div>
                    <h4 className="font-extrabold text-blue-900 dark:text-blue-100">Track Product</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Real-time tracking</p>
                  </div>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Monitor your deliveries with live location updates
                </p>
              </div>
            </Link>

            {/* Marketplace */}
            <Link to="/marketplace" className="group">
              <div className="relative p-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-950/30 dark:to-pink-900/20 border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    🛍️
                  </div>
                  <div>
                    <h4 className="font-extrabold text-purple-900 dark:text-purple-100">Shop Now</h4>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Discover products</p>
                  </div>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Browse amazing products from verified sellers
                </p>
              </div>
            </Link>
          </div>

          {/* Features Highlight */}
          <div className="mt-8 pt-8 border-t border-border/50">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                Why Choose Softchat?
              </h3>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Everything you need in one intelligent platform</p>
            </div>

            {/* Feature highlights grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-6">
              <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold mx-auto mb-2">AI</div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Smart Recommendations</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold mx-auto mb-2">💰</div>
                <p className="text-xs font-medium text-green-700 dark:text-green-300">Crypto Trading</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold mx-auto mb-2">🛍️</div>
                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">Marketplace</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold mx-auto mb-2">👥</div>
                <p className="text-xs font-medium text-orange-700 dark:text-orange-300">Social Network</p>
              </div>
            </div>

            {/* Key features */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground dark:text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span>AI-powered content discovery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>Secure crypto trading</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span>Freelance marketplace</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <span>Real-time delivery tracking</span>
              </div>
            </div>
          </div>

          <div className="mt-16 relative">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-tr from-softchat-500 to-teal-400 opacity-70 blur-sm"></div>
            <div className="relative rounded-xl bg-card dark:bg-card shadow-xl overflow-hidden border border-border dark:border-border">
              <img
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1280"
                alt="Softchat app interface"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
