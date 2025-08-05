import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

interface AccessibleDialogWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  description?: string;
  hideTitle?: boolean;
  hideDescription?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  trigger?: React.ReactNode;
}

/**
 * A wrapper component that ensures proper DialogTitle accessibility
 * Automatically handles VisuallyHidden for titles when hideTitle is true
 */
export const AccessibleDialogWrapper: React.FC<AccessibleDialogWrapperProps> = ({
  open,
  onOpenChange,
  children,
  title,
  description,
  hideTitle = false,
  hideDescription = false,
  className,
  contentClassName,
  headerClassName,
  trigger,
}) => {
  const DialogTitleComponent = hideTitle ? (
    <VisuallyHidden>
      <DialogTitle>{title}</DialogTitle>
    </VisuallyHidden>
  ) : (
    <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
  );

  const DialogDescriptionComponent = description ? (
    hideDescription ? (
      <VisuallyHidden>
        <DialogDescription>{description}</DialogDescription>
      </VisuallyHidden>
    ) : (
      <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </DialogDescription>
    )
  ) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...(className && { className })}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn("sm:max-w-[425px]", contentClassName)}>
        <DialogHeader className={headerClassName}>
          {DialogTitleComponent}
          {DialogDescriptionComponent}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

/**
 * Hook to ensure DialogTitle is always present for accessibility
 * Use this in components that manually construct dialogs
 */
export const useAccessibleDialog = (title: string, hideTitle: boolean = false) => {
  const getDialogTitle = () => {
    return hideTitle ? (
      <VisuallyHidden>
        <DialogTitle>{title}</DialogTitle>
      </VisuallyHidden>
    ) : (
      <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
    );
  };

  return { getDialogTitle };
};

export default AccessibleDialogWrapper;
