import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import Peer from "peerjs";
import toast from "react-hot-toast";
import axios from "axios"; // 🚀 NAYA ADD KIYA GAYA

// 🚀 NAYA ADD KIYA GAYA
const API_URL = "https://collegeconnect-backend-mrkz.onrender.com";
// ⚠️ Global socket: इसे disconnect मत करना cleanup में
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
  const { auth } = useAuth();

  const [peerName, setPeerName] = useState("Connecting...");
  const [peerStream, setPeerStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [remoteMuted, setRemoteMuted] = useState(true); // autoplay safe

  const myVideoRef = useRef(null);
  const peerVideoRef = useRef(null);

  const myStreamRef = useRef(null); // local MediaStream
  const peerRef = useRef(null); // Peer instance
  const activeCallRef = useRef(null); // current PeerJS call

  // attach local video when ready
  useEffect(() => {
    const v = myVideoRef.current;
    const s = myStreamRef.current;
    if (v && s) {
      v.srcObject = s;
      v.play().catch(() => {});
    }
  }, [myStreamRef.current]);

  // attach remote video when stream changes
  useEffect(() => {
    if (peerVideoRef.current && peerStream) {
      peerVideoRef.current.srcObject = peerStream;
      const p = peerVideoRef.current.play();
      if (p && p.catch) {
        // autoplay fallback: keep muted until user clicks “Hear Other”
        p.catch(() => {});
      }
    }
  }, [peerStream]);

  useEffect(() => {
    let cleaned = false;

    (async () => {
      try {
        // --- 🚀 NAYA PLAN (STEP 1) - YAHAN BADLA HAI ---
        // Pehle check karo ki call time confirmed hai ya nahi
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `${API_URL}/api/bookings/single/${sessionId}`,
            { headers: { "x-auth-token": token } }
          );

          // 🚀 YEH LINE BADLI GAYI HAI
          if (res.data.status_timing !== "confirmed_time") {
            // 🚀 YEH MESSAGE BADLA GAYA HAI
            toast.error("Call time has not been confirmed yet!");
            window.location.href = `/chat/${sessionId}`;
            return; // Yahaan se function ruk jayega
          }
          // Agar confirmed hai, toh code aage badhega...
        } catch (e) {
          toast.error("Invalid session");
          window.location.href = "/student-dashboard/bookings";
          return; // Yahaan se function ruk jayega
        }
        // --- 🚀 END BADLAAV ---

        // 1) Get local media (always before calling/answering)
        const local = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (cleaned) return;
        myStreamRef.current = local;
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = local;
          myVideoRef.current.play().catch(() => {});
        }
        toast.success("Camera/Mic ready ✅");
        console.log(
          "[VIDEO] got local media",
          local.getTracks().map((t) => `${t.kind}:${t.enabled}`)
        );

        // 2) PeerJS (with STUN+TURN for strict NATs)
        const peer = new Peer(undefined, {
          host: "0.peerjs.com",
          port: 443,
          secure: true,
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              // 🔁 TURN – PRODUCTION में अपने creds दें
              {
                urls: "turn:relay1.expressturn.com:3478",
                username: "expressturn",
                credential: "password",
              },
            ],
          },
        });
        peerRef.current = peer;

        // 3) When PeerJS ready, join socket room with my peerId
        peer.on("open", (id) => {
          if (cleaned) return;
          console.log("[PEER] open", id);
          socket.emit("join_video_room", {
            room: sessionId,
            peerId: id,
            name: auth?.user?.name || "User",
          });
        });

        // 4) Answer incoming calls with my local stream
        peer.on("call", (call) => {
          console.log("[PEER] incoming call from", call.metadata?.name);
          if (!myStreamRef.current) {
            console.warn("No local stream to answer with");
            return;
          }
          // close previous call if any
          if (activeCallRef.current) activeCallRef.current.close();
          activeCallRef.current = call;

          const remoteName = call.metadata?.name || "Peer";
          setPeerName(remoteName);

          call.answer(myStreamRef.current);
          call.on("stream", (remote) => {
            console.log("[PEER] got remote stream (incoming)");
            setPeerStream(remote);
          });
          call.on("close", () => {
            setPeerStream(null);
            activeCallRef.current = null;
          });
        });

        // 5) When socket tells us who else is in the room / joined
        const onOther = ({ peerId, name }) => {
          if (!peerRef.current || !myStreamRef.current) {
            console.warn("Peer or local stream not ready; skip call");
            return;
          }
          console.log("[SOCKET] other_user_for_video", peerId, name);
          setPeerName(name || "Peer");

          // call the other side with my local stream
          if (activeCallRef.current) activeCallRef.current.close();
          const call = peerRef.current.call(peerId, myStreamRef.current, {
            metadata: { name: auth?.user?.name || "User" },
          });
          activeCallRef.current = call;

          call.on("stream", (remote) => {
            console.log("[PEER] got remote stream (outgoing)");
            setPeerStream(remote);
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

        // cleanup
        VideoCallPage._cleanup = () => {
          socket.off("other_user_for_video", onOther);
          socket.off("peer_left", onPeerLeft);
          try {
            activeCallRef.current?.close?.();
          } catch {}
          try {
            peerRef.current?.destroy?.();
          } catch {}
          try {
            myStreamRef.current?.getTracks()?.forEach((t) => t.stop());
          } catch {}
        };
      } catch (e) {
        console.error(e);
        toast.error("Could not access camera/mic");
      }
    })();

    return () => {
      cleaned = true;
      if (VideoCallPage._cleanup) {
        VideoCallPage._cleanup();
        VideoCallPage._cleanup = null;
      }
      // ⚠️ global socket को disconnect मत करो
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // mic/cam toggles
  const toggleMic = () => {
    const a = myStreamRef.current?.getAudioTracks?.()[0];
    if (!a) return;
    a.enabled = !a.enabled;
    setMicOn(a.enabled);
  };
  const toggleCam = () => {
    const v = myStreamRef.current?.getVideoTracks?.()[0];
    if (!v) return;
    v.enabled = !v.enabled;
    setCamOn(v.enabled);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Video Session: {sessionId}</div>

      <div style={styles.grid}>
        {/* My video */}
        <div style={styles.card}>
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            style={{ ...styles.video, ...styles.myMirror }}
          />
          <div style={styles.tag}>
            {auth?.user?.name || "You"} (You) {micOn ? "🎙️" : "🔇"}{" "}
            {camOn ? "📷" : "🚫"}
          </div>
        </div>

        {/* Peer video (ALWAYS mounted) */}
        <div style={styles.card}>
          <video
            ref={peerVideoRef}
            autoPlay
            playsInline
            muted={remoteMuted}
            style={styles.video}
          />
          <div style={styles.tag}>
            {peerStream ? peerName || "Peer" : "Connecting..."}
          </div>
        </div>
      </div>

      <div style={styles.controls}>
        <button onClick={toggleMic} style={styles.btn("#2563eb")}>
          {micOn ? "🔇 Mute" : "🎙️ Unmute"}
        </button>
        <button onClick={toggleCam} style={styles.btn("#7c3aed")}>
          {camOn ? "🚫 Camera Off" : "📷 Camera On"}
        </button>
        {remoteMuted && (
          <button
            onClick={() => setRemoteMuted(false)}
            style={styles.btn("#10b981")}
          >
            🔊 Hear Other
          </button>
        )}
        <button
          onClick={() => (window.location.href = "/")}
          style={styles.btn("#ef4444")}
        >
          📞 End Call
        </button>
      </div>
    </div>
  );
}