
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNotification } from "@/hooks/use-notification";
import { ExtendedUser, UserProfile } from "@/types/user";

interface AdminRole {
  role: 'super_admin' | 'content_admin' | 'user_admin' | 'marketplace_admin' | 'crypto_admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ExtendedUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  getAdminRoles: () => Promise<AdminRole[]>;
  getUserProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const { toast } = useToast();
  const notify = useNotification();

  // Function to fetch user profile from the profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return profile as UserProfile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  // Helper function to get points and level for the user
  const getUserPointsAndLevel = async (userId: string) => {
    try {
      const { data: rewardPoints, error: pointsError } = await supabase.rpc('get_user_points', { user_uuid: userId });
      
      if (pointsError) {
        console.error("Error fetching user points:", pointsError);
        return { points: 0, level: 'bronze' };
      }

      // Get tier thresholds
      const { data: tierSettings, error: settingsError } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'loyalty_tiers')
        .single();

      if (settingsError) {
        console.error("Error fetching tier settings:", settingsError);
        return { points: rewardPoints || 0, level: 'bronze' };
      }

      const tiers = tierSettings.value as Record<string, number>;
      
      // Determine user level based on points
      let level = 'bronze';
      if (rewardPoints >= tiers.platinum) {
        level = 'platinum';
      } else if (rewardPoints >= tiers.gold) {
        level = 'gold';
      } else if (rewardPoints >= tiers.silver) {
        level = 'silver';
      }

      return { points: rewardPoints || 0, level };
    } catch (error) {
      console.error("Error in getUserPointsAndLevel:", error);
      return { points: 0, level: 'bronze' };
    }
  };

  // Function to enhance the user object with profile data
  const enhanceUserWithProfile = async (supabaseUser: User | null): Promise<ExtendedUser | null> => {
    if (!supabaseUser) return null;

    try {
      const profile = await fetchUserProfile(supabaseUser.id);
      const { points, level } = await getUserPointsAndLevel(supabaseUser.id);

      const enhancedUser: ExtendedUser = {
        ...supabaseUser,
        profile,
        // Add convenience properties
        name: profile?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        avatar: profile?.avatar_url || '/placeholder.svg',
        points,
        level
      };

      return enhancedUser;
    } catch (error) {
      console.error("Error enhancing user:", error);
      return supabaseUser as ExtendedUser;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        // Use setTimeout to avoid potential deadlock with Supabase auth
        if (newSession?.user) {
          setTimeout(async () => {
            const enhancedUser = await enhanceUserWithProfile(newSession.user);
            setUser(enhancedUser);
          }, 0);
        } else {
          setUser(null);
        }
        
        if (event === 'SIGNED_IN') {
          notify.success('Signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          notify.info('Signed out successfully');
        }
      }
    );

    // Check for existing session
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

    return () => {
      subscription.unsubscribe();
    };
  }, [notify]);

  const getUserProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    return fetchUserProfile(user.id);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      // Auth state listener will handle session update
    } catch (error: any) {
      notify.error('Login failed', {
        description: error.message || 'Please check your email and password',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      notify.success('Registration successful', {
        description: 'Welcome to Softchat!',
      });
      
      // Auth state listener will handle session update
    } catch (error: any) {
      notify.error('Registration failed', {
        description: error.message || 'Please try again',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Auth state listener will handle session update
    } catch (error: any) {
      notify.error('Logout failed', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = () => {
    return !!user; // For now, all logged in users are admins until we implement admin role check
  };

  const getAdminRoles = async (): Promise<AdminRole[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('role')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      return data as AdminRole[];
    } catch (error) {
      console.error('Error fetching admin roles:', error);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        session,
        login,
        register,
        logout,
        isAdmin,
        getAdminRoles,
        getUserProfile,
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
