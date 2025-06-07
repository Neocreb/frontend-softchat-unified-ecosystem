
import { CheckCircle } from 'lucide-react';

const ProblemSolutionSection = () => {
  const solutions = [
    { title: "Chat in real-time", description: "Connect instantly with friends, followers, and customers" },
    { title: "Sell anything instantly", description: "List products and accept payments in seconds" },
    { title: "Trade crypto securely", description: "Buy, sell, and swap cryptocurrencies seamlessly" },
    { title: "Earn rewards passively", description: "Get SoftPoints for every action you take" },
  ];

  return (
    <section className="py-20 bg-white" id="problem-solution">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-lg mb-6">
            Juggling 5 apps to earn, chat, and sell? <span className="gradient-text">We fixed that.</span>
          </h2>
          <p className="body-md text-gray-600">
            Softchat combines social networking, marketplace, crypto trading, and rewards in one powerful platform designed specifically for emerging markets.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
