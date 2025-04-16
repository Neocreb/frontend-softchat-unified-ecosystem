
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/hooks/use-notification";
import { ExtendedUser, UserProfile } from "@/types/user";
import { fetchUserProfile, getUserPointsAndLevel } from "@/services/profileService";

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  isAdmin: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const notify = useNotification();

  // Load session and user data on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Get session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        setSession(sessionData.session);
        
        if (sessionData.session?.user) {
          await loadUserData(sessionData.session.user);
        } else {
          setIsLoading(false);
        }
        
        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          setSession(newSession);
          
          // Handle user sign in/out
          if (event === 'SIGNED_IN' && newSession?.user) {
            await loadUserData(newSession.user);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        });
        
        // Cleanup listener on unmount
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
      }
    };
    
    fetchSession();
  }, []);
  
  // Load user profile data
  const loadUserData = async (authUser: User) => {
    setIsLoading(true);
    try {
      // Get user profile from database
      const profile = await fetchUserProfile(authUser.id);
      
      // Get user points and level
      const { points, level } = await getUserPointsAndLevel(authUser.id);
      
      // Combine auth user with profile data
      const extendedUser: ExtendedUser = {
        ...authUser,
        profile,
        name: profile?.full_name || authUser.email?.split('@')[0] || 'User',
        avatar: profile?.avatar_url,
        points,
        level,
        role: profile?.role || 'user',
      };
      
      setUser(extendedUser);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      notify.success("Login successful", {
        description: "Welcome back!",
      });
      
      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      notify.error("Login failed", {
        description: error.message || "Please check your credentials and try again",
      });
      throw error;
    }
  };
  
  // Register with email and password
  const register = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      notify.success("Registration successful", {
        description: "Please check your email to confirm your account",
      });
      
      return data;
    } catch (error: any) {
      console.error('Registration error:', error);
      notify.error("Registration failed", {
        description: error.message || "Please try again with different credentials",
      });
      throw error;
    }
  };
  
  // Logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      notify.success("Logged out", {
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      notify.error("Logout failed", {
        description: error.message || "Please try again",
      });
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error("No user is logged in");
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local user state with new profile data
      if (data) {
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            profile: { ...prev.profile, ...data },
            name: data.full_name || prev.name,
            avatar: data.avatar_url || prev.avatar,
          };
        });
      }
      
      notify.success("Profile updated", {
        description: "Your profile has been updated successfully",
      });
      
      return data;
    } catch (error: any) {
      console.error('Profile update error:', error);
      notify.error("Profile update failed", {
        description: error.message || "Please try again",
      });
      throw error;
    }
  };
  
  // Check if current user is an admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
