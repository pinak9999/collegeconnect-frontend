// src/components/AiChatbot.js
import React, { useState } from "react";
import axios from "axios";
import "./AiChatbot.css";

export default function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://collegeconnect-backend-mrkz.onrender.com/api/ai/chat";

  async function askAi() {
    if (!query.trim()) return;

    const newMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, newMsg]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post(API_URL, { query });
      const botMsg = { sender: "bot", text: res.data.answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error: AI server unavailable." },
      ]);
    }

    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      <div className="chatbot-button" onClick={() => setOpen(!open)}>
        💬
      </div>

      {/* Chatbox */}
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            🤖 REAP AI Assistant
            <span onClick={() => setOpen(false)} className="close-btn">×</span>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {loading && <div className="msg bot">⏳ Thinking...</div>}
          </div>

          <div className="chatbot-input">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about REAP..."
            />
            <button onClick={askAi}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
