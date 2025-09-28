import React from "react";
import "./QuickReplies.css";

const QuickReplies = ({ onSend }) => {
  const replies = ["Hi", "Help me", "What can you do?"];

  if (!onSend) {
    console.error("onSend prop is missing in QuickReplies");
    return null; // Render nothing if onSend is missing
  }

  return (
    <div className="quick-replies">
      {replies.map((reply, index) => (
        <button key={index} onClick={() => onSend(reply)}>
          {reply}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
