import React from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

/**
 * Utility component to ensure DialogContent has proper accessibility
 * Use this when you need a hidden DialogTitle for screen readers
 */
export const HiddenDialogTitle: React.FC<{ children: string }> = ({ children }) => (
  <VisuallyHidden>
    <DialogTitle>{children}</DialogTitle>
  </VisuallyHidden>
);

/**
 * Utility component for visible DialogTitle with proper styling
 */
export const VisibleDialogTitle: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <DialogTitle className={`text-lg font-semibold ${className}`}>
    {children}
  </DialogTitle>
);

/**
 * Hook to ensure proper Dialog accessibility
 * Returns the appropriate DialogTitle component based on visibility needs
 */
export const useAccessibleDialogTitle = (title: string, visible: boolean = true) => {
  return visible ? (
    <VisibleDialogTitle>{title}</VisibleDialogTitle>
  ) : (
    <HiddenDialogTitle>{title}</HiddenDialogTitle>
  );
};

export default {
  HiddenDialogTitle,
  VisibleDialogTitle,
  useAccessibleDialogTitle,
};
