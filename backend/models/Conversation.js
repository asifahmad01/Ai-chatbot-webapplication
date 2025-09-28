const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User schema
  messages: [
    {
      query: { type: String, required: true },
      response: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Conversation", ConversationSchema);
