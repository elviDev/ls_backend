import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import broadcastSSEManager from "./infrastructure/sse/broadcast-sse-manager";

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

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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

// Notify backend that a broadcast started
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
    console.error("❌ [Backend] Error handling broadcast started notification:", error);
    res.status(500).json({ error: "Failed to send broadcast event" });
  }
});

// Notify backend that a broadcast ended
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
    console.error("❌ [Backend] Error handling broadcast ended notification:", error);
    res.status(500).json({ error: "Failed to send broadcast event" });
  }
});

// Basic chat functionality
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
    // Broadcast to all clients in the room, including sender
    io.to(`broadcast-${data.broadcastId}`).emit("chat-message", data);
    console.log(`Chat message in broadcast ${data.broadcastId}:`, data.message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`💬 Chat Server running on port ${PORT}`);
  console.log(`📡 SSE Broadcast Events available at http://localhost:${PORT}/api/broadcasts/events`);
});