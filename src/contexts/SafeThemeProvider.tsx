import React, { Component, ReactNode, type ErrorInfo, createContext, useContext } from "react";
import { ThemeProvider } from "./ThemeContext";

// Minimal theme context for fallback
interface FallbackThemeContextType {
  theme: "light";
  setTheme: () => void;
  isDark: false;
}

const FallbackThemeContext = createContext<FallbackThemeContextType>({
  theme: "light",
  setTheme: () => console.warn("Theme switching disabled in fallback mode"),
  isDark: false,
});

// Hook for fallback theme context
export const useFallbackTheme = () => useContext(FallbackThemeContext);

// Fallback theme context that provides minimal theme functionality
const FallbackThemeProvider = ({ children }: { children: ReactNode }) => {
  // Apply fallback theme to DOM immediately on render
  React.useLayoutEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      try {
        const root = document.documentElement;
        root.classList.add("light");
        root.classList.remove("dark");
        // Ensure CSS custom properties are applied
        root.style.setProperty('--background', '210 20% 98%');
        root.style.setProperty('--foreground', '222.2 84% 4.9%');
        root.style.setProperty('--card', '0 0% 100%');
        root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
        root.style.setProperty('--primary', '265 100% 58%');
        root.style.setProperty('--primary-foreground', '210 40% 98%');
        root.style.setProperty('--softchat-primary', '265 100% 58%');
        root.style.setProperty('--softchat-accent', '297 83% 72%');
        root.style.setProperty('--softchat-600', '265 89% 48%');
        root.style.setProperty('--softchat-700', '265 100% 40%');
      } catch (error) {
        console.warn("Failed to apply fallback theme:", error);
      }
    }
  }, []);

  const fallbackContextValue: FallbackThemeContextType = {
    theme: "light",
    setTheme: () => console.warn("Theme switching disabled in fallback mode"),
    isDark: false,
  };

  return (
    <FallbackThemeContext.Provider value={fallbackContextValue}>
      {children}
    </FallbackThemeContext.Provider>
  );
};

interface SafeThemeProviderState {
  hasError: boolean;
  error?: Error;
}

interface SafeThemeProviderProps {
  children: ReactNode;
}

class SafeThemeProvider extends Component<
  SafeThemeProviderProps,
  SafeThemeProviderState
> {
  constructor(props: SafeThemeProviderProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SafeThemeProviderState {
    console.error("ThemeProvider Error caught:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ThemeProvider Error:", error, errorInfo);

    // Apply fallback light theme immediately
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      try {
        const root = document.documentElement;
        root.classList.add("light");
        root.classList.remove("dark");
      } catch (themeError) {
        console.warn(
          "Failed to apply fallback theme in error handler:",
          themeError,
        );
      }
    }
  }

  render() {
    if (this.state.hasError) {
      console.warn(
        "Using fallback theme provider due to error:",
        this.state.error,
      );
      return (
        <FallbackThemeProvider>{this.props.children}</FallbackThemeProvider>
      );
    }

    try {
      return <ThemeProvider>{this.props.children}</ThemeProvider>;
    } catch (error) {
      console.error("Error in ThemeProvider render:", error);
      return (
        <FallbackThemeProvider>{this.props.children}</FallbackThemeProvider>
      );
    }
  }
}

export default SafeThemeProvider;
