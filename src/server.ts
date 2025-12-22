import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// Infrastructure
import { InMemoryMessageRepository, InMemoryUserRepository } from './infrastructure/repositories';
import { ChatSocketController, ChatHttpController } from './infrastructure/web/controllers';

// Use Cases
import {
  SendMessage,
  GetChatHistory,
  LikeMessage,
  JoinChat,
  LeaveChat,
  ModerateMessage
} from './application/use-cases';

const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
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
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const chatSocketController = new ChatSocketController(
  io,
  userRepo,
  sendMessage,
  getChatHistory,
  likeMessage,
  joinChat,
  leaveChat,
  moderateMessage
);

const chatHttpController = new ChatHttpController(getChatHistory);

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'chat' });
});

app.get('/chat/:broadcastId/history', async (req, res) => {
  const { broadcastId } = req.params;
  const limit = parseInt(req.query.limit as string) || 100;
  const result = await chatHttpController.getHistory(broadcastId, limit);
  res.json(result);
});

// Socket Events
io.on('connection', (socket) => {
  chatSocketController.handleConnection(socket);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`💬 Chat Server running on port ${PORT}`);
});