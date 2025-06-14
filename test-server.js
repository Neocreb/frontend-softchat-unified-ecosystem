const express = require("express");
const app = express();
const port = 5001; // Use a different port to avoid conflicts

console.log("Starting simple test server...");

app.get("/", (req, res) => {
  res.send("Test server is working!");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Test server listening at http://localhost:${port}`);
});
