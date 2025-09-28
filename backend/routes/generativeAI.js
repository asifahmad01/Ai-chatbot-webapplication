const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const router = express.Router();

// Endpoint to handle user queries and generate responses
router.post("/query", (req, res) => {
  const userQuery = req.body.query;

  if (!userQuery) {
    return res.status(400).json({ error: "Query is required" });
  }

  // Execute Python script and pass the query
  const scriptPath = path.join(__dirname, "../generative_ai/respo.py");
  const command = `python3 ${scriptPath} "${userQuery}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Error executing Python script:", error);
      return res.status(500).json({ error: "Failed to process query" });
    }

    if (stderr) {
      console.error("Python script error:", stderr);
      return res.status(500).json({ error: "Error in AI response generation" });
    }

    // Send the Python script output as the response
    res.json({ response: stdout.trim() });
  });
});

module.exports = router;
