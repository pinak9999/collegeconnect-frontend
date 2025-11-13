// src/components/AiChatbot.js
import React, { useState } from "react";
import axios from "axios";
import "./AiChatbot.css";

export default function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // API का URL
  const API_URL = "https://collegeconnect-backend-mrkz.onrender.com/api/ai/chat";

  async function askAi() {
    if (!query.trim()) return;

    const newMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, newMsg]);
    setQuery("");
    setLoading(true);

    try {
      // ✅ फिक्स 1: सर्वर को 'message' भेजा (पहले 'query' था)
      const res = await axios.post(API_URL, { message: query });
      
      // ✅ फिक्स 2: सर्वर से 'reply' पढ़ा (पहले 'answer' था)
      const botMsg = { sender: "bot", text: res.data.reply };
      
      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {
      // अगर एरर आए तो यह दिखाएँ
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error: AI server unavailable." },
      ]);
    }

    setLoading(false);
  }

  // --- यह बाकी का JSX कोड है (इसमें कोई बदलाव नहीं) ---

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
              onKeyPress={(e) => e.key === 'Enter' && askAi()} // Bonus: Enter दबाने पर भी भेजें
            />
            <button onClick={askAi}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}