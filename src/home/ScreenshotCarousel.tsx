import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/supabase/utils";

const ScreenshotCarousel = () => {
  const screenshots = [
    {
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1280",
      title: "Social Feed",
      description:
        "Connect with friends and discover content that matters to you",
    },
    {
      image:
        "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1280",
      title: "User Profile",
      description: "Showcase your identity and manage your digital presence",
    },
    {
      image:
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1280",
      title: "Marketplace",
      description: "Buy and sell products with built-in secure payments",
    },
    {
      image:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1280",
      title: "Crypto Wallet",
      description: "Manage your digital assets with our secure wallet",
    },
    {
      image:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1280",
      title: "P2P Trading",
      description: "Trade directly with other users with no intermediaries",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? screenshots.length - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current === screenshots.length - 1 ? 0 : current + 1,
    );
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-24 bg-white overflow-hidden" id="screenshots">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-lg mb-6">
            See Softchat <span className="gradient-text">in Action</span>
          </h2>
          <p className="body-md text-gray-600">
            Take a visual tour of the app that's changing how people connect,
            trade, and earn in emerging markets.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Carousel navigation */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors"
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors"
            aria-label="Next screenshot"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>

          {/* Screenshots */}
          <div className="relative overflow-hidden rounded-xl shadow-xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {screenshots.map((screenshot, index) => (
                <div key={index} className="min-w-full">
                  <div className="relative aspect-video bg-gray-100">
                    <img
                      src={screenshot.image}
                      alt={screenshot.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-white p-6 text-center">
                    <h3 className="text-xl font-medium mb-2">
                      {screenshot.title}
                    </h3>
                    <p className="text-gray-600">{screenshot.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-6 gap-2">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  activeIndex === index
                    ? "bg-softchat-600"
                    : "bg-gray-300 hover:bg-gray-400",
                )}
                aria-label={`Go to screenshot ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotCarousel;
