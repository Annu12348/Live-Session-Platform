import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);

  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  const SOCKET_BASE_URL =
    import.meta.env.VITE_SOCKET_URL ||
    (isLocalhost
      ? "http://localhost:5000"
      : "https://live-session-platform.onrender.com");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (isLocalhost
      ? "http://localhost:5000"
      : "https://live-session-platform.onrender.com");

  useEffect(() => {
    const newSocket = io(SOCKET_BASE_URL, { transports: ["websocket"] });
    setSocket(newSocket);

    return () => {
      newSocket.removeAllListeners();
      newSocket.disconnect();
      if (peerRef.current) peerRef.current.close();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartSession = async () => {
    try {
      setLoading(true);
      const unique_id = Math.random().toString(36).substring(2, 10);
      const userurl = `${window.location.origin}/session/${unique_id}`;

      const response = await axios.post(
        `${API_BASE_URL}/live-session/teacher/start-session`,
        {
          type: "teacher",
          unique_id,
          userurl,
        }
      );

      setSession(response.data.data);
      alert("✅ Session created successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create session.");
    } finally {
      setLoading(false);
    }
  };

  const startVideoCall = async () => {
    if (!socket || !session) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection();
      peerRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            sessionId: session.unique_id,
          });
        }
      };

      socket.emit("join-session", session.unique_id);

      const handleIce = async ({ candidate }) => {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error(err);
        }
      };
      socket.off("ice-candidate");
      socket.on("ice-candidate", handleIce);

      const handleAnswer = async ({ answer }) => {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      };
      socket.off("answer");
      socket.on("answer", handleAnswer);

      const handleReadyForOffer = async () => {
        try {
          if (pc.signalingState !== "stable") return;
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", { sessionId: session.unique_id, offer });
        } catch (error) {
          console.error("Failed to create offer", error);
        }
      };

      socket.off("ready-for-offer");
      socket.on("ready-for-offer", handleReadyForOffer);

      // In case the student is already waiting
      await handleReadyForOffer();
    } catch (err) {
      if (err.name === "NotAllowedError") {
        alert("❌ Please allow access to camera and microphone!");
      } else {
        console.error(err);
      }
    }
  };

  const handleCopy = () => {
    if (session?.userurl) {
      navigator.clipboard.writeText(session.userurl);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="w-full h-full items-center justify-center p-5 flex">
      <div className="shadow bg-zinc-50 w-full max-w-xl py-3 pb-5 px-5 flex flex-col items-center justify-center rounded-lg">
        <h1 className="text-5xl font-bold capitalize">Start Live Session</h1>
        <button
          onClick={handleStartSession}
          className="text-md mt-6 uppercase bg-blue-600 cursor-pointer px-4 py-3 font-bold text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "Creating..." : "Start Session"}
        </button>

        {session?.unique_id && (
          <>
            <div className="w-full mt-7">
              <label className="font-bold text-md">Session URL</label>
              <div className="flex border border-zinc-100 pr-3 pl-1.5 rounded-lg items-center">
                <input
                  type="url"
                  className="border-r-2 outline-none py-2 border-zinc-100 w-full bg-transparent"
                  value={session.userurl}
                  readOnly
                />
                <button
                  className="pl-3 uppercase font-semibold text-blue-600 hover:underline"
                  onClick={handleCopy}
                  type="button"
                >
                  Copy
                </button>
              </div>

              <button
                onClick={startVideoCall}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Start Video Call
              </button>

              <div className="mt-4 w-full flex gap-2">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-1/2 rounded-lg"
                />
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-1/2 rounded-lg"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
