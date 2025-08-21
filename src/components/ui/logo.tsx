import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const EloityLogo = ({ className }: LogoProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-gradient-to-br from-eloity-purple to-eloity-blue text-white font-bold text-lg",
        className
      )}
    >
      EL
    </div>
  );
};

// Keep legacy export for backward compatibility
export default EloityLogo;
export { EloityLogo as SoftchatLogo };
