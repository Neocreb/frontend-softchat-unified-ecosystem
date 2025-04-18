
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect after we know the authentication state
    if (!isLoading) {
      console.log("Index page: Auth state determined", { isAuthenticated, isLoading });
      
      if (isAuthenticated) {
        navigate("/feed", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
    }
  }, [navigate, isAuthenticated, isLoading]);

  // Show a more informative loading state
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Checking authentication status...</p>
        {isLoading && <p className="text-xs text-muted-foreground mt-2">This may take a moment</p>}
      </div>
    </div>
  );
};

export default Index;
