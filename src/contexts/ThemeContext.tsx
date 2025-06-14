import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme state with fallback
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      // Get saved theme from localStorage or default to system
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme") as Theme;
        return savedTheme || "system";
      }
      return "system";
    } catch {
      return "system";
    }
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    if (theme === "system") {
      // Use system preference
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDark(systemDark);
      root.classList.add(systemDark ? "dark" : "light");
    } else {
      // Use user preference
      setIsDark(theme === "dark");
      root.classList.add(theme);
    }

    // Save to localStorage
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Handle localStorage errors gracefully
      console.warn("Could not save theme to localStorage");
    }
  }, [theme]);

  // Listen for system theme changes when using system preference
  useEffect(() => {
    if (typeof window === "undefined" || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      isDark,
    }),
    [theme, isDark],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
