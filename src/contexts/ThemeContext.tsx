import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
  useMemo,
  type FC,
} from "react";

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
    console.error("useTheme called without ThemeProvider context");
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme state with safer initialization
  const [theme, setTheme] = useState<Theme>("light"); // Default to light instead of system
  const [isDark, setIsDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const savedTheme = localStorage.getItem("theme") as Theme;
        if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
          setTheme(savedTheme);
        } else {
          // Default to light theme if no saved theme
          setTheme("light");
        }
      }
      setIsInitialized(true);
    } catch (error) {
      console.warn("Failed to read theme from localStorage:", error);
      setTheme("light"); // Fallback to light theme
      setIsInitialized(true);
    }
  }, []);

  // Determine if dark mode is active
  useEffect(() => {
    const updateDarkMode = () => {
      try {
        let isDarkMode = false;

        if (theme === "dark") {
          isDarkMode = true;
        } else if (theme === "light") {
          isDarkMode = false;
        } else {
          // System theme - check OS preference
          if (typeof window !== "undefined" && window.matchMedia) {
            isDarkMode = window.matchMedia(
              "(prefers-color-scheme: dark)",
            ).matches;
          }
        }

        setIsDark(isDarkMode);

        // Update DOM
        if (typeof document !== "undefined") {
          const root = document.documentElement;
          if (isDarkMode) {
            root.classList.add("dark");
            root.classList.remove("light");
          } else {
            root.classList.add("light");
            root.classList.remove("dark");
          }
        }
      } catch (error) {
        console.warn("Failed to update dark mode:", error);
      }
    };

    updateDarkMode();

    // Listen for system theme changes if using system theme
    if (
      theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia
    ) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => updateDarkMode();

      try {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } catch (error) {
        // Fallback for older browsers
        try {
          mediaQuery.addListener(handleChange);
          return () => mediaQuery.removeListener(handleChange);
        } catch (fallbackError) {
          console.warn("Failed to listen for theme changes:", fallbackError);
        }
      }
    }
  }, [theme]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("theme", theme);
      }
    } catch (error) {
      console.warn("Failed to save theme to localStorage:", error);
    }
  }, [theme]);

  const contextValue: ThemeContextType = useMemo(
    () => ({
      theme,
      setTheme,
      isDark,
    }),
    [theme, isDark],
  );

  // Don't render children until theme is initialized to prevent context issues
  if (!isInitialized) {
    return <div className="theme-loading">{children}</div>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
