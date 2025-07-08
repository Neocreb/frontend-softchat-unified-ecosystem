import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

(async () => {
  try {
    log("Starting server...");

    const app = express();

    // CORS middleware for development
    const isDevelopment = process.env.NODE_ENV !== "production";
    if (isDevelopment) {
      log("Setting up CORS for development environment");
      app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS",
        );
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        );
        if (req.method === "OPTIONS") {
          res.sendStatus(200);
        } else {
          next();
        }
      });
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Register API routes
    registerRoutes(app);

    const server = createServer(app);

    // Add error handling middleware
    app.use(
      (
        err: any,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
        log(`Error: ${message}`, "error");
      },
    );

    // Setup Vite in development
    if (app.get("env") === "development") {
      log("Setting up Vite in development mode...");
      try {
        await setupVite(app, server);
        log("Vite setup completed");
      } catch (error) {
        log(
          `Vite setup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          "error",
        );
        // Continue without Vite if it fails
      }
    } else {
      log("Setting up static serving for production...");
      serveStatic(app);
    }

    const port = 5000;
    log(`Attempting to listen on port ${port}...`);

    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });

    server.on("error", (err) => {
      log(`Server error: ${err.message}`, "error");
    });
  } catch (error) {
    log(
      `Server startup error: ${error instanceof Error ? error.message : "Unknown error"}`,
      "error",
    );
    log(
      `Stack trace: ${error instanceof Error ? error.stack : "No stack trace"}`,
      "error",
    );
  }
})();
