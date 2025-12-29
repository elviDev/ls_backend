import { Response } from "express";
/**
 * Manages Server-Sent Events (SSE) connections for broadcast notifications.
 * Allows real-time broadcasting of events to all connected clients.
 */
export declare class BroadcastSSEManager {
    private clients;
    private static instance;
    private constructor();
    static getInstance(): BroadcastSSEManager;
    /**
     * Register a new SSE client connection
     */
    addClient(res: Response, clientId: string): void;
    /**
     * Remove a client connection
     */
    removeClient(clientId: string): void;
    /**
     * Broadcast an event to all connected clients
     */
    broadcastEvent(eventType: string, data: any): void;
    /**
     * Send broadcast started event
     */
    broadcastStarted(broadcastId: string, broadcastData: any): void;
    /**
     * Send broadcast ended event
     */
    broadcastEnded(broadcastId: string, broadcastData: any): void;
    /**
     * Get active client count
     */
    getActiveClientCount(): number;
}
declare const _default: BroadcastSSEManager;
export default _default;
//# sourceMappingURL=broadcast-sse-manager.d.ts.map