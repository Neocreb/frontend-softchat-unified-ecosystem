import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/hooks/use-notification";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AuthHeader from "./AuthHeader";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SocialAuth from "./SocialAuth";
import AuthFooter from "./AuthFooter";

const EnhancedAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo@softchat.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const notification = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log(`Attempting to ${isLogin ? 'login' : 'register'} user: ${email}`);

      if (isLogin) {
        const result = await login(email, password);
        if (result.error) {
          let errorMessage = result.error.message || "Login failed";

          // Provide more helpful error messages
          if (errorMessage === "Invalid login credentials") {
            errorMessage = "Invalid email or password. Please check your credentials and try again.";
          }

          setError(errorMessage);
          notification.error(errorMessage);
          console.error("Login error:", result.error);
        } else {
          notification.success("Successfully logged in!");
          console.log("Login successful, navigating to /feed");
          navigate("/feed", { replace: true });
        }
      } else {
        if (!name) {
          const nameError = "Name is required";
          setError(nameError);
          notification.error(nameError);
          setIsSubmitting(false);
          return;
        }

        const result = await signup(email, password, name);
        if (result.error) {
          let errorMessage = result.error.message || "Registration failed";

          // Provide more helpful error messages
          if (errorMessage === "User already registered") {
            errorMessage = "An account with this email already exists. Please try logging in instead.";
            // Automatically switch to login tab when user already exists
            setTimeout(() => {
              setIsLogin(true);
              notification.info("Switched to login. Please enter your password to sign in.");
            }, 2000);
          }

          setError(errorMessage);
          notification.error(errorMessage);
          console.error("Registration error:", result.error);
        } else {
          notification.success("Registration successful! Please check your email for verification.");
          console.log("Registration successful, navigating to /feed");
          navigate("/feed", { replace: true });
        }
      }
    } catch (err: any) {
      console.error("Auth submission error:", err);
      const errorMessage = err.message || "Authentication failed";
      setError(errorMessage);
      notification.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Attempting demo login");
      const result = await login("demo@softchat.com", "password123");
      if (result.error) {
        const errorMessage = result.error.message || "Demo login failed";
        setError(errorMessage);
        notification.error(errorMessage);
        console.error("Demo login error:", result.error);
      } else {
        notification.success("Successfully logged in with demo account!");
        console.log("Demo login successful, navigating to /feed");
        navigate("/feed", { replace: true });
      }
    } catch (err: any) {
      console.error("Demo login error:", err);
      const errorMessage = err.message || "Demo login failed";
      setError(errorMessage);
      notification.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use the combined error from auth context and local state
  const displayError = error || (authError ? authError.message : null);

  // Helper component for error display with actionable guidance
  const ErrorHelper = ({ error }: { error: string | null }) => {
    if (!error) return null;

    const isLoginCredentialsError = error.includes("Invalid email or password");
    const isUserExistsError = error.includes("account with this email already exists");

    return (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600 mb-2">{error}</p>
        {isLoginCredentialsError && (
          <div className="text-xs text-red-500">
            <p>• Double-check your email address</p>
            <p>• Make sure your password is correct</p>
            <p>• Try the demo login if you don't have an account</p>
          </div>
        )}
        {isUserExistsError && (
          <div className="text-xs text-red-500">
            <p>• Use the Login tab instead of Register</p>
            <p>• Click "Forgot password?" if you don't remember it</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto shawdow-2xl rounded-lg">
      <CardHeader className="space-y-1 text-center">
        <AuthHeader isLogin={isLogin} />
        <ErrorHelper error={displayError} />
      </CardHeader>
      <Tabs defaultValue="login" onValueChange={(val) => setIsLogin(val === "login")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <CardContent className="pt-4">
          <TabsContent value="login">
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isSubmitting={isSubmitting}
              error={displayError}
              onSubmit={handleSubmit}
              onDemoLogin={handleDemoLogin}
            />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isSubmitting={isSubmitting}
              error={displayError}
              onSubmit={handleSubmit}
            />
          </TabsContent>

          <SocialAuth />
        </CardContent>
      </Tabs>
      <CardFooter className="flex flex-col">
        <AuthFooter />
      </CardFooter>
    </Card>
  );
};

export default EnhancedAuthForm;
