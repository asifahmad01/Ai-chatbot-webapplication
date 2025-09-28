import React from "react";
import "./QuickReplies.css";

const QuickReplies = ({ onSend }) => {
  const replies = [
    { text: "👋 Hi there!", icon: "👋" },
    { text: "❓ Help me", icon: "❓" },
    { text: "🤖 What can you do?", icon: "🤖" },
    { text: "💡 Give me ideas", icon: "💡" }
  ];

  if (!onSend) {
    console.error("onSend prop is missing in QuickReplies");
    return null; // Render nothing if onSend is missing
  }

  return (
    <div className="quick-replies">
      <div className="quick-replies-header">
        <span className="quick-replies-title">Quick Replies</span>
      </div>
      <div className="quick-replies-grid">
        {replies.map((reply, index) => (
          <button 
            key={index} 
            className="quick-reply-btn"
            onClick={() => onSend(reply.text)}
          >
            <span className="reply-icon">{reply.icon}</span>
            <span className="reply-text">{reply.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;
