import {
  createContext,
  useContext,
  useState,
  useEffect,
  type FC,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase/client";
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
  signup: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ error?: Error }>;
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
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Define state hooks with safer initialization
  const [user, setUser] = React.useState<ExtendedUser | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Transform user data to include convenience properties
  const enhanceUserData = React.useCallback(
    (rawUser: User | null): ExtendedUser | null => {
      if (!rawUser) return null;

      try {
        return {
          ...rawUser,
          name:
            rawUser.user_metadata?.name ||
            rawUser.user_metadata?.full_name ||
            "User",
          username: rawUser.user_metadata?.username || "unknown",
          avatar:
            rawUser.user_metadata?.avatar ||
            rawUser.user_metadata?.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUser.user_metadata?.name || "User")}&background=random`,
          points: rawUser.user_metadata?.points || 0,
          level: rawUser.user_metadata?.level || "bronze",
          role: rawUser.user_metadata?.role || "user",
          profile: {
            id: rawUser.id,
            username: rawUser.user_metadata?.username,
            full_name:
              rawUser.user_metadata?.name || rawUser.user_metadata?.full_name,
            avatar_url:
              rawUser.user_metadata?.avatar ||
              rawUser.user_metadata?.avatar_url,
            bio: rawUser.user_metadata?.bio,
            points: rawUser.user_metadata?.points || 0,
            level: rawUser.user_metadata?.level || "bronze",
            role: rawUser.user_metadata?.role || "user",
            is_verified: rawUser.user_metadata?.is_verified || false,
            bank_account_name: rawUser.user_metadata?.bank_account_name,
            bank_account_number: rawUser.user_metadata?.bank_account_number,
            bank_name: rawUser.user_metadata?.bank_name,
          },
        };
      } catch (error) {
        console.warn("Failed to enhance user data:", error);
        return {
          ...rawUser,
          name: "User",
          username: "unknown",
          avatar: `https://ui-avatars.com/api/?name=User&background=random`,
          points: 0,
          level: "bronze",
          role: "user",
          profile: {
            id: rawUser.id,
            username: "unknown",
            full_name: "User",
            avatar_url: null,
            bio: null,
            points: 0,
            level: "bronze",
            role: "user",
            is_verified: false,
            bank_account_name: null,
            bank_account_number: null,
            bank_name: null,
          },
        };
      }
    },
    [],
  );

  // Check for an existing session on component mount
  React.useEffect(() => {
    console.log("AuthProvider: Initializing");

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get initial session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setError(sessionError);
        } else {
          setSession(session);
          setUser(enhanceUserData(session?.user || null));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);

      try {
        setSession(session);
        setUser(enhanceUserData(session?.user || null));
        setError(null);
      } catch (error) {
        console.error("Auth state change error:", error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [enhanceUserData]);

  // Login function
  const login = React.useCallback(
    async (email: string, password: string): Promise<{ error?: Error }> => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error);
          return { error };
        }

        console.log("Login successful:", data.user?.id);
        return {};
      } catch (error) {
        const authError = error as Error;
        setError(authError);
        return { error: authError };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Logout function
  const logout = React.useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        setError(error);
      } else {
        setUser(null);
        setSession(null);
        console.log("Logout successful");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Signup function
  const signup = React.useCallback(
    async (
      email: string,
      password: string,
      name: string,
    ): Promise<{ error?: Error }> => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              full_name: name,
              username: email.split("@")[0],
            },
          },
        });

        if (error) {
          setError(error);
          return { error };
        }

        console.log("Signup successful:", data.user?.id);
        return {};
      } catch (error) {
        const authError = error as Error;
        setError(authError);
        return { error: authError };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Check if user is admin
  const isAdmin = React.useCallback((): boolean => {
    return user?.role === "admin" || user?.profile?.role === "admin";
  }, [user]);

  // Update user profile
  const updateProfile = React.useCallback(
    async (data: Partial<UserProfile>): Promise<void> => {
      try {
        if (!user) {
          throw new Error("No user logged in");
        }

        const { error } = await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            ...data,
          },
        });

        if (error) {
          throw error;
        }

        // Update local user state
        setUser((prev) =>
          prev
            ? {
                ...prev,
                ...data,
                profile: {
                  ...prev.profile,
                  ...data,
                },
              }
            : null,
        );
      } catch (error) {
        console.error("Profile update error:", error);
        throw error;
      }
    },
    [user],
  );

  const contextValue: AuthContextType = React.useMemo(
    () => ({
      isAuthenticated: !!session && !!user,
      isLoading,
      user,
      session,
      error,
      login,
      logout,
      signup,
      isAdmin,
      updateProfile,
    }),
    [
      session,
      user,
      isLoading,
      error,
      login,
      logout,
      signup,
      isAdmin,
      updateProfile,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
