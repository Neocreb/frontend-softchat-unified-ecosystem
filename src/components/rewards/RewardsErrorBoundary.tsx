import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  RefreshCw,
  Bug,
  Home,
  MessageCircle
} from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

class RewardsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to external service
    console.error('Rewards Error Boundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to analytics/monitoring service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReportBug = () => {
    const subject = encodeURIComponent('Rewards System Error Report');
    const body = encodeURIComponent(`
Error Details:
- Error: ${this.state.error?.message || 'Unknown error'}
- Stack: ${this.state.error?.stack || 'No stack trace'}
- Component: Rewards System
- Retry Count: ${this.state.retryCount}
- User Agent: ${navigator.userAgent}
- Timestamp: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:
`);
    
    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback from props
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Card className="w-full max-w-2xl mx-auto border-red-200 bg-red-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-red-800">
              Oops! Something went wrong
            </CardTitle>
            <p className="text-red-600 text-sm mt-2">
              We encountered an error while loading your rewards data. Don't worry, your data is safe.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Summary */}
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="h-4 w-4 text-red-500" />
                <span className="font-medium text-red-800">Error Details</span>
                <Badge variant="destructive" className="ml-auto">
                  Attempt #{this.state.retryCount + 1}
                </Badge>
              </div>
              <p className="text-sm text-red-700 bg-red-50 p-2 rounded border">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                onClick={this.handleRetry}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                disabled={this.state.retryCount >= 3}
              >
                <RefreshCw className="h-4 w-4" />
                {this.state.retryCount >= 3 ? 'Max Retries Reached' : 'Try Again'}
              </Button>

              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
              >
                <Home className="h-4 w-4" />
                Refresh Page
              </Button>
            </div>

            {/* Help Options */}
            <div className="border-t border-red-200 pt-4">
              <p className="text-sm text-red-600 mb-3">
                If this problem persists, you can:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={this.handleReportBug}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  Report Bug
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('/help', '_blank')}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Support
                </Button>
              </div>
            </div>

            {/* Development Info (only in dev mode) */}
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="bg-gray-100 rounded p-3 text-xs">
                <summary className="cursor-pointer font-medium mb-2">
                  Development Details (Click to expand)
                </summary>
                <pre className="whitespace-pre-wrap overflow-auto max-h-40 text-gray-700">
                  {this.state.error?.stack}
                  {'\n\nComponent Stack:'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default RewardsErrorBoundary;
