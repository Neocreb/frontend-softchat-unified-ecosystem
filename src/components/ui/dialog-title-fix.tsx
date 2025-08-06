import React from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

/**
 * Quick fix component for DialogTitle accessibility
 * Use this when you need to quickly add a hidden DialogTitle to any DialogContent
 */
export const DialogTitleFix: React.FC<{ title?: string }> = ({ 
  title = "Dialog" 
}) => (
  <VisuallyHidden>
    <DialogTitle>{title}</DialogTitle>
  </VisuallyHidden>
);

/**
 * Visible DialogTitle with proper styling
 */
export const StyledDialogTitle: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <DialogTitle className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </DialogTitle>
);

export default DialogTitleFix;
