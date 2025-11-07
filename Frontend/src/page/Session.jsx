{/*import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaPhoneSlash } from "react-icons/fa";

const Session = () => {
  const { unique_id } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(
          `https://live-session-platform.onrender.com/live-session/student/session/${unique_id}`
        );
        setSessionData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [unique_id]);

  const handleJoinSession = async () => {
    if (!sessionData) return;
    setJoined(true);
    const socket = io("https://live-session-platform.onrender.com");
    socketRef.current = socket;

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
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            sessionId: sessionData.unique_id,
          });
        }
      };

      socket.emit("join-session", sessionData.unique_id);

      socket.on("offer", async ({ offer }) => {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { sessionId: sessionData.unique_id, answer });
      });

      socket.on("ice-candidate", async ({ candidate }) => {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error(err);
        }
      });
    } catch (err) {
      alert("Please allow camera and microphone access!");
    }
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

  const leaveSession = () => window.location.href = "/";

  if (loading)
    return <h2 className="text-center text-lg mt-10">Loading session...</h2>;

  if (!sessionData)
    return (
      <h2 className="text-center text-red-500 mt-10">
        Session not found or expired.
      </h2>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl text-center">
        {!joined ? (
          <>
            <h1 className="text-3xl font-bold mb-2">Join Live Session</h1>
            <p className="text-gray-600 mb-5">
              You are invited to join <b>{sessionData.type}</b>’s session.
            </p>
            <button
              onClick={handleJoinSession}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Join Now
            </button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mt-5">
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
                    <button onClick={leaveSession} className="text-red-500">
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

export default Session;
*/}



import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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

const Session = () => {
  const { unique_id } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [cameraOff, setCameraOff] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(
          `https://live-session-platform.onrender.com/live-session/student/session/${unique_id}`
        );
        setSessionData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [unique_id]);

  const handleJoinSession = async () => {
    if (!sessionData) return;
    setJoined(true);
    const socket = io("https://live-session-platform.onrender.com");
    socketRef.current = socket;

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
            sessionId: sessionData.unique_id,
          });
        }
      };

      socket.emit("join-session", sessionData.unique_id);

      socket.on("offer", async ({ offer }) => {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { sessionId: sessionData.unique_id, answer });
      });

      socket.on("ice-candidate", async ({ candidate }) => {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error(err);
        }
      });
    } catch (err) {
      alert("Please allow camera and microphone access!");
    }
  };

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
  const leaveSession = () => (window.location.href = "/");

  if (loading) return <h2 className="text-center mt-10">Loading session...</h2>;
  if (!sessionData)
    return <h2 className="text-center mt-10 text-red-500">Session not found.</h2>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-4xl text-center">
        {!joined ? (
          <>
            <h1 className="text-3xl font-bold mb-2">Join Live Session</h1>
            <p className="text-gray-600 mb-5">
              You are invited to join <b>{sessionData.type}</b>’s session.
            </p>
            <button
              onClick={handleJoinSession}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Join Now
            </button>
          </>
        ) : (
          <>
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <button onClick={leaveSession} className="text-red-500 text-xl">
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

export default Session;