import { Server } from "socket.io";
import { ChatMessageDto } from "../dto/chat.dto";
export declare class ChatService {
    private connectedUsers;
    getMessages(broadcastId: string, limit?: number): Promise<{
        messages: {
            id: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            broadcastId: string;
            userAvatar: string | null;
            messageType: string;
            replyTo: string | null;
            isPinned: boolean;
            isModerated: boolean;
            moderationReason: string | null;
            moderatedBy: string | null;
            moderatedAt: Date | null;
            isHighlighted: boolean;
            likes: number;
            likedBy: string | null;
            emojis: string | null;
            timestamp: Date;
        }[];
    }>;
    createMessage(messageData: ChatMessageDto, userId: string, username: string, userAvatar?: string): Promise<{
        message: {
            id: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            broadcastId: string;
            userAvatar: string | null;
            messageType: string;
            replyTo: string | null;
            isPinned: boolean;
            isModerated: boolean;
            moderationReason: string | null;
            moderatedBy: string | null;
            moderatedAt: Date | null;
            isHighlighted: boolean;
            likes: number;
            likedBy: string | null;
            emojis: string | null;
            timestamp: Date;
        };
    }>;
    updateMessage(messageId: string, content: string, userId: string): Promise<{
        message: {
            id: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            broadcastId: string;
            userAvatar: string | null;
            messageType: string;
            replyTo: string | null;
            isPinned: boolean;
            isModerated: boolean;
            moderationReason: string | null;
            moderatedBy: string | null;
            moderatedAt: Date | null;
            isHighlighted: boolean;
            likes: number;
            likedBy: string | null;
            emojis: string | null;
            timestamp: Date;
        };
    }>;
    deleteMessage(messageId: string, userId: string, userType?: string): Promise<{
        success: boolean;
    }>;
    toggleLike(messageId: string, userId: string): Promise<{
        message: {
            id: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            broadcastId: string;
            userAvatar: string | null;
            messageType: string;
            replyTo: string | null;
            isPinned: boolean;
            isModerated: boolean;
            moderationReason: string | null;
            moderatedBy: string | null;
            moderatedAt: Date | null;
            isHighlighted: boolean;
            likes: number;
            likedBy: string | null;
            emojis: string | null;
            timestamp: Date;
        };
        likes: number;
        likedBy: string[];
    }>;
    togglePin(messageId: string): Promise<{
        message: {
            id: string;
            username: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            broadcastId: string;
            userAvatar: string | null;
            messageType: string;
            replyTo: string | null;
            isPinned: boolean;
            isModerated: boolean;
            moderationReason: string | null;
            moderatedBy: string | null;
            moderatedAt: Date | null;
            isHighlighted: boolean;
            likes: number;
            likedBy: string | null;
            emojis: string | null;
            timestamp: Date;
        };
        isPinned: boolean;
    }>;
    addUser(socketId: string, userId: string, username: string): void;
    removeUser(socketId: string): void;
    getOnlineCount(): number;
    broadcastOnlineCount(io: Server): void;
    sendMessageViaSocket(io: Server, messageData: ChatMessageDto, userId: string, username: string, userAvatar?: string): Promise<void>;
    toggleLikeViaSocket(io: Server, messageId: string, userId: string): Promise<void>;
    togglePinViaSocket(io: Server, messageId: string): Promise<void>;
}
//# sourceMappingURL=chat.service.d.ts.map