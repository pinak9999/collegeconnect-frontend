import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import Peer from "peerjs";
import toast from "react-hot-toast";

const SOCKET_URL = "https://collegeconnect-backend-mrkz.onrender.com";
const socket = io(SOCKET_URL, { transports: ["websocket"] });

const styles = {
  container: { minHeight: "100vh", background: "#0f172a", color: "#fff", fontFamily: "'Poppins', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: 16 },
  header: { fontSize: 18, marginTop: 8, marginBottom: 12, fontWeight: 600 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, width: "95%", maxWidth: 1200 },
  card: { background: "#1e293b", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,.35)" },
  video: { width: "100%", height: 360, objectFit: "cover", background: "#0b2038" },
  myMirror: { transform: "scaleX(-1)" },
  tag: { padding: 10, textAlign: "center", background: "linear-gradient(90deg,#7c3aed,#2563eb)", fontWeight: 600 },
  controls: { marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" },
  btn: (bg) => ({ background: bg, border: "none", borderRadius: 10, color: "#fff", padding: "10px 16px", fontWeight: 600, cursor: "pointer" }),
};

export default function VideoCallPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [peerName, setPeerName] = useState("Connecting...");
  const [peerStream, setPeerStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const myVideoRef = useRef(null);
  const peerVideoRef = useRef(null);

  const myStreamRef = useRef(null);
  const peerRef = useRef(null);
  const activeCallRef = useRef(null);
  const isPeerInitialized = useRef(false); // 🔥 REACT STRICT MODE GUARD

  // Local Video Attach
  useEffect(() => {
    if (myVideoRef.current && myStreamRef.current) {
      myVideoRef.current.srcObject = myStreamRef.current;
    }
  }, [myStreamRef.current]);

  // Remote Video Attach
  useEffect(() => {
    if (peerVideoRef.current && peerStream) {
      console.log("🎥 Attaching Remote Stream to Video Element!");
      peerVideoRef.current.srcObject = peerStream;
    }
  }, [peerStream]);

  useEffect(() => {
    if (isPeerInitialized.current) return; // Prevent double execution
    isPeerInitialized.current = true;

    const startCall = async () => {
      try {
        console.log("1️⃣ Requesting Camera/Mic...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        myStreamRef.current = stream;
        
        if (myVideoRef.current) myVideoRef.current.srcObject = stream;
        toast.success("Camera/Mic ready ✅");

        console.log("2️⃣ Initializing PeerJS...");
        const peer = new Peer(undefined, {
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:global.stun.twilio.com:3478" }
            ],
          },
        });
        peerRef.current = peer;

        peer.on("open", (id) => {
          console.log("3️⃣ Peer connected. My ID:", id);
          socket.emit("join_video_room", { room: sessionId, peerId: id, name: auth?.user?.name || "User" });
        });

        // 📞 Jab saamne wala humein call kare (Answer logic)
        peer.on("call", (call) => {
          console.log("4️⃣ Incoming call from Peer!");
          activeCallRef.current = call;
          setPeerName(call.metadata?.name || "Peer connected");
          
          call.answer(myStreamRef.current);
          
          call.on("stream", (remoteStream) => {
            console.log("✅ 5️⃣ Received Remote Stream (as Answerer)");
            setPeerStream(remoteStream);
          });
        });

        // 🚀 Jab socket bataye ki doosra aa gaya hai (Call logic)
        socket.on("other_user_for_video", ({ peerId, name }) => {
          console.log(`4️⃣ Socket says other user joined: ${name}. Calling them...`);
          setPeerName(name || "Peer connected");
          
          const call = peer.call(peerId, myStreamRef.current, {
            metadata: { name: auth?.user?.name || "User" },
          });
          activeCallRef.current = call;

          call.on("stream", (remoteStream) => {
            console.log("✅ 5️⃣ Received Remote Stream (as Caller)");
            setPeerStream(remoteStream);
          });
        });

        socket.on("peer_left", () => {
          toast.error("Peer left the call");
          setPeerStream(null);
          setPeerName("Peer left");
        });

      } catch (err) {
        console.error("Camera access denied!", err);
        toast.error("Please allow camera/mic permissions!");
      }
    };

    startCall();

    return () => {
      socket.off("other_user_for_video");
      socket.off("peer_left");
      if (activeCallRef.current) activeCallRef.current.close();
      if (peerRef.current) peerRef.current.destroy();
      if (myStreamRef.current) myStreamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [sessionId, auth?.user?.name]);

  const toggleMic = () => {
    const track = myStreamRef.current?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; setMicOn(track.enabled); }
  };

  const toggleCam = () => {
    const track = myStreamRef.current?.getVideoTracks()[0];
    if (track) { track.enabled = !track.enabled; setCamOn(track.enabled); }
  };

  const endCall = () => {
    if (activeCallRef.current) activeCallRef.current.close();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Video Session: {sessionId}</div>
      <div style={styles.grid}>
        <div style={styles.card}>
          <video ref={myVideoRef} autoPlay playsInline muted style={{ ...styles.video, ...styles.myMirror }} />
          <div style={styles.tag}>{auth?.user?.name || "You"} (You) {micOn ? "🎙️" : "🔇"} {camOn ? "📷" : "🚫"}</div>
        </div>
        <div style={styles.card}>
          <video ref={peerVideoRef} autoPlay playsInline style={styles.video} />
          <div style={styles.tag}>{peerStream ? peerName : "Connecting..."}</div>
        </div>
      </div>
      <div style={styles.controls}>
        <button onClick={toggleMic} style={styles.btn(micOn ? "#2563eb" : "#475569")}>{micOn ? "🔇 Mute" : "🎙️ Unmute"}</button>
        <button onClick={toggleCam} style={styles.btn(camOn ? "#7c3aed" : "#475569")}>{camOn ? "🚫 Cam Off" : "📷 Cam On"}</button>
        <button onClick={endCall} style={styles.btn("#ef4444")}>📞 End Call</button>
      </div>
    </div>
  );
}