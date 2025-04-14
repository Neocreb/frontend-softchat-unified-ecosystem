
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export type UserRole = "user" | "admin" | "moderator";

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  verified: boolean;
  level: "bronze" | "silver" | "gold" | "platinum";
  points: number;
  joinDate: string;
  role?: UserRole;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isModerator: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("softchat_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const isModerator = () => {
    return user?.role === "moderator" || user?.role === "admin";
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock login - in a real app, this would validate with a backend
      if (email === "admin@example.com" && password === "admin") {
        // Admin user
        const mockUser: User = {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
          username: "admin",
          avatar: "/placeholder.svg",
          verified: true,
          level: "platinum",
          points: 9999,
          joinDate: "2025-01-01",
          role: "admin"
        };
        
        setUser(mockUser);
        localStorage.setItem("softchat_user", JSON.stringify(mockUser));
        toast({
          title: "Admin login successful",
          description: "Welcome to the admin panel!",
        });
        navigate("/");
      } else if (email === "demo@example.com" && password === "password") {
        // Regular user
        const mockUser: User = {
          id: "user123",
          name: "John Doe",
          email: "demo@example.com",
          username: "johndoe",
          avatar: "/placeholder.svg",
          verified: true,
          level: "bronze",
          points: 2450,
          joinDate: "2025-01-15",
          role: "user"
        };
        
        setUser(mockUser);
        localStorage.setItem("softchat_user", JSON.stringify(mockUser));
        toast({
          title: "Login successful",
          description: "Welcome back to Softchat!",
        });
        navigate("/");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock registration
      const mockUser: User = {
        id: "user" + Math.floor(Math.random() * 1000),
        name,
        email,
        username: email.split("@")[0],
        avatar: "/placeholder.svg",
        verified: false,
        level: "bronze",
        points: 100,
        joinDate: new Date().toISOString().split("T")[0],
        role: "user"
      };
      
      setUser(mockUser);
      localStorage.setItem("softchat_user", JSON.stringify(mockUser));
      toast({
        title: "Registration successful",
        description: "Welcome to Softchat!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("softchat_user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        isAdmin,
        isModerator,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
