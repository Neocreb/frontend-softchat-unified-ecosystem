
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { enhanceUserWithProfile, signIn, signOut, signUp, updateUserProfileData } from "@/services/authService";
import { ExtendedUser, UserProfile } from "@/types/user";

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: ExtendedUser | null;
  session: Session | null;
  setUser: (user: ExtendedUser | null) => void;
  setError: (error: string | null) => void;
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    user: null,
    session: null,
    setUser: () => {},
    setError: () => {},
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const enhancedUser = await enhanceUserWithProfile(session.user);
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            user: enhancedUser,
            session,
            isLoading: false,
          }));
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setAuthState(prev => ({
          ...prev,
          error: "Failed to fetch session",
          isLoading: false,
        }));
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const enhancedUser = await enhanceUserWithProfile(session.user);
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: enhancedUser,
          session,
        }));
      } else if (event === 'SIGNED_OUT') {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          session: null,
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setUser = (user: ExtendedUser | null) => {
    setAuthState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
    }));
  };

  const setError = (error: string | null) => {
    setAuthState(prev => ({
      ...prev,
      error,
    }));
  };

  // Update profile function
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!authState.user) {
      throw new Error("User not authenticated");
    }
    
    try {
      const updatedProfile = await updateUserProfileData(authState.user.id, profileData);
      
      if (updatedProfile) {
        const enhancedUser = { 
          ...authState.user,
          profile: updatedProfile,
          name: updatedProfile.full_name || authState.user.name,
          avatar: updatedProfile.avatar_url || authState.user.avatar,
        };
        
        setUser(enhancedUser);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const data = await signIn(email, password);
      // Auth state will be updated by the onAuthStateChange listener
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message || "Failed to sign in",
        isLoading: false,
      }));
      throw error;
    }
  };

  const logout = async () => {
    setAuthState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      await signOut();
      // Auth state will be updated by the onAuthStateChange listener
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message || "Failed to sign out",
        isLoading: false,
      }));
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setAuthState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      await signUp(name, email, password);
      // After registration, we'll either be signed in automatically or need to verify email
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message || "Failed to register",
        isLoading: false,
      }));
      throw error;
    }
  };

  const isAdmin = () => {
    return authState.user?.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        setUser,
        setError,
        login,
        logout,
        register,
        updateProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
