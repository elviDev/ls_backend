export interface ChatMessageDto {
    content: string;
    broadcastId: string;
    messageType?: string;
    replyTo?: string;
}
export interface ChatMessageUpdateDto {
    content: string;
}
export interface MessageActionDto {
    messageId: string;
}
//# sourceMappingURL=chat.dto.d.ts.map