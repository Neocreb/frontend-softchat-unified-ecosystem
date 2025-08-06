import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AuthFooter = () => {
  const navigate = useNavigate();

  return (
    <p className="mt-2 text-xs text-center text-muted-foreground">
      By continuing, you agree to our{" "}
      <Button
        variant="link"
        className="p-0 h-auto text-xs"
        onClick={() => navigate("/terms")}
      >
        Terms of Service
      </Button>{" "}
      and{" "}
      <Button
        variant="link"
        className="p-0 h-auto text-xs"
        onClick={() => navigate("/privacy")}
      >
        Privacy Policy
      </Button>
      .
    </p>
  );
};

export default AuthFooter;
