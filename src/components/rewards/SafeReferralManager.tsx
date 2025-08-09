import React, { ErrorBoundary } from "react";
import { UserPlus } from "lucide-react";
import ReferralManager from "@/components/activity-economy/ReferralManager";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="text-center py-12">
    <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Referral System</h3>
    <p className="text-gray-600 mb-4">
      The referral system encountered an error. Please try refreshing the page.
    </p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-softchat-primary text-white rounded-md hover:bg-softchat-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const SafeReferralManager: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error("ReferralManager Error:", error, errorInfo);
      }}
    >
      <ReferralManager />
    </ErrorBoundary>
  );
};

export default SafeReferralManager;
