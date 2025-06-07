
import { Shield, Zap, Award, LayoutGrid } from 'lucide-react';

const WhySoftchatSection = () => {
  const benefits = [
    {
      icon: <LayoutGrid className="h-6 w-6" />,
      title: "Unified App Experience",
      description: "Stop switching between apps. Do everything from chat to crypto in one seamless platform."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Nigeria-ready Wallet & Crypto",
      description: "Built specifically for emerging markets with local payment options and compliance."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Built-in Rewards System",
      description: "Earn SoftPoints with every interaction and redeem for valuable perks and discounts."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Admin Tools & Seller Dashboard",
      description: "Powerful business tools to manage products, track performance, and grow your customer base."
    }
  ];

  return (
    <section className="py-24 bg-gray-50" id="why-softchat">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-lg mb-6">Why Choose <span className="gradient-text">Softchat</span></h2>
          <p className="body-md text-gray-600">
            We've reimagined what an app can do in emerging markets. Here's what makes Softchat different.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="inline-flex items-center justify-center p-3 bg-softchat-50 text-softchat-600 rounded-lg mb-5">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySoftchatSection;
