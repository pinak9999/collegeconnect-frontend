import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Peer from "peerjs";
import toast from "react-hot-toast";

// ✅ Backend URL (Render)
const SOCKET_URL = "https://collegeconnect-backend-mrkz.onrender.com";
const socket = io(SOCKET_URL, { transports: ["websocket"] });

export default function VideoCallPage() {
  const { sessionId } = useParams();

  const [peerName, setPeerName] = useState("Connecting...");
  const [peerStream, setPeerStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const myVideoRef = useRef();
  const peerVideoRef = useRef();
  const myStreamRef = useRef();
  const peerRef = useRef();
  const activeCallRef = useRef();

  // 🎥 Setup local + remote video stream
  useEffect(() => {
    let cleaned = false;

    (async () => {
      try {
        // Get permission for Camera + Mic
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (cleaned) return;

        myStreamRef.current = localStream;
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = localStream;
          myVideoRef.current.play().catch(() => {});
        }
        toast.success("🎥 Camera & Mic Ready");

        // Setup PeerJS
        const peer = new Peer(undefined, {
          host: "0.peerjs.com",
          port: 443,
          secure: true,
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              {
                urls: "turn:relay1.expressturn.com:3478",
                username: "expressturn",
                credential: "password",
              },
              {
                urls: "turn:openrelay.metered.ca:80",
                username: "openrelayproject",
                credential: "openrelayproject",
              },
              {
                urls: "turn:openrelay.metered.ca:443",
                username: "openrelayproject",
                credential: "openrelayproject",
              },
            ],
          },
        });
        peerRef.current = peer;

        peer.on("open", (id) => {
          console.log("[PEER] open", id);
          socket.emit("join_video_room", {
            room: sessionId,
            peerId: id,
            name: "User",
          });
        });

        // जब हमें कॉल आती है
        peer.on("call", (call) => {
          console.log("[CALL] Incoming call from", call.metadata?.name);
          call.answer(localStream);
          activeCallRef.current = call;

          call.on("stream", (remote) => {
            console.log("[STREAM] Incoming remote stream");
            setPeerStream(remote);
            if (peerVideoRef.current) {
              peerVideoRef.current.srcObject = remote;
              peerVideoRef.current
                .play()
                .then(() => console.log("🎧 Auto-play success"))
                .catch((err) =>
                  console.warn("Autoplay error ignored:", err.message)
                );
            }
          });
          call.on("close", () => {
            setPeerStream(null);
            console.log("Call ended");
          });
        });

        // जब दूसरा user जुड़ता है
        const onOther = ({ peerId, name }) => {
          console.log("[SOCKET] Other user joined", peerId, name);
          setPeerName(name || "Peer");

          const call = peer.call(peerId, localStream, {
            metadata: { name: "User" },
          });
          activeCallRef.current = call;

          call.on("stream", (remote) => {
            console.log("[STREAM] Outgoing remote stream");
            setPeerStream(remote);
            if (peerVideoRef.current) {
              peerVideoRef.current.srcObject = remote;
              peerVideoRef.current
                .play()
                .then(() => console.log("🎧 Auto-play success"))
                .catch((err) =>
                  console.warn("Autoplay error ignored:", err.message)
                );
            }
          });
        };

        const onPeerLeft = ({ peerId }) => {
          console.log("[SOCKET] Peer left:", peerId);
          setPeerStream(null);
          activeCallRef.current?.close?.();
        };

        socket.on("other_user_for_video", onOther);
        socket.on("peer_left", onPeerLeft);

        // Cleanup
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
            myStreamRef.current
              ?.getTracks()
              ?.forEach((track) => track.stop());
          } catch {}
        };
      } catch (err) {
        console.error("Camera Error:", err);
        toast.error("Unable to access camera/mic.");
      }
    })();

    return () => {
      cleaned = true;
      if (VideoCallPage._cleanup) {
        VideoCallPage._cleanup();
        VideoCallPage._cleanup = null;
      }
    };
  }, [sessionId]);

  // 🎙️ Toggle mic & camera
  const toggleMic = () => {
    const track = myStreamRef.current?.getAudioTracks?.()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  const toggleCam = () => {
    const track = myStreamRef.current?.getVideoTracks?.()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCamOn(track.enabled);
  };

  // 💅 Modern UI
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
      flex flex-col items-center justify-center text-white font-[Poppins] p-4"
    >
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4 animate-fade-in">
        🎥 Live Video Session: <span className="text-blue-400">{sessionId}</span>
      </h1>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* My Video */}
        <div
          className="bg-gray-800/60 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all"
        >
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-[320px] sm:h-[400px] object-cover transform scale-x-[-1]"
          ></video>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-center py-2 font-semibold">
            You {micOn ? "🎙️" : "🔇"} {camOn ? "📷" : "🚫"}
          </div>
        </div>

        {/* Peer Video */}
        <div
          className={`bg-gray-800/60 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all ${
            !peerStream ? "animate-pulse" : ""
          }`}
        >
          {peerStream ? (
            <video
              ref={peerVideoRef}
              autoPlay
              playsInline
              className="w-full h-[320px] sm:h-[400px] object-cover"
            ></video>
          ) : (
            <div className="flex items-center justify-center h-[320px] sm:h-[400px] text-gray-400">
              Waiting for other user to join...
            </div>
          )}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-center py-2 font-semibold">
            {peerStream ? peerName : "Connecting..."}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mt-6">
        <button
          onClick={toggleMic}
          className={`px-6 py-2 rounded-xl text-white font-semibold transition 
          ${micOn ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}`}
        >
          {micOn ? "🔇 Mute" : "🎙️ Unmute"}
        </button>
        <button
          onClick={toggleCam}
          className={`px-6 py-2 rounded-xl text-white font-semibold transition 
          ${camOn ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 hover:bg-gray-700"}`}
        >
          {camOn ? "📷 Turn Off" : "🚫 Turn On"}
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition"
        >
          📞 End Call
        </button>
      </div>
    </div>
  );
}
