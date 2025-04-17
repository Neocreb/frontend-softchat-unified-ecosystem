
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Immediate redirect if auth state is known
    if (!isLoading) {
      if (isAuthenticated) {
        navigate("/feed", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
    }
  }, [navigate, isAuthenticated, isLoading]);

  // Show loading state while authentication is being determined
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
