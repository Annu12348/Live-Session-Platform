import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDataBase from "./src/db/db.js";
import http from "http";
import { Server } from "socket.io";
import { videoSocket } from "./src/socket/videoSocket.js";

connectDataBase();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);
  videoSocket(io, socket);
});

server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
