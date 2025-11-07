{/*import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaPhoneSlash } from "react-icons/fa";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    const newSocket = io("https://live-session-platform.onrender.com");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
      if (peerRef.current) peerRef.current.close();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleStartSession = async () => {
    try {
      setLoading(true);
      const unique_id = Math.random().toString(36).substring(2, 10);
      const userurl = `${window.location.origin}/session/${unique_id}`;

      const res = await axios.post(
        "https://live-session-platform.onrender.com/live-session/teacher/start-session",
        { type: "teacher", unique_id, userurl }
      );

      setSession(res.data.data);
      alert("✅ Session created successfully!");
    } catch (err) {
      console.error(err);
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
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;

      const pc = new RTCPeerConnection();
      peerRef.current = pc;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
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

      socket.on("user-joined", async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { sessionId: session.unique_id, offer });
      });

      socket.on("answer", async ({ answer }) => {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on("ice-candidate", async ({ candidate }) => {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error(err);
        }
      });
    } catch (err) {
      alert("Please allow camera & microphone access.");
      console.error(err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(session.userurl);
    alert("Copied to clipboard!");
  };

  const toggleMute = () => {
    localStreamRef.current.getAudioTracks().forEach(
      (track) => (track.enabled = !track.enabled)
    );
    setMuted(!muted);
  };

  const togglePlay = () => {
    if (playing) localVideoRef.current.pause();
    else localVideoRef.current.play();
    setPlaying(!playing);
  };

  const toggleFullScreen = (ref) => {
    if (ref.current.requestFullscreen) ref.current.requestFullscreen();
  };

  const endSession = () => {
    if (peerRef.current) peerRef.current.close();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-4">🎥 Start Live Session</h1>
        <button
          onClick={handleStartSession}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Session"}
        </button>

        {session && (
          <>
            <div className="mt-6">
              <label className="font-semibold">Session Link</label>
              <div className="flex mt-2 border rounded-lg overflow-hidden">
                <input
                  type="text"
                  readOnly
                  value={session.userurl}
                  className="flex-1 px-3 py-2 outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="bg-gray-200 px-4 font-semibold"
                >
                  Copy
                </button>
              </div>

              <button
                onClick={startVideoCall}
                className="mt-5 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Start Video
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[localVideoRef, remoteVideoRef].map((ref, i) => (
                <div key={i} className="relative">
                  <video
                    ref={ref}
                    autoPlay
                    playsInline
                    muted={i === 0}
                    className="rounded-lg bg-black w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 flex gap-3 bg-black/50 p-2 rounded-lg">
                    <button onClick={togglePlay} className="text-white">
                      {playing ? <FaPause /> : <FaPlay />}
                    </button>
                    <button onClick={toggleMute} className="text-white">
                      {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                    <button onClick={() => toggleFullScreen(ref)} className="text-white">
                      <FaExpand />
                    </button>
                    <button onClick={endSession} className="text-red-500">
                      <FaPhoneSlash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
*/}



import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [cameraOff, setCameraOff] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    const newSocket = io("https://live-session-platform.onrender.com");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      if (peerRef.current) peerRef.current.close();
      if (localStreamRef.current)
        localStreamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleStartSession = async () => {
    try {
      setLoading(true);
      const unique_id = Math.random().toString(36).substring(2, 10);
      const userurl = `${window.location.origin}/session/${unique_id}`;

      const res = await axios.post(
        "https://live-session-platform.onrender.com/live-session/teacher/start-session",
        { type: "teacher", unique_id, userurl }
      );

      setSession(res.data.data);
      alert("✅ Session created successfully!");
    } catch (err) {
      console.error(err);
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
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;

      const pc = new RTCPeerConnection();
      peerRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
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

      socket.on("user-joined", async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { sessionId: session.unique_id, offer });
      });

      socket.on("answer", async ({ answer }) => {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on("ice-candidate", async ({ candidate }) => {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error(err);
        }
      });
    } catch (err) {
      alert("Please allow camera & microphone access.");
      console.error(err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(session.userurl);
    alert("Copied to clipboard!");
  };

  // Controls
  const toggleMute = () => {
    localStreamRef.current.getAudioTracks().forEach(
      (track) => (track.enabled = !track.enabled)
    );
    setMuted(!muted);
  };
  const toggleCamera = () => {
    localStreamRef.current.getVideoTracks().forEach(
      (track) => (track.enabled = !track.enabled)
    );
    setCameraOff(!cameraOff);
  };
  const togglePlay = () => {
    if (playing) localVideoRef.current.pause();
    else localVideoRef.current.play();
    setPlaying(!playing);
  };
  const toggleFullScreen = (ref) => {
    if (ref.current.requestFullscreen) ref.current.requestFullscreen();
  };
  const endSession = () => {
    if (peerRef.current) peerRef.current.close();
    if (localStreamRef.current)
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-4xl text-center">
        <h1 className="text-3xl font-bold mb-4">🎥 Start Live Session</h1>
        {!session && (
          <button
            onClick={handleStartSession}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Session"}
          </button>
        )}

        {session && (
          <>
            <div className="mt-4">
              <label className="font-semibold">Session Link</label>
              <div className="flex mt-2 border rounded-lg overflow-hidden">
                <input
                  type="text"
                  readOnly
                  value={session.userurl}
                  className="flex-1 px-3 py-2 outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="bg-gray-200 px-4 font-semibold"
                >
                  Copy
                </button>
              </div>

              <button
                onClick={startVideoCall}
                className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Start Video
              </button>
            </div>

            {/* Video Container */}
            <div className="relative mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[localVideoRef, remoteVideoRef].map((ref, i) => (
                <div key={i} className="relative">
                  <video
                    ref={ref}
                    autoPlay
                    playsInline
                    muted={i === 0}
                    className="rounded-lg bg-black w-full h-60 md:h-80 object-cover"
                  />
                </div>
              ))}

              {/* Floating Control Bar */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 p-3 rounded-xl flex gap-5 justify-center items-center">
                <button onClick={toggleMute} className="text-white text-xl">
                  {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <button onClick={toggleCamera} className="text-white text-xl">
                  {cameraOff ? <FaVideoSlash /> : <FaVideo />}
                </button>
                <button onClick={togglePlay} className="text-white text-xl">
                  {playing ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={() => toggleFullScreen(localVideoRef)}
                  className="text-white text-xl"
                >
                  <FaExpand />
                </button>
                <button onClick={endSession} className="text-red-500 text-xl">
                  <FaPhoneSlash />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
