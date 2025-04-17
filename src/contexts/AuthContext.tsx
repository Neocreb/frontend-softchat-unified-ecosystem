
import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserProfile, ExtendedUser } from "@/types/user";
import { enhanceUserWithProfile, updateUserProfileData } from "@/services/authService";

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, name?: string) => Promise<{ error: any, user: any }>;
  logout: () => void;
  isAdmin: () => boolean;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<UserProfile | null>;
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<{ error: any, user: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST (to prevent missing auth events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (newSession?.user) {
          const enhancedUser = await enhanceUserWithProfile(newSession.user);
          setUser(enhancedUser);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        const enhancedUser = await enhanceUserWithProfile(currentSession.user);
        setUser(enhancedUser);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
      }
      
      return { error };
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred during login");
      return { error };
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        setError(error.message);
      }
      
      return { error, user: data.user };
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "An error occurred during signup");
      return { error, user: null };
    }
  };

  // Alias for signup to be used in EnhancedAuthForm
  const register = async (name: string, email: string, password: string) => {
    return signup(email, password, name);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = () => {
    return user?.email?.endsWith("@admin.com") || user?.role === 'admin' || false;
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return null;
    
    try {
      const updatedProfile = await updateUserProfileData(user.id, profileData);
      
      // Update the user state with the new profile data
      if (updatedProfile) {
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            profile: {
              ...prev.profile,
              ...updatedProfile
            },
            // Update convenience properties
            name: updatedProfile.full_name || prev.name,
            avatar: updatedProfile.avatar_url || prev.avatar,
            role: updatedProfile.role || prev.role,
          };
        });
      }
      
      return updatedProfile;
    } catch (error: any) {
      console.error("Update profile error:", error);
      setError(error.message || "An error occurred updating profile");
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        isAdmin,
        updateProfile,
        error,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
