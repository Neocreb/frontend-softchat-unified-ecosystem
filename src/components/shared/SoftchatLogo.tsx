import { cn } from "@/utils/utils";

type EloityLogoProps = {
  className?: string;
};

const EloityLogo = ({ className }: EloityLogoProps) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 bg-eloity-accent rounded-full blur-sm opacity-30"></div>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("relative z-10", className)}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="url(#paint0_linear_eloity)"
        />
        {/* Modern 'E' shape */}
        <path
          d="M8 7h6M8 7v10M8 12h5M8 17h6"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Connection dots representing unity */}
        <circle cx="16" cy="9" r="1" fill="white" opacity="0.8" />
        <circle cx="16" cy="12" r="1" fill="white" opacity="0.6" />
        <circle cx="16" cy="15" r="1" fill="white" opacity="0.8" />
        <defs>
          <linearGradient
            id="paint0_linear_eloity"
            x1="2"
            y1="12"
            x2="22"
            y2="12"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7D5FFF" />
            <stop offset="0.5" stopColor="#5A7FFF" />
            <stop offset="1" stopColor="#2979FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Keep legacy export for backward compatibility
export default EloityLogo;
export { EloityLogo as SoftchatLogo };
