{/*import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const Session = () => {
  const { unique_id } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://live-session-platform.onrender.com/live-session/student/session/${unique_id}`
        );
        setSessionData(res.data.data);
      } catch (err) {
        setError("Session not found or expired.");
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
      console.error("Error accessing camera/mic:", err);
    }
  };

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (error) return <h2 className="text-center mt-10 text-red-500">{error}</h2>;

  return (
    <div className="w-full h-full flex items-center p-5 justify-center">
      <div className="p-3 bg-white w-[50vh] shadow rounded-lg flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold capitalize">Join Live Session</h1>

        {!joined ? (
          <>
            <p className="text-center mt-3 text-gray-600">
              You are invited to join <b>{sessionData?.type}</b>’s live session.
            </p>
            <button
              onClick={handleJoinSession}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold uppercase"
            >
              Join Session
            </button>
          </>
        ) : (
          <>
            <div className="w-full h-[25vh] mt-2 bg-black rounded-t-xl flex items-center justify-center">
              <video
                ref={remoteVideoRef}
                autoPlay
                controls
                className="w-full h-full rounded-lg"
              />
            </div>

            <div className="w-full mt-2 flex gap-2">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                controls
                className="w-1/2 h-32 rounded-lg"
              />
            </div>

            {sessionData && (
              <div className="w-full">
                <h3 className="mt-2 font-bold text-xl">
                  Session ID: {sessionData.unique_id}
                </h3>
                <p className="text-sm font-semibold mt-1 mb-1.5">
                  You have joined {sessionData.type}’s session.
                </p>
              </div>
            )}

            <Link
              to="/"
              className="bg-zinc-200 w-full text-center mt-3 py-4 rounded uppercase font-semibold"
            >
              Leave Session
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Session;
*/}

import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const Session = () => {
  const { unique_id } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  // 🔹 Fetch session details once
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://live-session-platform.onrender.com/live-session/student/session/${unique_id}`
        );
        setSessionData(res.data.data);
      } catch (err) {
        setError("Session not found or expired.");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [unique_id]);

  // 🔹 Function: Start the video after student clicks “Join Session”
  const handleJoinSession = async () => {
    if (!sessionData) return;

    setJoined(true); // UI me video dikhana start karo
    const socket = io("https://live-session-platform.onrender.com");
    socketRef.current = socket;

    try {
      // 🔸 Get student’s camera/mic permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection();
      peerRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteVideoRef.current)
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
      console.error("Error accessing camera/mic:", err);
      alert("Please allow access to camera and microphone.");
    }
  };

  // 🔹 Loading / Error states
  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (error) return <h2 className="text-center mt-10 text-red-500">{error}</h2>;

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="p-5 bg-white w-[90%] md:w-[50vh] shadow-lg rounded-lg flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold capitalize">Join Live Session</h1>

        {/* 🔸 Step 1: Show Join Button First */}
        {!joined ? (
          <>
            <p className="text-center mt-3 text-gray-600">
              You are invited to join <b>{sessionData?.type}</b>’s live session.
            </p>
            <button
              onClick={handleJoinSession}
              className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold uppercase"
            >
              Join Session
            </button>
          </>
        ) : (
          // 🔸 Step 2: After clicking "Join", show video player
          <>
            <div className="w-full h-[25vh] mt-3 bg-black rounded-lg flex items-center justify-center">
              <video
                ref={remoteVideoRef}
                autoPlay
                controls
                className="w-full h-full rounded-lg"
              />
            </div>

            <div className="w-full mt-2 flex gap-2">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                controls
                className="w-1/2 h-32 rounded-lg"
              />
            </div>

            <div className="w-full">
              <h3 className="mt-2 font-bold text-xl">
                Session ID: {sessionData.unique_id}
              </h3>
              <p className="text-sm font-semibold mt-1 mb-2">
                You have joined {sessionData.type}’s session.
              </p>
            </div>

            <Link
              to="/"
              className="bg-zinc-200 w-full text-center mt-3 py-4 rounded uppercase font-semibold"
            >
              Leave Session
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Session;
