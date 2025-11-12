import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import Peer from "peerjs";
import toast from "react-hot-toast";

const SOCKET_URL = "https://collegeconnect-backend-mrkz.onrender.com";
const socket = io(SOCKET_URL, { transports: ["websocket"] });

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
  },
  videoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
    width: "90%",
    maxWidth: "1200px",
    marginTop: "20px",
  },
  videoContainer: {
    background: "#1e293b",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  video: {
    width: "100%",
    height: "320px",
    objectFit: "cover",
    background: "#000",
  },
  nameTag: {
    padding: "10px",
    background: "linear-gradient(90deg,#7c3aed,#2563eb)",
    textAlign: "center",
  },
};

export default function VideoCallPage() {
  const { sessionId } = useParams();
  const { auth } = useAuth();

  const [peerStream, setPeerStream] = useState(null);
  const [peerName, setPeerName] = useState("Connecting...");
  const myVideoRef = useRef(null);
  const peerVideoRef = useRef(null);
  const peerRef = useRef(null);
  const myStreamRef = useRef(null);
  const activeCallRef = useRef(null);

  useEffect(() => {
    let cleanup = () => {};

    (async () => {
      console.log("🟢 [STEP 1] Requesting Camera/Mic access...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      myStreamRef.current = stream;
      if (myVideoRef.current) myVideoRef.current.srcObject = stream;
      toast.success("Camera/Mic access granted ✅");
      console.log("🎥 [LOCAL STREAM READY]", stream);

      console.log("🟢 [STEP 2] Connecting to PeerJS server...");
      const peer = new Peer(undefined, {
        host: "0.peerjs.com",
        port: 443,
        secure: true,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "turn:relay1.expressturn.com:3478", username: "expressturn", credential: "password" },
          ],
        },
      });
      peerRef.current = peer;

      peer.on("open", (id) => {
        console.log("🟢 [STEP 3] PeerJS Connected ✅ | My ID:", id);
        toast.success("PeerJS connected ✅");

        // 🔹 Emit join request to backend
        socket.emit("join_video_room", {
          room: sessionId,
          peerId: id,
          name: auth.user.name,
        });
        console.log("📡 [EMIT] join_video_room =>", { room: sessionId, id });
      });

      // 📡 When someone calls me
      peer.on("call", (call) => {
        console.log("📞 [INCOMING CALL] From:", call.metadata?.name);
        toast(`Incoming call from ${call.metadata?.name}`, { icon: "📞" });
        setPeerName(call.metadata?.name || "Peer");
        call.answer(stream);

        call.on("stream", (remoteStream) => {
          console.log("✅ [REMOTE STREAM RECEIVED] (Incoming)");
          toast.success("Remote video connected ✅");
          setPeerStream(remoteStream);
          if (peerVideoRef.current) peerVideoRef.current.srcObject = remoteStream;
        });
      });

      // 📡 When someone joins room (backend tells us)
      socket.on("other_user_for_video", ({ peerId, name }) => {
        console.log("🔵 [SOCKET] Received 'other_user_for_video' =>", peerId, name);
        toast(`Found user ${name}`, { icon: "👥" });

        setPeerName(name || "Peer");
        const call = peer.call(peerId, stream, { metadata: { name: auth.user.name } });
        activeCallRef.current = call;

        call.on("stream", (remoteStream) => {
          console.log("✅ [REMOTE STREAM RECEIVED] (Outgoing)");
          toast.success("Video call connected successfully! 🎥");
          setPeerStream(remoteStream);
          if (peerVideoRef.current) peerVideoRef.current.srcObject = remoteStream;
        });

        call.on("close", () => {
          console.log("❌ [CALL CLOSED]");
          toast("User disconnected", { icon: "❌" });
          setPeerStream(null);
        });
      });

      // 📡 If peer left
      socket.on("peer_left", ({ peerId }) => {
        console.log("🔴 [SOCKET] Peer left =>", peerId);
        toast("Other user left the call", { icon: "👋" });
        if (activeCallRef.current) activeCallRef.current.close();
        setPeerStream(null);
      });

      // 🔻 cleanup function
      cleanup = () => {
        console.log("🧹 [CLEANUP]");
        socket.off("other_user_for_video");
        socket.off("peer_left");
        peer.destroy();
        stream.getTracks().forEach((t) => t.stop());
      };
    })();

    return () => cleanup();
  }, [sessionId]);

  return (
    <div style={styles.container}>
      <h2>Video Session: {sessionId}</h2>

      <div style={styles.videoGrid}>
        {/* My Video */}
        <div style={styles.videoContainer}>
          <video ref={myVideoRef} autoPlay playsInline muted style={styles.video}></video>
          <div style={styles.nameTag}>{auth.user.name} (You)</div>
        </div>

        {/* Peer Video */}
        <div style={styles.videoContainer}>
          <video ref={peerVideoRef} autoPlay playsInline style={styles.video}></video>
          <div style={styles.nameTag}>{peerStream ? peerName : "Connecting..."}</div>
        </div>
      </div>
    </div>
  );
}
