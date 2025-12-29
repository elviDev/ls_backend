import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";
import { ChatMessageDto, ChatMessageUpdateDto } from "../dto/chat.dto";
import { logError } from "../../../utils/logger";

export class ChatController {
  constructor(private chatService: ChatService) {}

  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { broadcastId } = req.params;
      const limit = parseInt(req.query.limit as string) || 100;

      const result = await this.chatService.getMessages(broadcastId, limit);
      res.json(result);
    } catch (error: any) {
      logError(error, { module: "chat", action: "Get messages error" });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createMessage(req: Request, res: Response): Promise<void> {
    try {
      const { broadcastId } = req.params;
      const messageData: ChatMessageDto = { ...req.body, broadcastId };
      const user = req.user!;

      const result = await this.chatService.createMessage(
        messageData,
        user.id,
        user.name || user.username || "Anonymous",
        user.profileImage
      );
      res.status(201).json(result);
    } catch (error: any) {
      logError(error, { module: "chat", action: "Create message error" });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateMessage(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;
      const { content }: ChatMessageUpdateDto = req.body;
      const userId = req.user!.id;

      const result = await this.chatService.updateMessage(
        messageId,
        content,
        userId
      );
      res.json(result);
    } catch (error: any) {
      logError(error, { module: "chat", action: "Update message error" });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;
      const userId = req.user!.id;
      const userType = req.user!.userType;

      const result = await this.chatService.deleteMessage(
        messageId,
        userId,
        userType
      );
      res.json(result);
    } catch (error: any) {
      logError(error, { module: "chat", action: "Delete message error" });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;
      const userId = req.user!.id;

      const result = await this.chatService.toggleLike(messageId, userId);
      res.json(result);
    } catch (error: any) {
      logError(error, { module: "chat", action: "Toggle like error" });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async togglePin(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;

      const result = await this.chatService.togglePin(messageId);
      res.json(result);
    } catch (error: any) {
      logError(error, { module: "chat", action: "Toggle pin error" });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
