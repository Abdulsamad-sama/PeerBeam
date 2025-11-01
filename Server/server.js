import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const app = express();
app.use(express.json()); // needed so POST /force-disconnect can receive JSON
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001


const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "https://peer-beam-five.vercel.app",
    methods: ["GET", "POST"], 
    credentials: true,
  },
});

//to know the server works
app.get("/", (req, res) => {
  res.send("server is running on Render");
});

// HTTP endpoint to force-disconnect a socket by id (useful for admin / button)
app.post("/force-disconnect", (req, res) => {
  const { socketId } = req.body;
  if (!socketId)
    return res
      .status(400)
      .json({ success: false, message: "socketId required" });
  const sock = io.sockets.sockets.get(socketId);
  if (!sock)
    return res
      .status(404)
      .json({ success: false, message: "socket not found" });
  try {
    sock.disconnect(true);
    return res.json({ success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "failed to disconnect" });
  }
});

io.on("connection", (socket) => {
  // inform client about low-level connection status
  socket.emit("connection-status", { isUserConnected: true });

  socket.on("disconnect", (reason) => {
    // nothing to emit to disconnected client; optionally broadcast
    // Broadcast to other sockets that this id disconnected, if needed:
    socket.broadcast.emit("peer-disconnected", { id: socket.id, reason });
  });

  socket.emit("me", { uid: socket.id });

  socket.on("sender-join", (data, ack) => {
    socket.join(data.uid);
    if (typeof ack === "function") ack({ success: true });
  });

  socket.on("receiver-join", (data, ack) => {
    socket.join(data.uid);
    const senderRoomExists = io.sockets.adapter.rooms.has(data.sender_uid);
    // notify sender(s) in the sender_uid room that a receiver joined
    socket.in(data.sender_uid).emit("init", data.uid);
    if (typeof ack === "function") {
      if (senderRoomExists) ack({ success: true });
      else ack({ success: false, message: "Sender not connected" });
    }
  });

  // optional: support explicit leave from client
  socket.on("receiver-leave", (data) => {
    try {
      // remove the socket from its own room (server-side leave)
      socket.leave(data.uid);
    } catch (err) {
      // ignore
    }
  });

  socket.on("file-meta", (data) => {
    socket.in(data.uid).emit("file-meta", data.metadata);
  });
  socket.on("file-progress", (data) => {
    socket.in(data.uid).emit("file-progress", data.progressData);
  });
  socket.on("file-start", (data) => {
    socket.in(data.uid).emit("file-share", {});
  });
  socket.on("file-raw", (data) => {
    socket.in(data.uid).emit("file-raw", data); // emit object with name & chunk or buffer as used by client
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
