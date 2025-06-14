import express from "express";

console.log("Starting ES module server...");

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("ES module server is working!");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`ES module server listening at http://localhost:${port}`);
});
