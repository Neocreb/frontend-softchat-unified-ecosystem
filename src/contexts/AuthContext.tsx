
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

// Define types for our context
type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  error: Error | null;
  login: (email: string, password: string) => Promise<{ error?: Error }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: Error }>;
  isAdmin: () => boolean;
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  session: null,
  error: null,
  login: async () => ({ error: undefined }),
  logout: async () => {},
  signup: async () => ({ error: undefined }),
  isAdmin: () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Authentication provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Check for an existing session on component mount
  useEffect(() => {
    console.log("AuthProvider: Initializing");
    
    const initializeAuth = async () => {
      try {
        console.log("AuthProvider: Checking for existing session");
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          console.log("AuthProvider: Found existing session", session);
          setSession(session);
          setUser(session.user);
        } else {
          console.log("AuthProvider: No existing session found");
          setSession(null);
          setUser(null);
        }
      } catch (err) {
        console.error("AuthProvider: Error checking session", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        console.log("AuthProvider: Initialization complete");
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("AuthProvider: Auth state changed", event, session ? "session exists" : "no session");
        
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    console.log("AuthProvider: Login attempt", email);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("AuthProvider: Login error", error);
        setError(error);
        return { error };
      }

      console.log("AuthProvider: Login successful", data);
      setUser(data.user);
      setSession(data.session);
      
      return {};
    } catch (err) {
      console.error("AuthProvider: Login exception", err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    console.log("AuthProvider: Logout attempt");
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("AuthProvider: Logout error", error);
        setError(error);
      } else {
        console.log("AuthProvider: Logout successful");
        setUser(null);
        setSession(null);
      }
    } catch (err) {
      console.error("AuthProvider: Logout exception", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    console.log("AuthProvider: Signup attempt", email);
    setIsLoading(true);
    
    try {
      // For demo purposes, we're using fake data for user profile
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            role: "user",
          },
        },
      });

      if (error) {
        console.error("AuthProvider: Signup error", error);
        setError(error);
        return { error };
      }

      console.log("AuthProvider: Signup successful", data);
      // In a real app, we would handle email verification here
      setUser(data.user);
      setSession(data.session);
      
      return {};
    } catch (err) {
      console.error("AuthProvider: Signup exception", err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Check if current user is an admin
  const isAdmin = () => {
    return user?.user_metadata.role === "admin";
  };

  // Extract authentication state from session
  const isAuthenticated = !!session;

  // Create the context value
  const contextValue = {
    isAuthenticated,
    isLoading,
    user,
    session,
    error,
    login,
    logout,
    signup,
    isAdmin,
  };

  console.log("AuthProvider: Current state", { 
    isAuthenticated, 
    isLoading,
    hasUser: !!user,
    hasSession: !!session,
    hasError: !!error
  });

  // Render the provider
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
