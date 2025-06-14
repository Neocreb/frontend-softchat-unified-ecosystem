import express from "express";
import { createServer } from "http";

console.log("Starting TypeScript server...");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple test route
app.get("/", (req, res) => {
  res.send("TypeScript server is working!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

const server = createServer(app);
const port = 5000;

console.log(`Attempting to listen on port ${port}...`);

server.listen(port, "0.0.0.0", () => {
  console.log(`TypeScript server serving on port ${port}`);
});

server.on("error", (err) => {
  console.error(`Server error: ${err.message}`);
});
