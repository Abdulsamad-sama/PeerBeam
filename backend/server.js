import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Socket } from "socket.io";
import { emit } from "process";

const app = express();
const Server = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

const io = Socket();
app.use(express.static(path.join(__dirname, "src")));

// io.on("connection", (socket) => {
//   socket.on("sender-join", (data) => {
//     socket.join(data.uid);
//   });
//   socket.on("receiver-join", (data) => {
//     socket.join(data.uid);
//     socket.in(data.sender_uid), emit("init", data.uid);
//   });
//   socket.on("file-meta", (data) => {
//     socket.in(data.uid), emit("file-meta", data.metedata);
//   });
//   socket.on("file-start", (data) => {
//     socket.in(data.uid), emit("file-share", {});
//   });
//   socket.on("file-raw", (data) => {
//     socket.in(data.uid), emit("file-share", data.buffer);
//   });
// });

Server.listen(3001);
