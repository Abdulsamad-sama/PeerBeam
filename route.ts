import express, { Application, Request, Response } from "express";
import http, { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

// Initialize Express and HTTP server
const app: Application = express();
const server: HTTPServer = http.createServer(app);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.IO server
const io: SocketIOServer = new SocketIOServer(server);

// Handle Socket.IO connections
io.on("connect", (socket: Socket) => {
  console.log("A user connected");
  console.log(socket.id);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Signalling server is running");
});

server.listen(3001, () => {
  console.log("Signalling server is running on port 3001");
});

export default app;
