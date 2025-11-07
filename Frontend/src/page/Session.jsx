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
  const [teacherCameraOff, setTeacherCameraOff] = useState(false);

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

    // Listen for teacher camera toggle
    socket.on("teacher-camera-toggle", ({ isCameraOn }) => {
      setTeacherCameraOff(!isCameraOn);
      if (!isCameraOn) remoteVideoRef.current.srcObject = null;
    });

    // Listen for teacher play/pause
    socket.on("video-toggle", ({ isPlaying }) => {
      if (remoteVideoRef.current) {
        if (isPlaying) remoteVideoRef.current.play().catch(() => {});
        else remoteVideoRef.current.pause();
      }
    });

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
        if (!teacherCameraOff) {
          remoteVideoRef.current.srcObject = event.streams[0];
        } else {
          remoteVideoRef.current.srcObject = null;
        }
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
    if (!localStreamRef.current) return;
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    const newState = !cameraOff;
    setCameraOff(newState);
    videoTrack.enabled = newState ? false : true;

    socketRef.current.emit("student-camera-toggle", { isCameraOn: !newState });
  };

  const togglePlay = () => {
    if (playing) localVideoRef.current.pause();
    else localVideoRef.current.play();
    setPlaying(!playing);

    socketRef.current.emit("video-toggle", { isPlaying: !playing, sessionId: sessionData.unique_id });
  };

  const toggleFullScreen = (ref) => {
    if (!ref.current) return;
    if (!document.fullscreenElement) {
      ref.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }

    setTimeout(() => {
      if (ref.current && ref.current.paused) ref.current.play().catch(() => {});
    }, 100);
  };

  const leaveSession = () => {
    if (peerRef.current) peerRef.current.close();
    if (localStreamRef.current)
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    window.location.href = "/";
  };

  if (loading) return <h2 className="text-center mt-10">Loading session...</h2>;
  if (!sessionData)
    return <h2 className="text-center mt-10 text-red-500">Session not found.</h2>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-4xl text-center">
        {!joined ? (
          <>
            <h1 className="text-3xl font-bold mb-2">Student Join Live Session</h1>
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
            <h1 className="text-3xl font-bold mb-6">Student Live Session</h1>
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="rounded-lg bg-black w-full h-60 md:h-80 object-cover"
                />
                {cameraOff && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-white text-lg">
                    Camera Off
                  </div>
                )}
              </div>

              <div className="relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="rounded-lg bg-black w-full h-60 md:h-80 object-cover"
                />
                {teacherCameraOff && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-white text-lg">
                    Teacher Camera Off
                  </div>
                )}
              </div>

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
