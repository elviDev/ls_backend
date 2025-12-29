import { Response } from "express";
import { BroadcastNotification } from "../dto/sse.dto";
export declare class SSEService {
    private clients;
    private activeBroadcasts;
    addClient(res: Response, clientId: string, userId?: string): void;
    removeClient(clientId: string): void;
    broadcastStarted(broadcastId: string, broadcastData: BroadcastNotification): void;
    broadcastEnded(broadcastId: string): void;
    private broadcastToAll;
    private sendToClient;
    getActiveClientCount(): number;
    getActiveBroadcasts(): BroadcastNotification[];
}
//# sourceMappingURL=sse.service.d.ts.map