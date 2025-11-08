import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

  useEffect(() => {
    socket.emit("join_room", bookingId);

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    const loadChatHistory = async () => {
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

        const foundBooking = bookingRes.data.find((b) => b._id === bookingId);
        if (foundBooking) setBookingInfo(foundBooking);
        else toast.error("Could not find booking info.");

        setLoading(false);
      } catch {
        toast.error("Failed to load chat history.");
        setLoading(false);
      }
    };

    loadChatHistory();
    return () => socket.off("receive_message");
  }, [bookingId, auth.user.isSenior]);

  useEffect(() => {
    if (chatBodyRef.current)
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = (e) => {
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
    setMessages((prev) => [...prev, { ...msgData, sender: { id: auth.user.id, name: auth.user.name } }]);
    setNewMessage("");
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "#2563eb" }}>
        <h2>Loading Chat...</h2>
      </div>
    );

  const getChatHeader = () => {
    if (!bookingInfo) return "Chat Room";
    if (auth.user.id === (bookingInfo.student._id || bookingInfo.student))
      return `Chat with ${bookingInfo.senior.name}`;
    return `Chat with ${bookingInfo.student.name}`;
  };

  // 💫 Inline Styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #3b82f6, #1e3a8a, #0f172a)",
      fontFamily: "'Poppins', sans-serif",
      padding: "10px",
    },
    chatWindow: {
      width: "100%",
      maxWidth: "750px",
      height: "85vh",
      background: "rgba(255,255,255,0.15)",
      borderRadius: "20px",
      backdropFilter: "blur(15px)",
      boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      color: "#fff",
      animation: "fadeIn 0.6s ease",
    },
    header: {
      background: "linear-gradient(90deg, #2563eb, #1e40af)",
      padding: "18px 20px",
      fontSize: "1.2rem",
      fontWeight: 600,
      color: "#fff",
      textAlign: "center",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    },
    chatBody: {
      flex: 1,
      overflowY: "auto",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    message: (isSent) => ({
      alignSelf: isSent ? "flex-end" : "flex-start",
      background: isSent
        ? "linear-gradient(135deg, #2563eb, #1e40af)"
        : "rgba(255,255,255,0.1)",
      padding: "10px 14px",
      borderRadius: isSent
        ? "15px 15px 0 15px"
        : "15px 15px 15px 0",
      maxWidth: "70%",
      wordWrap: "break-word",
      fontSize: "0.95rem",
      color: "#fff",
      boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
      transition: "0.3s",
    }),
    senderName: {
      fontSize: "0.75rem",
      fontWeight: 600,
      color: "#a5b4fc",
      marginBottom: "4px",
    },
    footer: {
      padding: "15px",
      background: "rgba(255,255,255,0.1)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderTop: "1px solid rgba(255,255,255,0.2)",
    },
    input: {
      flex: 1,
      background: "rgba(255,255,255,0.2)",
      border: "none",
      borderRadius: "10px",
      padding: "10px 14px",
      fontSize: "1rem",
      color: "#fff",
      outline: "none",
      transition: "0.3s",
    },
    sendButton: {
      background: "linear-gradient(135deg, #22c55e, #16a34a)",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "10px 18px",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "1rem",
      transition: "0.3s",
      boxShadow: "0 4px 10px rgba(22,163,74,0.3)",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        <div style={styles.header}>{getChatHeader()}</div>
        <div style={styles.chatBody} ref={chatBodyRef}>
          {messages.map((msg, index) => {
            const isSent = msg.sender._id === auth.user.id || msg.sender.id === auth.user.id;
            return (
              <div key={index} style={styles.message(isSent)}>
                {!isSent && <div style={styles.senderName}>{msg.sender.name}</div>}
                {msg.text}
              </div>
            );
          })}
        </div>
        <form style={styles.footer} onSubmit={handleSendMessage}>
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
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 6px 15px rgba(22,163,74,0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 10px rgba(22,163,74,0.3)";
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
