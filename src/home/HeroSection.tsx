import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-16 sm:py-20 md:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] sm:h-[800px] sm:w-[800px] -translate-x-1/2 opacity-20 bg-gradient-radial from-softchat-500/40 to-transparent"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] translate-x-1/3 translate-y-1/3 opacity-20 bg-gradient-radial from-teal-400/40 to-transparent"></div>
      </div>

      <div className="container-wide relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="heading-xl mb-6">
            <span className="gradient-text">AI-Powered Everything:</span>{" "}
            Social, Crypto, Commerce, Analytics & More.
          </h1>

          <p className="body-lg mb-10 text-gray-600">
            The most advanced social platform with AI recommendations,
            comprehensive analytics, gamification, and full accessibility. Built
            for creators, traders, sellers, and innovators worldwide.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md sm:max-w-none mx-auto">
            {/* ✅ Launch App Button that redirects */}
            <Link to="/auth" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded w-full sm:w-auto hover:bg-blue-700 transition-all duration-200"
              >
                🚀 Launch App
              </Button>
            </Link>

            {/* ✅ Join Waitlist Button */}
            <a href="#contact" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-softchat-200 hover:bg-softchat-50 text-softchat-700 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto transition-all duration-200"
              >
                📧 Join Waitlist
              </Button>
            </a>
          </div>

          <div className="mt-16 relative">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-tr from-softchat-500 to-teal-400 opacity-70 blur-sm"></div>
            <div className="relative rounded-xl bg-white shadow-xl overflow-hidden border border-gray-100">
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
