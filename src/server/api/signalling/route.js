import express from "express";
import http from "http";
import { Server } from "socket.io";

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.IO server
const io = new Server(server);

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected");
  console.log(socket.id);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.listen(3001, () => {
  console.log("Signalling server is running on port 3001");
});
