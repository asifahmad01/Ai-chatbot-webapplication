const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const userRoutes = require("./routes/users"); // User routes
const chatRoutes = require("./routes/chat");  // Chat routes
const generativeAIRoutes = require("./routes/generativeAI");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Routes
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/chat", chatRoutes);  // Chat-related routes
app.use("/api/ai", generativeAIRoutes);

// Catch-All Error Handling
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
