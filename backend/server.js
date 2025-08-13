// // server.js

// const next = require("next");
// const { createServer } = require("http");
// const { Server } = require("socket.io");

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = createServer((req, res) => {
//     handle(req, res);
//   });

//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id);

//     // Create or join a room
//     socket.on("join-room", (roomId) => {
//       socket.join(roomId);
//       socket.to(roomId).emit("peer-connected", socket.id);
//     });

//     // WebRTC Signaling
//     socket.on("offer", ({ roomId, offer }) => {
//       socket.to(roomId).emit("offer", { sender: socket.id, offer });
//     });

//     socket.on("answer", ({ roomId, answer }) => {
//       socket.to(roomId).emit("answer", { sender: socket.id, answer });
//     });

//     socket.on("ice-candidate", ({ roomId, candidate }) => {
//       socket.to(roomId).emit("ice-candidate", { sender: socket.id, candidate });
//     });

//     // File metadata sharing (optional)
//     socket.on("file-meta", ({ roomId, meta }) => {
//       socket.to(roomId).emit("file-meta", { sender: socket.id, meta });
//     });

//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
//   });

//   server.listen(3000, () => {
//     console.log("> Backend server running on http://localhost:3000");
//   });
// });

// // .....................................................................................
// // // server.js
// // const next = require("next");
// // const { createServer } = require("http");
// // const { Server } = require("socket.io");
// // const express = require("express");

// // const dev = process.env.NODE_ENV !== "production";
// // const app = next({ dev });
// // const handle = app.getRequestHandler();

// // // const app = express();

// // app.prepare().then(() => {
// //   const server = createServer((req, res) => {
// //     handle(req, res);
// //   });

// //   const io = new Server(server);

// //   io.on("connection", (socket) => {
// //     console.log("Client connected:", socket.id);

// //     socket.on("send-offer", (data) =>
// //       socket.broadcast.emit("receive-offer", data)
// //     );
// //     socket.on("send-answer", (data) =>
// //       socket.broadcast.emit("receive-answer", data)
// //     );
// //     socket.on("ice-candidate", (data) =>
// //       socket.broadcast.emit("ice-candidate", data)
// //     );

// //     socket.on("disconnect", () => {
// //       console.log("Client disconnected:", socket.id);
// //     });
// //   });

// //   server.listen(3001, () => {
// //     console.log("> Ready on http://localhost:3001");
// //   });
// // });
// // // This file sets up a Next.js server with Socket.IO for real-time communication.
// // // It listens for WebRTC signaling messages and handles client connections and disconnections.

// // // .................................................................................................................................................

// // // server.js
// // const { createServer } = require("http");
// // const { Server } = require("socket.io");

// // const port = process.env.PORT || 3001;

// // const httpServer = createServer();
// // const io = new Server(httpServer, {
// //   cors: {
// //     origin: "*", // allow requests from frontend (adjust in production)
// //   },
// // });

// // io.on("connection", (socket) => {
// //   console.log("New client connected:", socket.id);

// //   // Custom signaling events
// //   socket.on("send-offer", (data) => {
// //     socket.broadcast.emit("receive-offer", data);
// //   });

// //   socket.on("send-answer", (data) => {
// //     socket.broadcast.emit("receive-answer", data);
// //   });

// //   socket.on("ice-candidate", (data) => {
// //     socket.broadcast.emit("ice-candidate", data);
// //   });

// //   socket.on("disconnect", () => {
// //     console.log("Client disconnected:", socket.id);
// //   });
// // });

// // httpServer.listen(port, () => {
// //   console.log(`Socket.IO server running on port ${port}`);
// // });

// // ...................................................
