import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import "./ChatWindow.css";

const ChatWindow = ({ userId, userName }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const toggleChat = () => setIsChatOpen((s) => !s);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const saveMessagesToBackend = useCallback(
    async (chatMessages) => {
      if (!userId) {
        console.error("No userId available. Cannot save chat history.");
        return;
      }
      try {
        await axios.post("http://localhost:5000/api/chat/save", {
          userId,
          messages: chatMessages,
        });
      } catch (error) {
        console.error("Error saving chat to backend:", error.response?.data || error.message);
      }
    },
    [userId]
  );

  const sendMessage = async (text) => {
    const clean = text.trim();
    if (!clean) return;

    const userMessage = { sender: "user", text: clean, time: getCurrentTime() };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    await saveMessagesToBackend([userMessage]);

    setTyping(true);
    try {
      const response = await axios.post("http://localhost:5001/chat", { userText: clean });
      const botResponse = {
        sender: "bot",
        text: response?.data?.botResponse || "…",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botResponse]);
      await saveMessagesToBackend([botResponse]);
    } catch (error) {
      console.error("Error fetching AI response:", error.response?.data || error.message);
      const errMsg = {
        sender: "bot",
        text: "Sorry, I couldn't fetch a response. Please try again.",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, errMsg]);
      await saveMessagesToBackend([errMsg]);
    } finally {
      setTyping(false);
    }
  };

  // autosize textarea like ChatGPT
  const autoSize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 160); // cap height
    el.style.height = next + "px";
  };

  useEffect(() => {
    autoSize();
  }, [userInput, isChatOpen]);

  // scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // welcome seed
  useEffect(() => {
    const welcomeMessage = {
      sender: "bot",
      text: `Welcome ${userName || "there"}! How can I assist you?`,
      time: getCurrentTime(),
    };
    setMessages([welcomeMessage]);
    saveMessagesToBackend([welcomeMessage]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(userInput);
    }
  };

  return (
    <div className="cw-floating">
      {/* Floating open button */}
      {!isChatOpen && (
        <button className="cw-fab" onClick={toggleChat} aria-label="Open chat">
          Chat with us
        </button>
      )}

      {/* Minimal panel (no header, only a close “x”) */}
      {isChatOpen && (
        <section className="cw-panel" role="dialog" aria-label="Chat">

          {/* Messages area */}
          <main className="cw-list" aria-live="polite" aria-label="Messages">
            {messages.map((m, i) => {
              const isUser = m.sender === "user";
              return (
                <div key={i} className={`cw-bubble ${isUser ? "user" : "bot"}`}>
                  <div className="cw-text">{m.text}</div>
                  <div className={`cw-time ${isUser ? "r" : "l"}`}>{m.time}</div>
                </div>
              );
            })}

            {typing && (
              <div className="cw-bubble bot typing" aria-label="AI is typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </main>

          {/* Composer – ChatGPT-like textarea (no mic / no +) */}
          <form
            className="cw-composer"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(userInput);
            }}
          >
            <div className="cw-input-wrap">
              <textarea
                ref={textareaRef}
                className="cw-input"
                placeholder="Message AI…"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
              />
               <button
                type="button"
                className="cw-close-inline"
                onClick={toggleChat}
                aria-label="Close chat"
                title="Close"
              >
                ×
              </button>
              <button
                type="submit"
                className="cw-send"
                aria-label="Send message"
                disabled={!userInput.trim()}
                title="Send"
              >
                ➤
              </button>
             
            </div>
            <div className="cw-hint">Press Enter to send • Shift + Enter for a new line</div>
          </form>
        </section>
      )}
    </div>
  );
};

export default ChatWindow;
