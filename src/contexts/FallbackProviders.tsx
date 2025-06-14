import React from "react";

// Fallback theme provider that uses direct DOM manipulation instead of React context
export const FallbackThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log("FallbackThemeProvider: Starting");

  // Set up theme without React hooks
  React.useLayoutEffect(() => {
    try {
      console.log("FallbackThemeProvider: Setting up theme");
      // Set default theme
      document.documentElement.classList.add("light");

      // Try to get saved theme
      if (typeof window !== "undefined" && window.localStorage) {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
          document.documentElement.classList.remove("light");
          document.documentElement.classList.add("dark");
        }
      }
    } catch (error) {
      console.error("FallbackThemeProvider error:", error);
      // Ensure we at least have a theme set
      document.documentElement.classList.add("light");
    }
  }, []);

  return <>{children}</>;
};

// Fallback auth provider that provides minimal context
export const FallbackAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log("FallbackAuthProvider: Starting");

  return <>{children}</>;
};
