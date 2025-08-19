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
        "Advanced algorithms provide smart recommendations, content curation, and price predictions that other platforms simply don't have.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Professional Analytics",
      description:
        "Enterprise-level insights and performance tracking help you grow faster and make data-driven decisions.",
    },
    {
      icon: <Accessibility className="h-6 w-6" />,
      title: "Full Accessibility",
      description:
        "Complete accessibility support ensures everyone can use the platform, regardless of ability or language.",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "PWA Technology",
      description:
        "Progressive Web App with offline capabilities, native-like experience, and works on any device.",
    },
    {
      icon: <GamepadIcon className="h-6 w-6" />,
      title: "Gamified Experience",
      description:
        "Achievement system, leaderboards, and challenges keep users engaged and motivated to participate.",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Complete Data Control",
      description:
        "Import/export your data, integrate with other platforms, and maintain full ownership of your information.",
    },
  ];

  return (
    <section className="py-24 bg-gray-50" id="why-eloity">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-6">
            Why Choose <span className="gradient-text">Eloity</span>
          </h2>
          <p className="body-md text-muted-foreground max-w-2xl mx-auto">
            Experience the next generation of social platforms with features that put you in control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center p-3 bg-eloity-50 text-eloity-600 rounded-lg mb-5">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyEloitySection;
