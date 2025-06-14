import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

(async () => {
  try {
    console.log("Starting TypeScript server...");

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Register API routes
    registerRoutes(app);

    const server = createServer(app);

    // Setup Vite in development
    if (app.get("env") === "development") {
      console.log("Setting up Vite...");
      try {
        await setupVite(app, server);
        console.log("Vite setup completed");
      } catch (error) {
        console.error(
          "Vite setup failed:",
          error instanceof Error ? error.message : "Unknown error",
        );
        // Continue without Vite if it fails
      }
    } else {
      serveStatic(app);
    }

    const port = 5000;
    console.log(`Attempting to listen on port ${port}...`);

    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });

    server.on("error", (err) => {
      log(`Server error: ${err.message}`);
    });
  } catch (error) {
    console.error(
      "Server startup error:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
})();
