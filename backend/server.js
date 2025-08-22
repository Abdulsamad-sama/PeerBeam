import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server as SocketIOServer } from "socket.io";

const app = express();
const httpServer = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

const io = new SocketIOServer(httpServer);

io.on("connection", (socket) => {
  socket.on("sender-join", (data) => {
    socket.join(data.uid);
  });
  socket.on("receiver-join", (data) => {
    socket.join(data.uid);
    socket.to(data.sender_uid).emit("init", data.uid);
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

httpServer.listen(3001);
