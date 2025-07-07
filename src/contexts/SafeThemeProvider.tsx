import React, {
  Component,
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
} from "react";
import { ThemeProvider } from "./ThemeContext";

// Fallback theme context for error cases
const FallbackThemeContext = createContext({
  theme: "light" as const,
  setTheme: () => {},
  isDark: false,
});

const FallbackThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme] = React.useState<"light" | "dark" | "system">("light");
  const [isDark] = React.useState(false);

  // Apply fallback theme to DOM
  React.useEffect(() => {
    try {
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        const root = document.documentElement;
        root.classList.add("light");
        root.classList.remove("dark");

        // Ensure CSS variables are set for light theme
        root.style.setProperty("--background", "0 0% 100%");
        root.style.setProperty("--foreground", "222.2 84% 4.9%");
      }
    } catch (error) {
      console.warn("Failed to apply fallback theme:", error);
    }
  }, []);

  const contextValue = {
    theme,
    setTheme: (newTheme: "light" | "dark" | "system") => {
      console.warn(
        "Theme switching disabled in fallback mode. Attempted to set:",
        newTheme,
      );
    },
    isDark,
  };

  return (
    <FallbackThemeContext.Provider value={contextValue}>
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ThemeProvider Error:", error, errorInfo);
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

    return <ThemeProvider>{this.props.children}</ThemeProvider>;
  }
}

export default SafeThemeProvider;
