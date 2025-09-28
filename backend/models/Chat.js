const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  conversations: [
    {
      messages: [
        {
          sender: { type: String, required: true },
          text: { type: String, required: true },
          time: { type: String, required: true }, // Store time in HH:mm format
          timestamp: { type: Date, default: Date.now }, // Store the exact time
        },
      ],
      date: { type: Date, default: Date.now }, // Store the date of the conversation
    },
  ],
});

module.exports = mongoose.model("Chat", ChatSchema);
