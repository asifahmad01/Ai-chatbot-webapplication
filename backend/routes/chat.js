const express = require("express");
const mongoose = require("mongoose");
const Chat = require("../models/Chat");

const router = express.Router();

router.post("/save", async (req, res) => {
  const { userId, messages } = req.body;

  console.log("Received userId:", userId);
  console.log("Received messages:", messages);

  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Find the user's chat history
    let chat = await Chat.findOne({ userId });

    // If chat doesn't exist, create a new document
    if (!chat) {
      chat = new Chat({
        userId,
        conversations: [
          {
            messages: messages,
            date: new Date(),
          },
        ],
      });
    } else {
      // Append new messages to the latest conversation of the day
      const today = new Date().toISOString().split("T")[0];
      const existingConversation = chat.conversations.find(
        (conv) => conv.date.toISOString().split("T")[0] === today
      );

      if (existingConversation) {
        existingConversation.messages.push(...messages);
      } else {
        // Create a new conversation for a new day
        chat.conversations.push({
          messages: messages,
          date: new Date(),
        });
      }
    }

    // Save the updated chat
    await chat.save();
    res.status(200).json({ message: "Chat history saved successfully." });
  } catch (error) {
    console.error("Error saving chat history:", error.message);
    res.status(500).json({ error: "Failed to save chat history." });
  }
});

module.exports = router;
