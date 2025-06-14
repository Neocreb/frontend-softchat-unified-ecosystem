import React from "react";

// Simple wrapper for React context providers
export function withSafeContext<T extends { children: React.ReactNode }>(
  Component: React.ComponentType<T>,
  fallbackComponent?: React.ComponentType<T>,
) {
  return function SafeWrapper(props: T) {
    try {
      return <Component {...props} />;
    } catch (error) {
      console.error("Context provider error:", error);
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent;
        return <FallbackComponent {...props} />;
      }
      return <>{props.children}</>;
    }
  };
}

// Safe theme provider that falls back to direct DOM manipulation
export const SafeThemeProviderComponent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">(
    "light",
  );

  React.useEffect(() => {
    // Set default theme
    document.documentElement.classList.add("light");

    // Try to load saved theme
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = localStorage.getItem("theme");
        if (saved && ["light", "dark", "system"].includes(saved)) {
          setTheme(saved as any);
          document.documentElement.classList.remove("light", "dark");
          if (saved === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.add("light");
          }
        }
      }
    } catch (error) {
      console.warn("Could not load theme from localStorage:", error);
    }
  }, []);

  return <>{children}</>;
};

// Safe auth provider that provides basic auth state
export const SafeAuthProviderComponent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

// Create safe versions using the wrapper
export const SafeThemeProvider = withSafeContext(
  SafeThemeProviderComponent,
  ({ children }) => {
    // Fallback - just set light theme
    React.useLayoutEffect(() => {
      document.documentElement.classList.add("light");
    }, []);
    return <>{children}</>;
  },
);

export const SafeAuthProvider = withSafeContext(
  SafeAuthProviderComponent,
  ({ children }) => <>{children}</>,
);
