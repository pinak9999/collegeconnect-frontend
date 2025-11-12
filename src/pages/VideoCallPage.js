import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import Peer from "peerjs";
import toast from "react-hot-toast";

// ✅ Use a single global socket instance (DON'T disconnect in component)
const SOCKET_URL = "https://collegeconnect-backend-mrkz.onrender.com";
const socket = io(SOCKET_URL, { withCredentials: false });

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
  header: { fontSize: "1.2rem", fontWeight: 600, marginBottom: 8 },
  videoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 16,
    width: "92%",
    maxWidth: 1200,
    margin: "12px 0 24px",
  },
  card: {
    background: "#1e293b",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    minHeight: 260,
    display: "flex",
    flexDirection: "column",
  },
  video: {
    width: "100%",
    height: 340,
    objectFit: "cover",
    background: "#0b223d",
  },
  myMirror: { transform: "scaleX(-1)" },
  nameTag: {
    padding: 10,
    background: "linear-gradient(90deg, #7c3aed, #2563eb)",
    textAlign: "center",
    fontWeight: 500,
  },
  controls: { display: "flex", gap: 10 },
  btn: (bg) => ({
    padding: "10px 18px",
    fontWeight: 600,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    background: bg,
    color: "#fff",
  }),
};

function VideoCallPage() {
  const { sessionId } = useParams();
  const { auth } = useAuth();

  const [peerName, setPeerName] = useState("Connecting...");
  const [myStream, setMyStream] = useState(null);
  const [peerStream, setPeerStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [remoteMuted, setRemoteMuted] = useState(true); // autoplay-safe

  const myVideoRef = useRef(null);
  const peerVideoRef = useRef(null);
  const peerRef = useRef(null);
  const activeCallRef = useRef(null);

  // attach local stream to <video> when available
  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
      const p = myVideoRef.current.play();
      if (p?.catch) p.catch(() => {});
    }
  }, [myStream]);

  // attach remote stream to <video> when available
  useEffect(() => {
    if (peerVideoRef.current && peerStream) {
      peerVideoRef.current.srcObject = peerStream;
      const p = peerVideoRef.current.play();
      if (p?.catch) p.catch(() => {}); // might be blocked until user gesture if unmuted
    }
  }, [peerStream]);

  useEffect(() => {
    let destroyed = false;

    (async () => {
      try {
        // 1) get local media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (destroyed) return;
        setMyStream(stream);
        console.log("[VIDEO] got local media");

        // 2) setup PeerJS with TURN (replace with your own TURN creds!)
        const peer = new Peer(undefined, {
          host: "0.peerjs.com",
          port: 443,
          secure: true,
          // ✅ TURN added for strict NATs
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              // ⬇️ Replace with your TURN provider
              { urls: "turn:relay1.expressturn.com:3478", username: "expressturn", credential: "password" }
            ]
          }
        });
        peerRef.current = peer;

        // 3) on open, join socket room with my peerId
        peer.on("open", (myPeerId) => {
          console.log("[PEER] open", myPeerId);
          socket.emit("join_video_room", {
            room: sessionId,
            peerId: myPeerId,
            name: auth?.user?.name || "User",
          });
          toast.success("Connected! Waiting for other user...");
        });

        // 4) answer incoming calls
        peer.on("call", (call) => {
          console.log("[PEER] incoming call");
          // close previous if any
          if (activeCallRef.current) activeCallRef.current.close();
          activeCallRef.current = call;

          const remoteUserName = call.metadata?.name || "Peer";
          setPeerName(remoteUserName);

          call.answer(stream);

          call.on("stream", (remoteStream) => {
            console.log("[PEER] got remote stream (incoming)");
            setPeerStream(remoteStream);
          });

          call.on("close", () => {
            setPeerStream(null);
            activeCallRef.current = null;
          });
        });

        // 5) when socket tells us another user exists / joined
        const onOther = ({ peerId, name }) => {
          if (!peerId) return;
          console.log("[SOCKET] other_user_for_video", peerId, name);
          setPeerName(name || "Peer");

          const call = peer.call(peerId, stream, { metadata: { name: auth?.user?.name || "User" } });
          if (activeCallRef.current) activeCallRef.current.close();
          activeCallRef.current = call;

          call.on("stream", (remoteStream) => {
            console.log("[PEER] got remote stream (outgoing)");
            setPeerStream(remoteStream);
          });

          call.on("close", () => {
            setPeerStream(null);
            activeCallRef.current = null;
          });
        };

        const onPeerLeft = ({ peerId }) => {
          console.log("[SOCKET] peer_left", peerId);
          if (activeCallRef.current) {
            activeCallRef.current.close();
            activeCallRef.current = null;
          }
          setPeerStream(null);
          setPeerName("Peer left");
        };

        socket.on("other_user_for_video", onOther);
        socket.on("peer_left", onPeerLeft);

        // Cleanup
        const cleanup = () => {
          socket.off("other_user_for_video", onOther);
          socket.off("peer_left", onPeerLeft);
          try { activeCallRef.current?.close?.(); } catch {}
          try { peerRef.current?.destroy?.(); } catch {}
          try { stream.getTracks().forEach(t => t.stop()); } catch {}
        };

        // store for outer return
        VideoCallPage._innerCleanup = cleanup;
      } catch (err) {
        console.error("[VIDEO] getUserMedia failed", err);
        toast.error("Could not access camera/mic.");
      }
    })();

    return () => {
      destroyed = true;
      // do NOT socket.disconnect() here (global)
      if (VideoCallPage._innerCleanup) {
        VideoCallPage._innerCleanup();
        VideoCallPage._innerCleanup = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // mic/cam toggles
  const toggleMic = () => {
    if (!myStream) return;
    const track = myStream.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  };
  const toggleCam = () => {
    if (!myStream) return;
    const track = myStream.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    }
  };

  const unmuteRemote = () => setRemoteMuted(false);

  const endCall = () => {
    // close active call and go back
    try { activeCallRef.current?.close?.(); } catch {}
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Video Session: {sessionId}</div>

      <div style={styles.videoGrid}>
        {/* My video */}
        <div style={styles.card}>
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            style={{ ...styles.video, ...styles.myMirror }}
          />
          <div style={styles.nameTag}>{auth?.user?.name || "You"} (You) {micOn ? "🎙️" : "🔇"} {camOn ? "📷" : "🚫"}</div>
        </div>

        {/* Peer video — always rendered */}
        <div style={styles.card}>
          <video
            ref={peerVideoRef}
            autoPlay
            playsInline
            // autoplay policy safe: start muted, allow user to unmute
            muted={remoteMuted}
            style={styles.video}
          />
          <div style={styles.nameTag}>{peerStream ? (peerName || "Peer") : "Connecting..."}</div>
        </div>
      </div>

      <div style={styles.controls}>
        <button onClick={toggleMic} style={styles.btn(micOn ? "#2563eb" : "#0ea5e9")}>
          {micOn ? "🔇 Mute" : "🎙️ Unmute"}
        </button>
        <button onClick={toggleCam} style={styles.btn(camOn ? "#7c3aed" : "#a855f7")}>
          {camOn ? "🚫 Camera Off" : "📷 Camera On"}
        </button>
        {remoteMuted && (
          <button onClick={unmuteRemote} style={styles.btn("#10b981")}>
            🔊 Hear Other
          </button>
        )}
        <button onClick={endCall} style={styles.btn("linear-gradient(135deg,#ef4444,#dc2626)")}>
          📞 End Call
        </button>
      </div>
    </div>
  );
}

export default VideoCallPage;
