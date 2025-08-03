import React, { Component, ReactNode, type ErrorInfo } from "react";

interface SafeContextProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface SafeContextProviderState {
  hasError: boolean;
  error?: Error;
}

class SafeContextProvider extends Component<
  SafeContextProviderProps,
  SafeContextProviderState
> {
  constructor(props: SafeContextProviderProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SafeContextProviderState {
    console.error("Context Provider Error caught:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `${this.props.name || "Context"} Provider Error:`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      console.warn(
        `Using fallback for ${this.props.name || "context"} provider due to error:`,
        this.state.error
      );
      
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback - just render children without context
      return <>{this.props.children}</>;
    }

    return this.props.children;
  }
}

export default SafeContextProvider;
