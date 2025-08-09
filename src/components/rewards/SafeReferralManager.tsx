import React, { Component, ReactNode } from "react";
import { UserPlus } from "lucide-react";
import ReferralManager from "@/components/activity-economy/ReferralManager";
import SafeReferralComponent from "@/components/rewards/SafeReferralComponent";

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
      // If the main ReferralManager has errors, show the safe fallback component
      return <SafeReferralComponent />;
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
