
// Extend the Badge variant types

declare module "@/components/ui/badge" {
  interface BadgeVariants {
    variant:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "success"  // new: for success states
      | "warning"; // new: for warning states
  }
}
