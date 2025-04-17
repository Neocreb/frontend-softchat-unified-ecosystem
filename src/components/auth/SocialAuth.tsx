
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const SocialAuth = () => {
  return (
    <>
      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <Button variant="outline" className="w-full" disabled>
          <Github className="mr-2 h-4 w-4" /> GitHub
        </Button>
      </div>
    </>
  );
};

export default SocialAuth;
