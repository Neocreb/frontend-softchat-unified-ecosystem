import React, { Component, ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";

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
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ThemeProvider Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback to default theme without context
      document.documentElement.classList.add("light");

      return <div className="theme-fallback">{this.props.children}</div>;
    }

    try {
      return <ThemeProvider>{this.props.children}</ThemeProvider>;
    } catch (error) {
      console.error("Error rendering ThemeProvider:", error);

      // Fallback rendering without theme context
      document.documentElement.classList.add("light");
      return <div className="theme-fallback">{this.props.children}</div>;
    }
  }
}

export default SafeThemeProvider;
