import React, { Component, ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import SafeContextProvider from "./SafeContextProvider";

// Fallback theme provider that applies light theme without hooks
class FallbackThemeProvider extends Component<{ children: ReactNode }> {
  componentDidMount() {
    this.applyFallbackTheme();
  }

  applyFallbackTheme() {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      try {
        const root = document.documentElement;
        root.classList.add("light");
        root.classList.remove("dark");
      } catch (error) {
        console.warn("Failed to apply fallback theme:", error);
      }
    }
  }

  render() {
    // Apply theme immediately during render as well
    this.applyFallbackTheme();
    return <>{this.props.children}</>;
  }
}

interface SafeThemeProviderProps {
  children: ReactNode;
}

const SafeThemeProvider: React.FC<SafeThemeProviderProps> = ({ children }) => {
  return (
    <SafeContextProvider
      name="Theme"
      fallback={<FallbackThemeProvider>{children}</FallbackThemeProvider>}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </SafeContextProvider>
  );
};

export default SafeThemeProvider;
