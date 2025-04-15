
import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNotification } from "@/hooks/use-notification";
import { ExtendedUser, UserProfile } from "@/types/user";
import { enhanceUserWithProfile, signIn, signUp, signOut, getCurrentSession } from "@/services/authService";
import { fetchUserProfile } from "@/services/profileService";
import { getAdminRoles, AdminRole } from "@/services/adminService";

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
    getCurrentSession().then(async (currentSession) => {
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
      await signIn(email, password);
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
      await signUp(name, email, password);
      
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
      await signOut();
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

  const fetchAdminRoles = async (): Promise<AdminRole[]> => {
    if (!user) return [];
    return getAdminRoles(user.id);
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
        getAdminRoles: fetchAdminRoles,
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
