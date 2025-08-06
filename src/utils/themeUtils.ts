// Comprehensive theme utilities for consistent dark mode support
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme-aware class builders
export const themeClasses = {
  // Surface classes
  surface: "bg-card text-card-foreground",
  surfaceVariant: "bg-platform-surface-variant text-platform-foreground",
  background: "bg-background text-foreground",
  
  // Interactive elements
  interactive: "transition-colors duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  
  // Buttons
  buttonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
  buttonSecondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary",
  buttonDestructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
  buttonOutline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  buttonGhost: "hover:bg-accent hover:text-accent-foreground",
  
  // Cards and containers
  card: "bg-card text-card-foreground border border-border rounded-lg shadow-sm",
  cardCompact: "bg-card text-card-foreground border border-border rounded-md shadow-sm p-4",
  cardLarge: "bg-card text-card-foreground border border-border rounded-lg shadow-md p-6",
  
  // Navigation
  navItem: "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
  navActive: "bg-accent text-accent-foreground",
  
  // Forms
  input: "bg-background border-input border rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  select: "bg-background border-input border rounded-md px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  textarea: "bg-background border-input border rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  
  // Social interactions
  socialLike: "text-social-like hover:bg-social-like/10",
  socialComment: "text-social-comment hover:bg-social-comment/10",
  socialShare: "text-social-share hover:bg-social-share/10",
  socialBookmark: "text-social-bookmark hover:bg-social-bookmark/10",
  
  // Status indicators
  statusSuccess: "text-status-success bg-status-success/10 border-status-success/20",
  statusWarning: "text-status-warning bg-status-warning/10 border-status-warning/20",
  statusInfo: "text-status-info bg-status-info/10 border-status-info/20",
  statusError: "text-destructive bg-destructive/10 border-destructive/20",
  
  // Text variants
  textPrimary: "text-foreground",
  textSecondary: "text-muted-foreground",
  textMuted: "text-muted-foreground",
  textSubtle: "text-muted-foreground/70",
  
  // Borders
  border: "border-border",
  borderSubtle: "border-border/50",
  
  // Shadows
  shadowSm: "shadow-sm",
  shadowMd: "shadow-md",
  shadowLg: "shadow-lg",
} as const;

// Theme-aware component builders
export function buildThemeComponent(baseClasses: string, themeClass: keyof typeof themeClasses, additionalClasses?: string) {
  return cn(baseClasses, themeClasses[themeClass], additionalClasses);
}

// Specialized component class builders
export const themeComponents = {
  // Post/Feed components
  postCard: () => cn(themeClasses.card, "p-6 space-y-4"),
  postHeader: () => cn("flex items-center space-x-3"),
  postContent: () => cn(themeClasses.textPrimary, "space-y-3"),
  postActions: () => cn("flex items-center justify-between pt-4 border-t", themeClasses.border),
  postActionButton: () => cn("flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium", themeClasses.interactive),
  
  // Navigation components
  header: () => cn(themeClasses.surface, "border-b", themeClasses.border, "sticky top-0 z-50"),
  sidebar: () => cn("bg-sidebar text-sidebar-foreground border-r border-sidebar-border"),
  navMenu: () => cn(themeClasses.surface, "border", themeClasses.border, "rounded-md shadow-md"),
  
  // Modal/Dialog components
  modal: () => cn(themeClasses.surface, "border", themeClasses.border, "rounded-lg shadow-lg"),
  modalHeader: () => cn("flex items-center justify-between p-6 border-b", themeClasses.border),
  modalContent: () => cn("p-6"),
  modalFooter: () => cn("flex items-center justify-end space-x-2 p-6 border-t", themeClasses.border),
  
  // Form components
  formGroup: () => cn("space-y-2"),
  formLabel: () => cn("text-sm font-medium", themeClasses.textPrimary),
  formInput: () => cn(themeClasses.input),
  formError: () => cn("text-sm", themeClasses.statusError),
  formHelp: () => cn("text-sm", themeClasses.textMuted),
  
  // Button variants
  buttonPrimary: (size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base'
    };
    return cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      themeClasses.buttonPrimary,
      sizes[size]
    );
  },
  
  buttonSecondary: (size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base'
    };
    return cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      themeClasses.buttonSecondary,
      sizes[size]
    );
  },
  
  // Table components
  table: () => cn("w-full border-collapse"),
  tableHeader: () => cn(themeClasses.surfaceVariant, "border-b", themeClasses.border),
  tableRow: () => cn("border-b", themeClasses.border, "hover:bg-muted/50"),
  tableCell: () => cn("p-4", themeClasses.textPrimary),
  
  // List components
  list: () => cn("space-y-1"),
  listItem: () => cn("flex items-center space-x-3 p-3 rounded-md", themeClasses.interactive),
  listItemActive: () => cn("bg-accent text-accent-foreground"),
  
  // Badge/Tag components
  badge: () => cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"),
  badgePrimary: () => cn(themeComponents.badge(), "bg-primary text-primary-foreground"),
  badgeSecondary: () => cn(themeComponents.badge(), "bg-secondary text-secondary-foreground"),
  badgeOutline: () => cn(themeComponents.badge(), "border", themeClasses.border, themeClasses.background),
  
  // Dropdown/Menu components
  dropdown: () => cn(themeClasses.surface, "border", themeClasses.border, "rounded-md shadow-md min-w-[8rem]"),
  dropdownItem: () => cn("flex items-center px-3 py-2 text-sm cursor-pointer", themeClasses.interactive),
  dropdownSeparator: () => cn("h-px bg-border my-1"),
};

// Dark mode detection utilities
export function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

// Theme-aware color utilities
export function getThemeAwareColor(lightColor: string, darkColor: string): string {
  return isDarkMode() ? darkColor : lightColor;
}

// CSS variable helpers
export function getCSSVariable(variable: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
}

// HSL color utilities for theme colors
export function getThemeColor(colorVar: string): string {
  return `hsl(var(--${colorVar}))`;
}

export function getThemeColorWithOpacity(colorVar: string, opacity: number): string {
  return `hsl(var(--${colorVar}) / ${opacity})`;
}

// Responsive theme utilities
export function getResponsiveThemeClasses(mobile: string, desktop?: string): string {
  if (!desktop) return mobile;
  return cn(mobile, `md:${desktop}`);
}

// Animation utilities with theme awareness
export const themeAnimations = {
  fadeIn: "animate-in fade-in-0 duration-200",
  slideIn: "animate-in slide-in-from-bottom-4 duration-200",
  scaleIn: "animate-in zoom-in-95 duration-200",
  popIn: "animate-in zoom-in-95 slide-in-from-bottom-2 duration-200",
};

// Focus ring utilities
export function getFocusRingClasses(color?: string): string {
  const ringColor = color ? `focus-visible:ring-${color}` : 'focus-visible:ring-ring';
  return cn(
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    ringColor
  );
}

export default {
  themeClasses,
  themeComponents,
  buildThemeComponent,
  cn,
  isDarkMode,
  getThemeAwareColor,
  getCSSVariable,
  getThemeColor,
  getThemeColorWithOpacity,
  getResponsiveThemeClasses,
  themeAnimations,
  getFocusRingClasses,
};
