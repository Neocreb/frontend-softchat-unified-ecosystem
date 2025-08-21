import { cn } from "@/utils/utils";

type EloityLogoProps = {
  className?: string;
  showText?: boolean;
};

const EloityLogo = ({ className, showText = false }: EloityLogoProps) => {
  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      {/* Logo Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-eloity-primary to-eloity-secondary rounded-full blur-sm opacity-30"></div>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("relative z-10 w-8 h-8", className)}
        >
          {/* Modern E shape with flowing design */}
          <defs>
            <linearGradient
              id="eloityGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#7D5FFF" />
              <stop offset="50%" stopColor="#5B47FF" />
              <stop offset="100%" stopColor="#2979FF" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer circle with gradient */}
          <circle 
            cx="16" 
            cy="16" 
            r="15" 
            fill="url(#eloityGradient)" 
            filter="url(#glow)"
          />
          
          {/* Modern E letter design */}
          <path
            d="M9 8 L9 24 L23 24 M9 16 L19 16 M9 8 L21 8"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Decorative dots representing connectivity */}
          <circle cx="21" cy="10" r="1.5" fill="white" opacity="0.8" />
          <circle cx="19" cy="18" r="1.2" fill="white" opacity="0.6" />
          <circle cx="17" cy="22" r="1" fill="white" opacity="0.7" />
        </svg>
      </div>
      
      {/* Text Logo */}
      {showText && (
        <span className="font-bold text-lg bg-gradient-to-r from-eloity-primary to-eloity-secondary bg-clip-text text-transparent">
          Eloity
        </span>
      )}
    </div>
  );
};

export default EloityLogo;
