import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import Peer from "peerjs";
import toast from "react-hot-toast";

// ⚠️ Global socket
const SOCKET_URL = "https://collegeconnect-backend-mrkz.onrender.com";
const socket = io(SOCKET_URL, { transports: ["websocket"] });

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
  },
  header: { fontSize: 18, marginTop: 8, marginBottom: 12, fontWeight: 600 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 16,
    width: "95%",
    maxWidth: 1200,
  },
  card: {
    background: "#1e293b",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,.35)",
  },
  video: {
    width: "100%",
    height: 360,
    objectFit: "cover",
    background: "#0b2038",
  },
  myMirror: { transform: "scaleX(-1)" },
  tag: {
    padding: 10,
    textAlign: "center",
    background: "linear-gradient(90deg,#7c3aed,#2563eb)",
    fontWeight: 600,
  },
  controls: { marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" },
  btn: (bg) => ({
    background: bg,
    border: "none",
    borderRadius: 10,
    color: "#fff",
    padding: "10px 16px",
    fontWeight: 600,
    cursor: "pointer",
  }),
};

export default function VideoCallPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [peerName, setPeerName] = useState("Connecting...");
  const [peerStream, setPeerStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [remoteMuted, setRemoteMuted] = useState(true);

  const myVideoRef = useRef(null);
  const peerVideoRef = useRef(null);

  const myStreamRef = useRef(null);
  const peerRef = useRef(null);
  const activeCallRef = useRef(null);

  // Apna local video dikhane ke liye
  useEffect(() => {
    if (myVideoRef.current && myStreamRef.current) {
      myVideoRef.current.srcObject = myStreamRef.current;
      myVideoRef.current.play().catch((e) => console.error("Local play error:", e));
    }
  }, [myStreamRef.current]);

  // Dusre ka video dikhane ke liye
  useEffect(() => {
    if (peerVideoRef.current && peerStream) {
      peerVideoRef.current.srcObject = peerStream;
      peerVideoRef.current.play().catch((e) => console.error("Remote play error:", e));
    }
  }, [peerStream]);

  useEffect(() => {
    let isCleanedUp = false;

    const initializeMediaAndPeer = async () => {
      try {
        // 1. Camera aur Mic ki permission lo
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (isCleanedUp) return;
        
        myStreamRef.current = localStream;
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = localStream;
          myVideoRef.current.play().catch(() => {});
        }
        toast.success("Camera/Mic ready ✅");

        // 2. PeerJS Setup (Fixed Configuration)
        // Humne purane fake servers hata diye hain aur PeerJS ka default stable server use kar rahe hain
        const peer = new Peer(undefined, {
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:global.stun.twilio.com:3478" }
            ],
          },
        });
        
        peerRef.current = peer;

        // 3. Jab Peer ready ho jaye, Socket room join karo
        peer.on("open", (id) => {
          if (isCleanedUp) return;
          console.log("My Peer ID is:", id);
          socket.emit("join_video_room", {
            room: sessionId,
            peerId: id,
            name: auth?.user?.name || "User",
          });
        });

        // 4. Jab koi doosra humein Call kare (Aane wali call uthana)
        peer.on("call", (call) => {
          console.log("Incoming call from:", call.peer);
          if (activeCallRef.current) activeCallRef.current.close();
          
          activeCallRef.current = call;
          setPeerName(call.metadata?.name || "Peer connected");
          
          call.answer(myStreamRef.current); // Apna stream bhej kar answer kiya
          
          call.on("stream", (remoteStream) => {
            console.log("Received remote stream");
            setPeerStream(remoteStream);
          });

          call.on("close", () => {
            setPeerStream(null);
            setPeerName("Peer left");
          });
        });

        // 5. Socket se pata chale ki doosra aa gaya hai, toh usko Call karo
        socket.on("other_user_for_video", ({ peerId, name }) => {
          if (!peerRef.current || !myStreamRef.current || isCleanedUp) return;
          console.log("Other user joined, calling them:", peerId);
          
          setPeerName(name || "Peer connected");
          
          if (activeCallRef.current) activeCallRef.current.close();
          
          const call = peerRef.current.call(peerId, myStreamRef.current, {
            metadata: { name: auth?.user?.name || "User" },
          });
          
          activeCallRef.current = call;

          call.on("stream", (remoteStream) => {
            console.log("Received remote stream (outgoing call)");
            setPeerStream(remoteStream);
          });

          call.on("close", () => {
            setPeerStream(null);
            setPeerName("Peer left");
          });
        });

        socket.on("peer_left", () => {
          console.log("Peer disconnected from socket");
          if (activeCallRef.current) activeCallRef.current.close();
          setPeerStream(null);
          setPeerName("Peer left");
        });

      } catch (err) {
        console.error("Media error:", err);
        toast.error("Could not access camera/mic. Please allow permissions.");
      }
    };

    initializeMediaAndPeer();

    // Cleanup logic
    return () => {
      isCleanedUp = true;
      socket.off("other_user_for_video");
      socket.off("peer_left");
      if (activeCallRef.current) activeCallRef.current.close();
      if (peerRef.current) peerRef.current.destroy();
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [sessionId, auth?.user?.name]);

  const toggleMic = () => {
    const audioTrack = myStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const toggleCam = () => {
    const videoTrack = myStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCamOn(videoTrack.enabled);
    }
  };

  const endCall = () => {
    if (activeCallRef.current) activeCallRef.current.close();
    socket.emit("leave_video_room", { room: sessionId }); // Optional emit
    navigate("/"); // Redirecting to home/dashboard
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Video Session: {sessionId}</div>

      <div style={styles.grid}>
        {/* Local Video */}
        <div style={styles.card}>
          <video ref={myVideoRef} autoPlay playsInline muted style={{ ...styles.video, ...styles.myMirror }} />
          <div style={styles.tag}>
            {auth?.user?.name || "You"} (You) {micOn ? "🎙️" : "🔇"} {camOn ? "📷" : "🚫"}
          </div>
        </div>

        {/* Remote Video */}
        <div style={styles.card}>
          <video ref={peerVideoRef} autoPlay playsInline muted={remoteMuted} style={styles.video} />
          <div style={styles.tag}>{peerStream ? peerName : "Connecting..."}</div>
        </div>
      </div>

      <div style={styles.controls}>
        <button onClick={toggleMic} style={styles.btn(micOn ? "#2563eb" : "#475569")}>
          {micOn ? "🔇 Mute" : "🎙️ Unmute"}
        </button>
        <button onClick={toggleCam} style={styles.btn(camOn ? "#7c3aed" : "#475569")}>
          {camOn ? "🚫 Cam Off" : "📷 Cam On"}
        </button>
        {remoteMuted && peerStream && (
          <button onClick={() => setRemoteMuted(false)} style={styles.btn("#10b981")}>
            🔊 Hear Audio
          </button>
        )}
        <button onClick={endCall} style={styles.btn("#ef4444")}>
          📞 End Call
        </button>
      </div>
    </div>
  );
}