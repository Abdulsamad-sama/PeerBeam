import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.emit("connection-status", {
    isConnected: true,
  });
  socket.on("disconnect", () => {
    socket.emit("connection-status", { isConnected: false });
  });

  socket.emit("me", { uid: socket.id });

  socket.on("sender-join", (data) => {
    socket.join(data.uid);
  });
  socket.on("receiver-join", (data) => {
    socket.join(data.uid);
    socket.in(data.sender_uid).emit("init", data.uid);
  });
  socket.on("file-meta", (data) => {
    socket.in(data.uid).emit("file-meta", data.metadata);
  });
  socket.on("file-start", (data) => {
    socket.in(data.uid).emit("file-share", {});
  });
  socket.on("file-raw", (data) => {
    socket.in(data.uid).emit("file-share", data.buffer);
  });
});

httpServer.listen(3001, () => {
  console.log("Server is running on port 3001");
});
