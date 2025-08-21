import React from "react";
import {
  Brain,
  BarChart3,
  Accessibility,
  Smartphone,
  GamepadIcon,
  Database,
} from "lucide-react";

const WhyEloitySection = () => {
  const benefits = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Intelligence",
      description:
        "Advanced algorithms provide smart recommendations, content curation, and price predictions that seamlessly connect all platform features.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Professional Analytics",
      description:
        "Enterprise-level insights and performance tracking help you grow faster and make data-driven decisions across all connected services.",
    },
    {
      icon: <Accessibility className="h-6 w-6" />,
      title: "Full Accessibility",
      description:
        "Complete accessibility support ensures everyone can connect and use the platform, regardless of ability or language.",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "PWA Technology",
      description:
        "Progressive Web App with offline capabilities, native-like experience, and seamless connectivity across any device.",
    },
    {
      icon: <GamepadIcon className="h-6 w-6" />,
      title: "Gamified Experience",
      description:
        "Achievement system, leaderboards, and challenges that connect users and keep them engaged across all platform features.",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Complete Data Control",
      description:
        "Import/export your data, integrate with other platforms, and maintain full ownership with seamless connectivity options.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50" id="why-eloity">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-eloity-headline text-3xl lg:text-4xl mb-6">
            Why Choose <span className="bg-gradient-to-r from-eloity-purple to-eloity-blue bg-clip-text text-transparent">Eloity</span>
          </h2>
          <p className="font-eloity-body text-lg text-gray-600">
            We've built the most advanced social platform where everything connects.
            Here's what sets us apart from the competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-eloity-purple/30 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-eloity-purple/10 to-eloity-blue/10 text-eloity-primary rounded-lg mb-5">
                {benefit.icon}
              </div>
              <h3 className="font-eloity-subheading text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="font-eloity-body text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Export with new name but keep old export for compatibility
export default WhyEloitySection;
export { WhyEloitySection as WhySoftchatSection };
