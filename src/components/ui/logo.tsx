import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const SoftchatLogo = ({ className }: LogoProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-lg",
        className
      )}
    >
      SC
    </div>
  );
};

export default SoftchatLogo;