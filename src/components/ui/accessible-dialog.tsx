import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

interface AccessibleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  hideTitle?: boolean;
  className?: string;
  contentClassName?: string;
}

export const AccessibleDialog: React.FC<AccessibleDialogProps> = ({
  open,
  onOpenChange,
  children,
  title,
  hideTitle = false,
  className,
  contentClassName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...(className && { className })}>
      <DialogContent className={cn("sm:max-w-[425px]", contentClassName)}>
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
