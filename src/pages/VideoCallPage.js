import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import Peer from "peerjs";
import toast from "react-hot-toast";

const SOCKET_URL = "https://collegeconnect-backend-mrkz.onrender.com";
const socket = io(SOCKET_URL, { transports: ["websocket"] });

export default function VideoCallPage() {
  const { sessionId } = useParams();
  const { auth } = useAuth();
  const [peerName, setPeerName] = useState("Connecting...");
  const [peerStream, setPeerStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [remoteMuted, setRemoteMuted] = useState(true);

  const myVideoRef = useRef();
  const peerVideoRef = useRef();
  const myStreamRef = useRef();
  const peerRef = useRef();
  const activeCallRef = useRef();

  // 🔹 Attach local stream
  useEffect(() => {
    if (myVideoRef.current && myStreamRef.current) {
      myVideoRef.current.srcObject = myStreamRef.current;
      myVideoRef.current.play().catch(() => {});
    }
  }, [myStreamRef.current]);

  // 🔹 Attach remote stream
  useEffect(() => {
    if (peerVideoRef.current && peerStream) {
      peerVideoRef.current.srcObject = peerStream;
      peerVideoRef.current.play().catch(() => {});
    }
  }, [peerStream]);

  useEffect(() => {
    let cleaned = false;

    (async () => {
      try {
        const local = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cleaned) return;
        myStreamRef.current = local;
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = local;
          myVideoRef.current.play().catch(() => {});
        }
        console.log("[MEDIA] local tracks:", local.getTracks().map(t => `${t.kind}:${t.enabled}`));

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
          if (cleaned) return;
          console.log("[PEER] open", id);
          socket.emit("join_video_room", {
            room: sessionId,
            peerId: id,
            name: auth?.user?.name || "User",
          });
        });

        peer.on("call", (call) => {
          console.log("[CALL] incoming from", call.metadata?.name);
          if (!myStreamRef.current) return;
          if (activeCallRef.current) activeCallRef.current.close();
          activeCallRef.current = call;
          call.answer(myStreamRef.current);
          call.on("stream", (remote) => {
            console.log("[CALL] incoming remote stream");
            setPeerName(call.metadata?.name || "Peer");
            setPeerStream(remote);
          });
          call.on("close", () => setPeerStream(null));
        });

        const onOther = ({ peerId, name }) => {
          console.log("[SOCKET] other_user_for_video", peerId, name);
          if (!myStreamRef.current) return;
          const call = peer.call(peerId, myStreamRef.current, {
            metadata: { name: auth?.user?.name || "User" },
          });
          activeCallRef.current = call;
          call.on("stream", (remote) => {
            console.log("[CALL] outgoing remote stream");
            setPeerName(name || "Peer");
            setPeerStream(remote);
          });
          call.on("close", () => setPeerStream(null));
        };

        const onPeerLeft = ({ peerId }) => {
          console.log("[SOCKET] peer_left", peerId);
          setPeerStream(null);
          setPeerName("Peer left");
          activeCallRef.current?.close?.();
        };

        socket.on("other_user_for_video", onOther);
        socket.on("peer_left", onPeerLeft);

        VideoCallPage._cleanup = () => {
          socket.off("other_user_for_video", onOther);
          socket.off("peer_left", onPeerLeft);
          try { activeCallRef.current?.close?.(); } catch {}
          try { peerRef.current?.destroy?.(); } catch {}
          try { myStreamRef.current?.getTracks()?.forEach(t => t.stop()); } catch {}
        };
      } catch (err) {
        console.error("Camera error:", err);
        toast.error("Could not access camera/mic");
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

  // 🔹 Mute / Cam toggle
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center font-[Poppins] p-4">
      <h2 className="text-xl font-semibold my-3">Video Session: {sessionId}</h2>

      <div className="grid gap-4 w-[95%] max-w-[1200px] grid-cols-1 sm:grid-cols-2">
        <div className="bg-[#1e293b] rounded-2xl overflow-hidden shadow-xl">
          <video ref={myVideoRef} autoPlay playsInline muted className="w-full h-[360px] object-cover transform scale-x-[-1]" />
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-center py-2 font-semibold">
            {auth?.user?.name || "You"} (You) {micOn ? "🎙️" : "🔇"} {camOn ? "📷" : "🚫"}
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-2xl overflow-hidden shadow-xl">
          <video ref={peerVideoRef} autoPlay playsInline muted={remoteMuted} className="w-full h-[360px] object-cover" />
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-center py-2 font-semibold">
            {peerStream ? peerName : "Connecting..."}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3 flex-wrap">
        <button onClick={toggleMic} className="px-4 py-2 bg-blue-600 rounded-lg">{micOn ? "🔇 Mute" : "🎙️ Unmute"}</button>
        <button onClick={toggleCam} className="px-4 py-2 bg-purple-600 rounded-lg">{camOn ? "🚫 Camera Off" : "📷 Camera On"}</button>
        {remoteMuted && <button onClick={() => setRemoteMuted(false)} className="px-4 py-2 bg-green-600 rounded-lg">🔊 Hear Other</button>}
        <button onClick={() => (window.location.href = "/")} className="px-4 py-2 bg-red-600 rounded-lg">📞 End Call</button>
      </div>
    </div>
  );
}
