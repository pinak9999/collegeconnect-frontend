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
  // ✅ फिक्स 1: Autoplay के लिए 'muted' स्टेट वापस जोड़ा गया
  const [remoteMuted, setRemoteMuted] = useState(true);

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
        // ‼️ चेतावनी: ये 'expressturn' और 'openrelay' डेमो सर्वर हैं।
        // ये असली (production) इस्तेमाल में 100% फेल होंगे।
        // आपको Twilio जैसे प्रोवाइडर से असली TURN क्रेडेंशियल्स इस्तेमाल करने होंगे।
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
            name: "User", // यहाँ आप 'auth' context से नाम डाल सकते हैं
          });
        });

        // जब हमें कॉल आती है (दूसरा यूज़र हमें कॉल करता है)
        peer.on("call", (call) => {
          console.log("[CALL] Incoming call from", call.metadata?.name);
          
          // अगर पहले से कोई कॉल है, तो उसे बंद कर दें
          if (activeCallRef.current) {
            console.warn("Closing previous active call...");
            activeCallRef.current.close();
          }

          call.answer(localStream);
          activeCallRef.current = call;
          setPeerName(call.metadata?.name || "Peer");

          call.on("stream", (remote) => {
            console.log("[STREAM] Incoming remote stream");
            setPeerStream(remote);
            if (peerVideoRef.current) {
              peerVideoRef.current.srcObject = remote;
              peerVideoRef.current.play().catch((err) =>
                  console.warn("Autoplay error (incoming):", err.message)
                );
            }
          });
          call.on("close", () => {
            setPeerStream(null);
            setPeerName("Peer left");
            activeCallRef.current = null;
            console.log("Incoming call ended");
          });
        });

        // जब दूसरा user जुड़ता है (और हम उसे कॉल करते हैं)
        const onOther = ({ peerId, name }) => {
          console.log("[SOCKET] Other user joined", peerId, name);
          setPeerName(name || "Peer");

          // अगर पहले से कोई कॉल है, तो उसे बंद कर दें
          if (activeCallRef.current) {
            console.warn("Closing previous active call...");
            activeCallRef.current.close();
          }

          const call = peer.call(peerId, localStream, {
            metadata: { name: "User" }, // यहाँ भी 'auth' से नाम डालें
          });
          activeCallRef.current = call;

          call.on("stream", (remote) => {
            console.log("[STREAM] Outgoing remote stream");
            setPeerStream(remote);
            if (peerVideoRef.current) {
              peerVideoRef.current.srcObject = remote;
              peerVideoRef.current.play().catch((err) =>
                  console.warn("Autoplay error (outgoing):", err.message)
                );
            }
          });

        call.on("close", () => {
            setPeerStream(null);
            setPeerName("Peer left");
            activeCallRef.current = null;
            console.log("Outgoing call ended");
          });
        };

        // ✅ फिक्स 2: 'onPeerLeft' को सही किया गया
        const onPeerLeft = ({ peerId }) => {
          console.log(`[SOCKET] Peer left: ${peerId}`);
          
          // सिर्फ तभी कॉल बंद करें अगर वह *वही* यूज़र है जो अभी कनेक्टेड था
          if (activeCallRef.current && activeCallRef.current.peer === peerId) {
            console.log(`Closing call with ${peerId}`);
            activeCallRef.current.close();
            activeCallRef.current = null; // <-- सबसे ज़रूरी: रेफरेंस को null करो
            setPeerStream(null);
            setPeerName("Peer left");
            setRemoteMuted(true); // अगली कॉल के लिए आवाज़ 'mute' कर दो
          } else {
            console.log(`Ignoring 'peer_left' for ${peerId}, we are not connected to them.`);
          }
        };

        socket.on("other_user_for_video", onOther);
        socket.on("peer_left", onPeerLeft);

        // Cleanup (अब यह सही तरीके से काम करेगा)
        return () => {
          console.log("Running video call cleanup...");
          cleaned = true;
          socket.off("other_user_for_video", onOther);
          socket.off("peer_left", onPeerLeft);
          try { activeCallRef.current?.close?.(); } catch {}
          try { peerRef.current?.destroy?.(); } catch {}
          try { myStreamRef.current?.getTracks()?.forEach((track) => track.stop()); } catch {}
          activeCallRef.current = null;
          peerRef.current = null;
          myStreamRef.current = null;
        };

      } catch (err) {
        console.error("Camera Error:", err);
        toast.error("Unable to access camera/mic.");
      }
    })();
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
        _       autoPlay
              playsInline
              muted={remoteMuted} // ✅ फिक्स 1: Autoplay के लिए 'muted' जोड़ा गया
              className="w-full h-[320px] sm:h-[400px] object-cover"
            ></video>
          ) : (
            <div className="flex items-center justify-center h-[320px] sm:h-[400px] text-gray-400">
              {peerName === "Peer left" ? "Peer left the call" : "Waiting for other user..."}
            </div>
          )}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-center py-2 font-semibold">
            {peerStream ? peerName : (peerName === "Peer left" ? "Peer left" : "Connecting...")}
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
        {/* ✅ फिक्स 1: 'Hear Other' बटन वापस जोड़ा गया */}
        {peerStream && remoteMuted && (
          <button onClick={() => setRemoteMuted(false)} 
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold transition"
          >
            🔊 Hear Other
          </button>
        )}
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