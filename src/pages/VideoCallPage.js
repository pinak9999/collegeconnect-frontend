import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ❗ सही पाथ
import io from "socket.io-client";
import Peer from "peerjs";
import toast from "react-hot-toast";

// ❗ यह URL आपके ChatPage से मेल खाना चाहिए
const SOCKET_URL = "https://collegeconnect-backend-mrkz.onrender.com";
const socket = io(SOCKET_URL);

// --- स्टाइल्स ---
const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a", // डार्क बैकग्राउंड
    color: "white",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "10px",
  },
  videoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    width: "90%",
    maxWidth: "1200px",
    margin: "20px 0",
  },
  videoContainer: {
    background: "#1e293b",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scaleX(-1)", // मिरर इमेज
  },
  nameTag: {
    padding: "10px",
    background: "linear-gradient(90deg, #7c3aed, #2563eb)",
    textAlign: "center",
    fontWeight: "500",
  },
  controls: {
    display: "flex",
    gap: "15px",
  },
  controlButton: (bgColor) => ({
    padding: "12px 25px",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    background: bgColor,
    color: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    transition: "transform 0.2s",
  }),
};
// --- एंड स्टाइल्स ---

function VideoCallPage() {
  const { sessionId } = useParams(); // यह App.js से bookingId है
  const { auth } = useAuth();
  const [peerName, setPeerName] = useState("Connecting..."); // दूसरे यूज़र का नाम स्टोर करने के लिए
  const [myStream, setMyStream] = useState(null);
  const [peerStream, setPeerStream] = useState(null);

  const myVideoRef = useRef(null);
  const peerVideoRef = useRef(null);
  const peerInstance = useRef(null); // PeerJS ऑब्जेक्ट को स्टोर करने के लिए

  useEffect(() => {
    // 1. यूज़र से कैमरा और माइक का एक्सेस माँगें
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        // 2. PeerJS सर्वर से कनेक्ट करें
        const peer = new Peer(undefined, {
          host: "collegeconnect-peer-server.onrender.com",
          port: 443,
          secure: true,
          path: "/",
        });

        peerInstance.current = peer;

        // 3. जब हम Peer सर्वर से कनेक्ट हो जाएँ (हमें अपनी ID मिल जाए)
        peer.on("open", (myPeerId) => {
          
          // 4. ❗ नया लॉजिक: सीधे "join_video_room" भेजें
          // यह बैकएंड पर रूम जॉइन करेगा और दूसरे यूज़र को सिग्नल भी भेजेगा
          socket.emit("join_video_room", {
            room: sessionId,
            peerId: myPeerId,
            name: auth.user.name, // हम अपना नाम भी भेज रहे हैं
          });
          toast.success("Connected! Waiting for other user...");
        });

        // 5. जब कोई *हमें* कॉल करे (हम कॉल रिसीव कर रहे हैं)
        peer.on("call", (call) => {
          // कॉल के साथ भेजा गया नाम (metadata) पढ़ें
          const remoteUserName = call.metadata?.name || "Peer";
          setPeerName(remoteUserName);
          toast(`Call from ${remoteUserName}!`, { icon: "📞" });

          // कॉल का जवाब अपनी वीडियो स्ट्रीम के साथ दें
          call.answer(stream);

          // जब *उनकी* वीडियो स्ट्रीम आए
          call.on("stream", (remoteStream) => {
            toast.success(`${remoteUserName} connected!`);
            setPeerStream(remoteStream);
            if (peerVideoRef.current) {
              peerVideoRef.current.srcObject = remoteStream;
            }
          });
        });

        // 6. ❗ नया लॉजिक: जब *दूसरा यूज़र* रूम में आए
        socket.on("other_user_for_video", (data) => {
          // data = { peerId: "...", name: "..." }
          const remotePeerId = data.peerId;
          const remoteUserName = data.name;

          setPeerName(remoteUserName);
          toast(`User ${remoteUserName} found! Connecting...`, { icon: "🤝" });

          // दूसरे यूज़र को उनकी Peer ID से कॉल करें
          // हम अपनी स्ट्रीम और अपना नाम (metadata) भी भेज रहे हैं
          const call = peer.call(remotePeerId, stream, {
            metadata: { name: auth.user.name },
          });

          // जब *उनकी* वीडियो स्ट्रीम आए
          call.on("stream", (remoteStream) => {
            toast.success(`${remoteUserName} connected!`);
            setPeerStream(remoteStream);
            if (peerVideoRef.current) {
              peerVideoRef.current.srcObject = remoteStream;
            }
          });
        });

      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
        toast.error("Could not access camera/mic.");
      });

    // 7. क्लीनअप: जब कंपोनेंट बंद हो
    return () => {
      socket.disconnect();
      if (peerInstance.current) {
        peerInstance.current.destroy();
      }
      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]); // myStream को हटा दिया ताकि लूप न हो

  const handleEndCall = () => {
    window.location.href = "/"; // या /student-dashboard
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Video Session: {sessionId}</div>
      <div style={styles.videoGrid}>
        {/* मेरी वीडियो */}
        <div style={styles.videoContainer}>
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            style={styles.video}
          />
          <div style={styles.nameTag}>{auth.user.name} (You)</div>
        </div>

        {/* दूसरे की वीडियो */}
        <div style={styles.videoContainer}>
          {peerStream ? (
            <video
              ref={peerVideoRef}
              autoPlay
              playsInline
              style={styles.video}
            />
          ) : (
            <div
              style={{
                ...styles.video,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "300px", // एक डिफ़ॉल्ट हाइट
                transform: "none",
                background: "#2a3b52",
              }}
            >
              Waiting for other user...
            </div>
          )}
          <div style={styles.nameTag}>
            {peerStream ? peerName : "Connecting..."}
          </div>
        </div>
      </div>
      <div style={styles.controls}>
        <button
          onClick={handleEndCall}
          style={styles.controlButton("linear-gradient(135deg,#ef4444,#dc2626)")}
        >
          📞 End Call
        </button>
      </div>
    </div>
  );
}

export default VideoCallPage;