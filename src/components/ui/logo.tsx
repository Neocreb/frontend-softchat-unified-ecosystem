import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const EloityLogo = ({ className }: LogoProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-gradient-to-br from-eloity-primary to-eloity-accent text-white font-bold text-lg",
        className
      )}
    >
      E
    </div>
  );
};

export default EloityLogo;
