
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { ExtendedUser, UserProfile } from "@/types/user";

// Define types for our context
type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ExtendedUser | null;
  session: Session | null;
  error: Error | null;
  login: (email: string, password: string) => Promise<{ error?: Error }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: Error }>;
  isAdmin: () => boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
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
  updateProfile: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Authentication provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Define state hooks inside the component function body
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Transform user data to include convenience properties
  const enhanceUserData = (rawUser: User | null): ExtendedUser | null => {
    if (!rawUser) return null;
    
    return {
      ...rawUser,
      name: rawUser.user_metadata?.name || rawUser.user_metadata?.full_name || 'User',
      avatar: rawUser.user_metadata?.avatar || rawUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUser.user_metadata?.name || 'User')}&background=random`,
      points: rawUser.user_metadata?.points || 0,
      level: rawUser.user_metadata?.level || 'bronze',
      role: rawUser.user_metadata?.role || 'user',
      profile: {
        id: rawUser.id,
        username: rawUser.user_metadata?.username,
        full_name: rawUser.user_metadata?.name || rawUser.user_metadata?.full_name,
        avatar_url: rawUser.user_metadata?.avatar || rawUser.user_metadata?.avatar_url,
        bio: rawUser.user_metadata?.bio,
        points: rawUser.user_metadata?.points || 0,
        level: rawUser.user_metadata?.level || 'bronze',
        role: rawUser.user_metadata?.role || 'user',
        is_verified: rawUser.user_metadata?.is_verified || false,
        bank_account_name: rawUser.user_metadata?.bank_account_name,
        bank_account_number: rawUser.user_metadata?.bank_account_number,
        bank_name: rawUser.user_metadata?.bank_name,
      }
    };
  };
  
  // Check for an existing session on component mount
  useEffect(() => {
    console.log("AuthProvider: Initializing");
    
    const initializeAuth = async () => {
      try {
        console.log("AuthProvider: Checking for existing session");
        
        // Get the current session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (currentSession) {
          console.log("AuthProvider: Found existing session", currentSession);
          setSession(currentSession);
          setUser(enhanceUserData(currentSession.user));
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
      async (event, newSession) => {
        console.log("AuthProvider: Auth state changed", event, newSession ? "session exists" : "no session");
        
        setSession(newSession);
        setUser(enhanceUserData(newSession?.user || null));
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
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        console.error("AuthProvider: Login error", loginError);
        setError(loginError);
        return { error: loginError };
      }

      console.log("AuthProvider: Login successful", data);
      setUser(enhanceUserData(data.user));
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
      const { error: logoutError } = await supabase.auth.signOut();
      
      if (logoutError) {
        console.error("AuthProvider: Logout error", logoutError);
        setError(logoutError);
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
      const { data, error: signupError } = await supabase.auth.signUp({
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

      if (signupError) {
        console.error("AuthProvider: Signup error", signupError);
        setError(signupError);
        return { error: signupError };
      }

      console.log("AuthProvider: Signup successful", data);
      // In a real app, we would handle email verification here
      setUser(enhanceUserData(data.user));
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

  // Update user profile function
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) {
      throw new Error("No user logged in");
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: profileData
      });
      
      if (error) {
        throw error;
      }
      
      // Update local user state with new profile data
      setUser(prev => {
        if (!prev) return null;
        
        // Create a new user object with updated metadata and profile
        const updatedUser: ExtendedUser = {
          ...prev,
          user_metadata: {
            ...prev.user_metadata,
            ...profileData
          },
          name: profileData.full_name || prev.name,
          avatar: profileData.avatar_url || prev.avatar,
          points: profileData.points || prev.points,
          level: profileData.level || prev.level,
          role: profileData.role || prev.role,
          // Ensure the profile property maintains its required fields
          profile: {
            ...prev.profile!,
            ...profileData,
            // Explicitly ensure id is not overwritten
            id: prev.profile?.id || prev.id
          }
        };
        
        return updatedUser;
      });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Check if current user is an admin
  const isAdmin = () => {
    return user?.role === "admin" || user?.user_metadata?.role === "admin";
  };

  // Extract authentication state from session
  const isAuthenticated = !!session;

  // Create the context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    session,
    error,
    login,
    logout,
    signup,
    isAdmin,
    updateProfile,
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
