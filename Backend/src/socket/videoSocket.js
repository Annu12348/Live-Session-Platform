export const videoSocket = (io, socket) => {
  socket.on("join-session", (sessionId) => {
    socket.join(sessionId);
    console.log(`🟢 User joined session: ${sessionId}`);
    socket.to(sessionId).emit("user-joined", socket.id);
  });

  
  socket.on("offer", ({ sessionId, offer }) => {
    console.log("📡 Offer sent to student");
    socket.to(sessionId).emit("offer", { offer });
  });

  
  socket.on("answer", ({ sessionId, answer }) => {
    console.log("📡 Answer sent to teacher");
    socket.to(sessionId).emit("answer", { answer });
  });

  socket.on("ice-candidate", ({ sessionId, candidate }) => {
    socket.to(sessionId).emit("ice-candidate", { candidate });
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
};

