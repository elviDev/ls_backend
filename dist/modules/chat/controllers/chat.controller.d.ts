import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    getMessages(req: Request, res: Response): Promise<void>;
    createMessage(req: Request, res: Response): Promise<void>;
    updateMessage(req: Request, res: Response): Promise<void>;
    deleteMessage(req: Request, res: Response): Promise<void>;
    toggleLike(req: Request, res: Response): Promise<void>;
    togglePin(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=chat.controller.d.ts.map