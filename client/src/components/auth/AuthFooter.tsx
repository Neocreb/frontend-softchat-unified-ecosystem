
import { Button } from "@/components/ui/button";

const AuthFooter = () => {
  return (
    <p className="mt-2 text-xs text-center text-muted-foreground">
      By continuing, you agree to our{" "}
      <Button variant="link" className="p-0 h-auto text-xs">
        Terms of Service
      </Button>{" "}
      and{" "}
      <Button variant="link" className="p-0 h-auto text-xs">
        Privacy Policy
      </Button>
      .
    </p>
  );
};

export default AuthFooter;
