import {
  CheckCircle,
  Brain,
  BarChart3,
  TrendingUp,
  Trophy,
  Accessibility,
  Database,
} from "lucide-react";

const ProblemSolutionSection = () => {
  const solutions = [
    {
      title: "AI-powered social experience",
      description:
        "Smart feed curation, content recommendations, and advanced search across everything",
      icon: Brain,
    },
    {
      title: "Professional analytics dashboard",
      description:
        "Track performance, analyze audience, set goals, and grow with data-driven insights",
      icon: BarChart3,
    },
    {
      title: "Advanced crypto trading",
      description:
        "AI price predictions, professional charts, portfolio tracking, and secure P2P trading",
      icon: TrendingUp,
    },
    {
      title: "Gamified rewards system",
      description:
        "Earn achievements, compete on leaderboards, and unlock exclusive perks and benefits",
      icon: Trophy,
    },
    {
      title: "Full accessibility support",
      description:
        "Screen reader compatibility, keyboard navigation, and multi-language support for everyone",
      icon: Accessibility,
    },
    {
      title: "Seamless data management",
      description:
        "Import/export data, integrate with other platforms, and maintain full control of your information",
      icon: Database,
    },
  ];

  return (
    <section className="py-20 bg-white" id="problem-solution">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-lg mb-6">
            Tired of basic social apps without intelligence?{" "}
            <span className="gradient-text">We revolutionized that.</span>
          </h2>
          <p className="body-md text-gray-600">
            Softchat delivers the most advanced social platform with AI-powered
            features, professional analytics, comprehensive accessibility, and
            seamless integrations - all in one intelligent ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow hover-lift"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-softchat-50 rounded-lg mr-3">
                    <IconComponent className="h-6 w-6 text-softchat-600" />
                  </div>
                  <h3 className="font-semibold text-lg">{solution.title}</h3>
                </div>
                <p className="text-gray-600">{solution.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
