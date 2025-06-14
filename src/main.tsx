import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Ensure React is properly available globally
if (typeof window !== "undefined") {
  (window as any).React = React;
}

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We apologize for the inconvenience. Please refresh the page to try
              again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Get root element with better error handling
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure there is an element with id "root" in your HTML.',
  );
}

// Create root element
const root = createRoot(rootElement);

// Test if React is working before rendering
try {
  console.log("Testing React context availability...");
  const testElement = React.createElement("div", null, "Test");
  if (!testElement) {
    throw new Error("React.createElement not working");
  }

  console.log("React context test passed, rendering app...");

  // Render app with minimal providers first
  root.render(
    <ErrorBoundary>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ErrorBoundary>,
  );
} catch (error) {
  console.error("Critical React error during initialization:", error);

  // Fallback rendering without any providers
  const fallbackElement = document.createElement("div");
  fallbackElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: system-ui;">
      <h1>Application Error</h1>
      <p>There was an error initializing the React application.</p>
      <p>Error: ${error instanceof Error ? error.message : "Unknown error"}</p>
      <button onclick="window.location.reload()">Reload Page</button>
    </div>
  `;

  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = "";
    rootElement.appendChild(fallbackElement);
  }
}
