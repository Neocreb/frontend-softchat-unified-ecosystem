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

    return <ThemeProvider>{this.props.children}</ThemeProvider>;
  }
}

export default SafeThemeProvider;
