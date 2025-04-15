
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNotification } from "@/hooks/use-notification";

interface AdminRole {
  role: 'super_admin' | 'content_admin' | 'user_admin' | 'marketplace_admin' | 'crypto_admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  getAdminRoles: () => Promise<AdminRole[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const notify = useNotification();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          notify.success('Signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          notify.info('Signed out successfully');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [notify]);

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
