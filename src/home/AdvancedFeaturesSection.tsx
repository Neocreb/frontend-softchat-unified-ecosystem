import React from "react";
import {
  Smartphone,
  Search,
  Bell,
  Brain,
  BarChart3,
  GamepadIcon,
  Accessibility,
  Database,
  Zap,
} from "lucide-react";

const AdvancedFeaturesSection = () => {
  const advancedFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description:
        "Smart content curation, price predictions, and personalized recommendations powered by advanced AI algorithms.",
      features: [
        "Smart Feed Curation",
        "Content Assistant",
        "Price Predictions",
        "Auto Moderation",
      ],
    },
    {
      icon: BarChart3,
      title: "Professional Analytics",
      description:
        "Comprehensive dashboard with detailed insights, performance tracking, and goal management for serious users.",
      features: [
        "Real-time Analytics",
        "Audience Insights",
        "Goal Tracking",
        "Performance Reports",
      ],
    },
    {
      icon: GamepadIcon,
      title: "Gamification System",
      description:
        "Engaging achievement system with leaderboards, challenges, and rewards to keep users motivated and active.",
      features: [
        "Achievement Badges",
        "Leaderboards",
        "Daily Challenges",
        "Reward Points",
      ],
    },
    {
      icon: Smartphone,
      title: "PWA & Mobile-First",
      description:
        "Progressive Web App with offline capabilities, touch optimizations, and native mobile experience.",
      features: [
        "Offline Support",
        "Install Prompt",
        "Touch Gestures",
        "Mobile Optimized",
      ],
    },
    {
      icon: Search,
      title: "Advanced Search",
      description:
        "Powerful search across all content types with smart filters, suggestions, and saved searches.",
      features: [
        "Universal Search",
        "Smart Filters",
        "Auto-complete",
        "Search History",
      ],
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Intelligent notification system with real-time updates, smart grouping, and customizable preferences.",
      features: [
        "Real-time Updates",
        "Smart Grouping",
        "Custom Preferences",
        "Quiet Hours",
      ],
    },
    {
      icon: Accessibility,
      title: "Full Accessibility",
      description:
        "Complete accessibility support ensuring the platform is usable by everyone, regardless of ability.",
      features: [
        "Screen Reader Support",
        "Keyboard Navigation",
        "High Contrast",
        "Multi-language",
      ],
    },
    {
      icon: Database,
      title: "Data Management",
      description:
        "Comprehensive data control with import/export capabilities and seamless platform integrations.",
      features: [
        "Data Export",
        "Platform Sync",
        "API Access",
        "Privacy Controls",
      ],
    },
  ];

  return (
    <section className="py-24 bg-white" id="advanced-features">
      <div className="container-wide">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="heading-lg mb-6">
            Powered by{" "}
            <span className="gradient-text">Advanced Technology</span>
          </h2>
          <p className="body-md text-gray-600">
            Behind the sleek interface lies cutting-edge technology designed to
            deliver the most advanced social platform experience available
            today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advancedFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover-lift"
              >
                <div className="mb-4">
                  <div className="inline-flex p-3 bg-gradient-to-br from-softchat-500 to-softchat-600 rounded-lg mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {feature.description}
                  </p>
                </div>

                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-softchat-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-softchat-500 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Experience the Future of Social Platforms
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of users who are already enjoying the most advanced
              social platform ever built.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/auth"
                className="btn-primary bg-white text-softchat-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold inline-block"
              >
                🚀 Launch App Now
              </a>
              <a
                href="#contact"
                className="border-2 border-white text-white hover:bg-white hover:text-softchat-600 px-8 py-3 rounded-lg font-semibold inline-block transition-all duration-200"
              >
                📧 Join Waitlist
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeaturesSection;
