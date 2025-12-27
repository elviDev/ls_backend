<<<<<<< HEAD
=======
import "dotenv/config";
>>>>>>> f57c8a7 (feat: add backend support for LiveKit radio broadcasting)
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
<<<<<<< HEAD
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
=======

// Infrastructure
import {
  InMemoryMessageRepository,
  InMemoryUserRepository,
} from "./infrastructure/repositories";
import {
  ChatSocketController,
  ChatHttpController,
} from "./infrastructure/web/controllers";
import broadcastSSEManager from "./infrastructure/sse/broadcast-sse-manager";

// Use Cases
import {
  SendMessage,
  GetChatHistory,
  LikeMessage,
  JoinChat,
  LeaveChat,
  ModerateMessage,
} from "./application/use-cases";

const app = express();
const server = createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Dependency Injection
const messageRepo = new InMemoryMessageRepository();
const userRepo = new InMemoryUserRepository();

const sendMessage = new SendMessage(messageRepo);
const getChatHistory = new GetChatHistory(messageRepo);
const likeMessage = new LikeMessage(messageRepo);
const joinChat = new JoinChat(userRepo);
const leaveChat = new LeaveChat(userRepo);
const moderateMessage = new ModerateMessage(messageRepo);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
>>>>>>> f57c8a7 (feat: add backend support for LiveKit radio broadcasting)
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Socket.IO for chat
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-broadcast", (broadcastId) => {
    socket.join(`broadcast-${broadcastId}`);
    console.log(`User ${socket.id} joined broadcast ${broadcastId}`);
  });

  socket.on("leave-broadcast", (broadcastId) => {
    socket.leave(`broadcast-${broadcastId}`);
    console.log(`User ${socket.id} left broadcast ${broadcastId}`);
  });

  socket.on("chat-message", (data) => {
    socket.to(`broadcast-${data.broadcastId}`).emit("chat-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
=======
const chatHttpController = new ChatHttpController(getChatHistory);

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "chat" });
});

// SSE endpoint for broadcast notifications
app.get("/api/broadcasts/events", (req, res) => {
  const clientId = `client-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
  console.log(`🔗 [SSE] New client connecting: ${clientId}`);
  broadcastSSEManager.addClient(res, clientId);
});

// Get active SSE connections count (for monitoring)
app.get("/api/broadcasts/events/stats", (req, res) => {
  res.json({
    activeConnections: broadcastSSEManager.getActiveClientCount(),
    timestamp: new Date().toISOString(),
  });
});

// Notify backend that a broadcast started (called from frontend API)
app.post("/api/broadcasts/notify/started", (req, res) => {
  try {
    const broadcastData = req.body;
    console.log("📢 [Backend] Received broadcast started notification:", {
      id: broadcastData.id,
      title: broadcastData.title,
    });
    broadcastSSEManager.broadcastStarted(broadcastData.id, broadcastData);
    res.json({
      success: true,
      message: "Broadcast started event sent to all clients",
    });
  } catch (error) {
    console.error(
      "❌ [Backend] Error handling broadcast started notification:",
      error
    );
    res.status(500).json({ error: "Failed to send broadcast event" });
  }
});

// Notify backend that a broadcast ended (called from frontend API)
app.post("/api/broadcasts/notify/ended", (req, res) => {
  try {
    const broadcastData = req.body;
    console.log("📢 [Backend] Received broadcast ended notification:", {
      id: broadcastData.id,
      title: broadcastData.title,
    });
    broadcastSSEManager.broadcastEnded(broadcastData.id, broadcastData);
    res.json({
      success: true,
      message: "Broadcast ended event sent to all clients",
    });
  } catch (error) {
    console.error(
      "❌ [Backend] Error handling broadcast ended notification:",
      error
    );
    res.status(500).json({ error: "Failed to send broadcast event" });
  }
});

app.get("/chat/:broadcastId/history", async (req, res) => {
  const { broadcastId } = req.params;
  const limit = parseInt(req.query.limit as string) || 100;
  const result = await chatHttpController.getHistory(broadcastId, limit);
  res.json(result);
});

// Socket Events
io.on("connection", (socket) => {
  chatSocketController.handleConnection(socket);
>>>>>>> f57c8a7 (feat: add backend support for LiveKit radio broadcasting)
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for connections`);
=======
  console.log(`💬 Chat Server running on port ${PORT}`);
  console.log(
    `📡 SSE Broadcast Events available at http://localhost:${PORT}/api/broadcasts/events`
  );
>>>>>>> f57c8a7 (feat: add backend support for LiveKit radio broadcasting)
});
