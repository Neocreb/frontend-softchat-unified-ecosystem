
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
  const { login, signup, error } = useAuth();
  const notification = useNotification();
  const navigate = useNavigate(); // Add this line

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
        notification.success("Successfully logged in!");
        navigate("/feed"); // Use React Router navigation instead of direct window.location
      } else {
        if (!name) {
          throw new Error("Name is required");
        }
        await signup(email, password, name);
        notification.success("Registration successful! Please check your email for verification.");
        navigate("/feed"); // Navigate after successful signup
      }
    } catch (err: any) {
      notification.error(err.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    try {
      await login("demo@softchat.com", "password123");
      notification.success("Successfully logged in with demo account!");
      navigate("/feed"); // Use React Router navigation
    } catch (err: any) {
      notification.error(err.message || "Demo login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <AuthHeader isLogin={isLogin} />
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
              error={error}
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
              error={error}
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
