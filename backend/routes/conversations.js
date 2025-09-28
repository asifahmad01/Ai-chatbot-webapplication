const express = require("express");
const Conversation = require("../models/Conversation");

const router = express.Router();

// Save user query and chatbot response
router.post("/save", async (req, res) => {
  const { userId, query, response } = req.body;

  try {
    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      conversation = new Conversation({ userId, messages: [] });
    }

    conversation.messages.push({ query, response });
    await conversation.save();

    res.status(200).json({ message: "Conversation saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error saving conversation", details: err.message });
  }
});

// Get user conversations
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const conversation = await Conversation.findOne({ userId }).populate("userId", "name email");
    if (!conversation) return res.status(404).json({ error: "No conversations found" });

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving conversations", details: err.message });
  }
});

module.exports = router;
