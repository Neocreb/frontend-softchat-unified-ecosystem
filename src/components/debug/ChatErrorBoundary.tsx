import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
  onGoBack?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ChatErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chat Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Chat Application Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  Something went wrong while loading the chat. Here are the details:
                </p>
                
                {this.state.error && (
                  <div className="bg-muted p-3 rounded-lg mb-4">
                    <p className="font-medium">Error:</p>
                    <p className="text-destructive">{this.state.error.message}</p>
                  </div>
                )}

                {this.state.errorInfo?.componentStack && (
                  <details className="bg-muted p-3 rounded-lg mb-4">
                    <summary className="font-medium cursor-pointer">Component Stack</summary>
                    <pre className="text-xs mt-2 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}

                {this.state.error?.stack && (
                  <details className="bg-muted p-3 rounded-lg">
                    <summary className="font-medium cursor-pointer">Error Stack</summary>
                    <pre className="text-xs mt-2 whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                {this.props.onGoBack && (
                  <Button variant="outline" onClick={this.props.onGoBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
