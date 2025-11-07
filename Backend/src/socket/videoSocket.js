export const videoSocket = (io, socket) => {
  socket.on("join-session", (sessionId) => {
    socket.join(sessionId);
    console.log(`🟢 User joined session: ${sessionId}`);
    socket.to(sessionId).emit("user-joined", socket.id);
  });

  socket.on("offer", ({sessionId, offer}) => {
    socket.to(sessionId).emit("offer", offer);
  })

  socket.on("answer", ({sessionId, answer}) => {
    socket.to(sessionId).emit("answer", answer)
  })

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
};
