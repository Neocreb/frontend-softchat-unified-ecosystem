import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

interface AccessibleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  hideTitle?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Accessible Dialog Component that automatically includes DialogTitle
 * for screen reader accessibility.
 *
 * @param title - The dialog title (required for accessibility)
 * @param hideTitle - Whether to visually hide the title (default: false)
 * @param className - Additional CSS classes for DialogContent
 */
export const AccessibleDialog: React.FC<AccessibleDialogProps> = ({
  open,
  onOpenChange,
  title,
  hideTitle = false,
  children,
  className,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(className)}>
        {hideTitle ? (
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden>
        ) : (
          <DialogTitle>{title}</DialogTitle>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default AccessibleDialog;
