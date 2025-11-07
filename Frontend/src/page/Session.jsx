{/*import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import axios from "axios";
import { io } from "socket.io-client";

const Session = () => {
  const { unique_id } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/live-session/student/session/${unique_id}`
        );
        setSessionData(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        setError("Session not found or expired.");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [unique_id]);

  useEffect(() => {
    if (!sessionData) return;

    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    const startStudentCall = async () => {
      try {
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

        // Jab bhi WebRTC peer connection ko naya ICE candidate milta hai (yeh ek network candidate hota hai jo remote device tak connection establish karne mein help karta hai),
        // yeh function trigger hota hai.
        // Phir agar event.candidate maujood hai (matlab nayi ICE info mili hai),
        // toh hum us candidate ko socket ke through backend/server ya dusre peer tak bhej dete hain.
        // Iske andar hum 'ice-candidate' ek channel/event naam se bhej rahe hain, saath hi ek object pass kar rahe hain
        // jis mein candidate data aur session ka unique_id pass hota hai, taaki doosra user/peer bhi yeh candidate paa sake aur NAT traversal ho sake.

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              candidate: event.candidate,
              sessionId: sessionData.unique_id,
            });
          }
        };

        socket.emit("join-session", sessionData.unique_id);

        socket.on("offer", async (offer) => {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { sessionId: sessionData.unique_id, answer });
        });

        socket.on("ice-candidate", async ({ candidate }) => {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (error) {
            console.error(error);
          }
        });
      } catch (err) {
        console.error(err);
      }
    };

    startStudentCall();

    return () => {
      socket.disconnect();
      if (peerRef.current) peerRef.current.close();
    };
  }, [sessionData]);

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (error) return <h2 className="text-center mt-10 text-red-500">{error}</h2>;

  return (
    <div className="w-full h-full flex items-center p-5 justify-center">
      <div className="p-3 bg-white w-[50vh] shadow rounded-lg flex flex-col items-center justify-center ">
        <h1 className="text-3xl leading-none tracking-tight font-bold capitalize">
          join live session
        </h1>

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
            <h3 className="mt-2 font-bold text-xl tracking-tight">
              Session Id : {sessionData.unique_id}
            </h3>
            <p className="text-md text-sm font-semibold tracking-tight leading-none mt-1 mb-1.5">
              You have joined {sessionData.type}’s session.
            </p>
          </div>
        )}

        <Link
          to="/"
          className="bg-zinc-200 w-full text-center mt-3 py-4 rounded uppercase font-semibold tracking-tight leading-none"
        >
          leave session
        </Link>
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

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/live-session/student/session/${unique_id}`
        );
        setSessionData(response.data.data);
      } catch (err) {
        setError("Session not found or expired.");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [unique_id]);

  useEffect(() => {
    if (!sessionData) return;

    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    const startStudentCall = async () => {
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
        console.error(err);
      }
    };

    startStudentCall();

    return () => {
      socket.disconnect();
      if (peerRef.current) peerRef.current.close();
    };
  }, [sessionData]);

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (error) return <h2 className="text-center mt-10 text-red-500">{error}</h2>;

  return (
    <div className="w-full h-full flex items-center p-5 justify-center">
      <div className="p-3 bg-white w-[50vh] shadow rounded-lg flex flex-col items-center justify-center ">
        <h1 className="text-3xl font-bold capitalize">Join Live Session</h1>

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
            <h3 className="mt-2 font-bold text-xl tracking-tight">
              Session Id: {sessionData.unique_id}
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
      </div>
    </div>
  );
};

export default Session;
