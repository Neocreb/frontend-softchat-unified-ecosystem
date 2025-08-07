import React from "react";
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
            Social, Crypto, Commerce, Freelance & More.
          </h1>

          <p className="body-lg mb-10 text-gray-600">
            The most advanced social platform with AI recommendations,
            comprehensive analytics, gamification, and full accessibility.
            Connect, trade, freelance, and innovate with secure crypto escrow
            and intelligent matching.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md sm:max-w-none mx-auto">
            {/* ✅ Launch App Button that redirects */}
            <Link to="/auth" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded w-full sm:w-auto transition-all duration-200 shadow-lg hover:shadow-xl"
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

          {/* Delivery Quick Access Section */}
          <div className="mt-8 pt-8 border-t border-gray-200/50">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                Delivery Network
              </h3>
              <p className="text-sm text-gray-600">Fast, reliable delivery services at your fingertips</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
              {/* Track Package Card */}
              <Link to="/delivery/track" className="flex-1 group">
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 border border-blue-200/60 hover:border-blue-300/80 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
                  {/* Floating Background Icon */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white text-lg font-semibold shadow-lg">
                        📦
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-blue-900">Track Package</h4>
                        <p className="text-xs text-blue-600">Real-time tracking</p>
                      </div>
                    </div>
                    <p className="text-sm text-blue-700/80 leading-relaxed">
                      Monitor your deliveries with live updates and precise location tracking
                    </p>
                    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                      Track now
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Become Driver Card */}
              <Link to="/delivery/apply" className="flex-1 group">
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 border border-green-200/60 hover:border-green-300/80 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:-translate-y-1">
                  {/* Floating Background Icon */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white text-lg font-semibold shadow-lg">
                        🚛
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-green-900">Become Driver</h4>
                        <p className="text-xs text-green-600">Start earning today</p>
                      </div>
                    </div>
                    <p className="text-sm text-green-700/80 leading-relaxed">
                      Join our delivery network and earn competitive rates with flexible schedules
                    </p>
                    <div className="mt-4 flex items-center text-green-600 text-sm font-medium group-hover:text-green-700 transition-colors">
                      Apply now
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Additional Features */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span>Real-time GPS tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>Flexible earning opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span>24/7 customer support</span>
              </div>
            </div>
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
