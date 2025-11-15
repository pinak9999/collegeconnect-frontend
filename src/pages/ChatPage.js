import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom"; // ❗ Link import किया गया
import { useAuth } from "../context/AuthContext"; // ❗ आपका सही path
import io from "socket.io-client";
import toast from "react-hot-toast";

const API_URL = "https://collegeconnect-backend-mrkz.onrender.com";
const SOCKET_URL = "https://collegeconnect-backend-mrkz.onrender.com";
const socket = io(SOCKET_URL);

function ChatPage() {
  const { bookingId } = useParams();
  const { auth } = useAuth();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [bookingInfo, setBookingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const chatBodyRef = useRef(null);

  // 🔹 Load chat + connect socket
  useEffect(() => {
    socket.emit("join_room", bookingId);
    socket.on("receive_message", (msg) => setMessages((prev) => [...prev, msg]));

    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/chat/${bookingId}`, {
          headers: { "x-auth-token": token },
        });
        setMessages(res.data);

        const bookingUrl = auth.user.isSenior
          ? `${API_URL}/api/bookings/senior/my`
          : `${API_URL}/api/bookings/student/my`;

        const bookingRes = await axios.get(bookingUrl, {
          headers: { "x-auth-token": token },
        });

        const found = bookingRes.data.find((b) => b._id === bookingId);
        if (found) setBookingInfo(found);
        else toast.error("Could not find booking info.");
      } catch {
        toast.error("Failed to load chat.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => socket.off("receive_message");
  }, [bookingId, auth.user.isSenior]);

  useEffect(() => {
    if (chatBodyRef.current)
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !bookingInfo) return;

    const receiverId =
      auth.user.id === (bookingInfo.student._id || bookingInfo.student)
        ? bookingInfo.senior._id || bookingInfo.senior
        : bookingInfo.student._id || bookingInfo.student;

    const msgData = {
      booking: bookingId,
      sender: auth.user.id,
      receiver: receiverId,
      text: newMessage,
    };

    socket.emit("send_message", msgData);
    setMessages((prev) => [
      ...prev,
      { ...msgData, sender: { id: auth.user.id, name: auth.user.name } },
    ]);
    setNewMessage("");
  };

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg,#0f172a,#1e293b,#020617)",
          color: "#60a5fa",
          fontFamily: "Poppins,sans-serif",
          fontSize: "1.2rem",
        }}
      >
        💬 Connecting to chat...
      </div>
    );

  const getHeader = () => {
    if (!bookingInfo) return "Chat Room";
    if (auth.user.id === (bookingInfo.student._id || bookingInfo.student))
      return `Chat with ${bookingInfo.senior.name}`;
    return `Chat with ${bookingInfo.student.name}`;
  };

  // 🎨 Premium Multi-Color Styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background:
        "linear-gradient(135deg,#020617,#111827 40%,#1e293b 70%,#334155)",
      fontFamily: "'Poppins', sans-serif",
      padding: "10px",
    },
    chatWindow: {
      width: "100%",
      maxWidth: "820px",
      height: "88vh",
      background: "rgba(255,255,255,0.08)",
      borderRadius: "22px",
      backdropFilter: "blur(18px)",
      boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      color: "#fff",
    },
    header: {
      background:
        "linear-gradient(90deg, #7c3aed, #2563eb, #06b6d4)",
      padding: "18px",
      fontSize: "1.2rem",
      fontWeight: 600,
      letterSpacing: "0.5px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      // --- ❗ बदलाव ---
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      // --- ❗ एंड ---
    },
    // --- ❗ नया स्टाइल ---
    joinButton: {
      background: "linear-gradient(135deg,#10b981,#059669)",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "8px 14px",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.9rem",
      textDecoration: "none",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      boxShadow: "0 4px 10px rgba(16,185,129,0.4)",
    },
    // --- ❗ एंड ---
    chatBody: {
      flex: 1,
      overflowY: "auto",
      padding: "18px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      scrollbarWidth: "thin",
    },
    message: (isSent) => ({
      alignSelf: isSent ? "flex-end" : "flex-start",
      background: isSent
        ? "linear-gradient(135deg,#0ea5e9,#06b6d4,#14b8a6)"
        : "linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,192,203,0.15))",
      padding: "12px 16px",
      borderRadius: isSent
        ? "18px 18px 0 18px"
        : "18px 18px 18px 0",
      maxWidth: "70%",
      wordWrap: "break-word",
      fontSize: "0.95rem",
      color: "#f1f5f9",
      boxShadow: isSent
        ? "0 4px 10px rgba(14,165,233,0.4)"
        : "0 3px 10px rgba(255,192,203,0.2)",
      transition: "transform 0.25s ease",
    }),
    senderName: {
      fontSize: "0.75rem",
      fontWeight: 600,
      color: "#a5b4fc",
      marginBottom: "4px",
    },
    footer: {
      padding: "15px",
      background: "rgba(255,255,255,0.07)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderTop: "1px solid rgba(255,255,255,0.15)",
    },
    input: {
      flex: 1,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "12px",
      padding: "10px 14px",
      fontSize: "1rem",
      color: "#fff",
      outline: "none",
    },
    sendButton: {
      background:
        "linear-gradient(135deg,#22c55e,#16a34a,#059669)",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "10px 18px",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "1.1rem",
      transition: "0.3s ease",
      boxShadow: "0 5px 14px rgba(34,197,94,0.4)",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        {/* --- ❗ बदलाव --- */}
        <div style={styles.header}>
          <span>{getHeader()}</span>
          <Link
            to={`/session/${bookingId}`}
            style={styles.joinButton}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 6px 14px rgba(16,185,129,0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 10px rgba(16,185,129,0.4)";
            }}
          >
            📞 Join Call
          </Link>
        </div>
        {/* --- ❗ एंड --- */}

        <div style={styles.chatBody} ref={chatBodyRef}>
          {messages.map((msg, index) => {
            const isSent =
              msg.sender._id === auth.user.id || msg.sender.id === auth.user.id;
            return (
              <div
                key={index}
                style={styles.message(isSent)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {!isSent && <div style={styles.senderName}>{msg.sender.name}</div>}
                {msg.text}
              </div>
            );
          })}
        </div>

        <form style={styles.footer} onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={styles.input}
          />
          <button
            type="submit"
            style={styles.sendButton}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.1)";
              e.target.style.boxShadow =
                "0 6px 18px rgba(34,197,94,0.55)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow =
                "0 5px 14px rgba(34,197,94,0.4)";
            }}
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;