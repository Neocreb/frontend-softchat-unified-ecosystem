import React, { Component, ReactNode } from "react";
import { UserPlus } from "lucide-react";
import ReferralManager from "@/components/activity-economy/ReferralManager";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ReferralErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ReferralManager Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12">
          <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Referral System</h3>
          <p className="text-gray-600 mb-4">
            The referral system encountered an error. Please try refreshing the page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-softchat-primary text-white rounded-md hover:bg-softchat-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const SafeReferralManager: React.FC = () => {
  return (
    <ReferralErrorBoundary>
      <ReferralManager />
    </ReferralErrorBoundary>
  );
};

export default SafeReferralManager;
