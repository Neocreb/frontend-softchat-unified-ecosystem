
import { cn } from "@/utils/utils";

type SoftchatLogoProps = {
  className?: string;
};

const SoftchatLogo = ({ className }: SoftchatLogoProps) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 bg-softchat-accent rounded-full blur-sm opacity-30"></div>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("relative z-10", className)}
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
          fill="url(#paint0_linear_1_2)"
        />
        <path
          d="M10.2 12.4C10.9732 12.4 11.6 11.7732 11.6 11C11.6 10.2268 10.9732 9.6 10.2 9.6C9.42681 9.6 8.8 10.2268 8.8 11C8.8 11.7732 9.42681 12.4 10.2 12.4Z"
          fill="white"
        />
        <path
          d="M14 12.4C14.7732 12.4 15.4 11.7732 15.4 11C15.4 10.2268 14.7732 9.6 14 9.6C13.2268 9.6 12.6 10.2268 12.6 11C12.6 11.7732 13.2268 12.4 14 12.4Z"
          fill="white"
        />
        <path
          d="M16 14.8C15.3372 14.8 14.8 15.3372 14.8 16C14.8 16.6628 15.3372 17.2 16 17.2C16.6628 17.2 17.2 16.6628 17.2 16C17.2 15.3372 16.6628 14.8 16 14.8Z"
          fill="white"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1_2"
            x1="2"
            y1="12"
            x2="22"
            y2="12"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6366F1" />
            <stop offset="0.5" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default SoftchatLogo;
