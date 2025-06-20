import React, { Suspense } from "react";
import ErrorBoundary from "@/components/ui/error-boundary";

interface SafeI18nWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SafeI18nWrapper: React.FC<SafeI18nWrapperProps> = ({
  children,
  fallback,
}) => {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="text-xs text-muted-foreground">
            Language settings loading...
          </div>
        )
      }
    >
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default SafeI18nWrapper;
