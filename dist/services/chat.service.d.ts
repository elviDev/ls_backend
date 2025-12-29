import { Server } from "socket.io";
interface ChatMessageData {
    content: string;
    messageType?: "message" | "announcement";
    userId: string;
    username: string;
    userAvatar?: string;
    broadcastId: string;
}
export declare class ChatService {
    private connectedUsers;
    addUser(socketId: string, userId: string, username: string): void;
    removeUser(socketId: string): void;
    getOnlineCount(): number;
    broadcastOnlineCount(io: Server): void;
    sendMessage(io: Server, messageData: ChatMessageData): Promise<void>;
    toggleLike(io: Server, messageId: string, userId: string): Promise<void>;
    togglePin(io: Server, messageId: string): Promise<void>;
}
export declare const chatService: ChatService;
export {};
//# sourceMappingURL=chat.service.d.ts.map