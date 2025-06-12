import { CheckCircle } from "lucide-react";

const ProblemSolutionSection = () => {
  const solutions = [
    {
      title: "AI-powered social experience",
      description:
        "Smart feed curation, content recommendations, and advanced search across everything",
    },
    {
      title: "Professional analytics dashboard",
      description:
        "Track performance, analyze audience, set goals, and grow with data-driven insights",
    },
    {
      title: "Advanced crypto trading",
      description:
        "AI price predictions, professional charts, portfolio tracking, and secure P2P trading",
    },
    {
      title: "Gamified rewards system",
      description:
        "Earn achievements, compete on leaderboards, and unlock exclusive perks and benefits",
    },
    {
      title: "Full accessibility support",
      description:
        "Screen reader compatibility, keyboard navigation, and multi-language support for everyone",
    },
    {
      title: "Seamless data management",
      description:
        "Import/export data, integrate with other platforms, and maintain full control of your information",
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
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-softchat-600 mr-2" />
                <h3 className="font-semibold text-lg">{solution.title}</h3>
              </div>
              <p className="text-gray-600">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
