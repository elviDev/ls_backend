"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastSSEManager = void 0;
const logger_1 = require("../../utils/logger");
/**
 * Manages Server-Sent Events (SSE) connections for broadcast notifications.
 * Allows real-time broadcasting of events to all connected clients.
 */
class BroadcastSSEManager {
    constructor() {
        this.clients = new Map();
    }
    static getInstance() {
        if (!BroadcastSSEManager.instance) {
            BroadcastSSEManager.instance = new BroadcastSSEManager();
        }
        return BroadcastSSEManager.instance;
    }
    /**
     * Register a new SSE client connection
     */
    addClient(res, clientId) {
        // Set SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        // Send initial connection message
        res.write('data: {"type":"connected","message":"SSE connection established"}\n\n');
        this.clients.set(clientId, { res, id: clientId });
        logger_1.logger.info("SSE client connected", { clientId, totalClients: this.clients.size });
        res.on("close", () => {
            this.removeClient(clientId);
        });
        res.on("error", (error) => {
            logger_1.logger.error("SSE client error", { clientId, error });
            this.removeClient(clientId);
        });
    }
    /**
     * Remove a client connection
     */
    removeClient(clientId) {
        if (this.clients.has(clientId)) {
            this.clients.delete(clientId);
            logger_1.logger.info("SSE client disconnected", { clientId, remainingClients: this.clients.size });
        }
    }
    /**
     * Broadcast an event to all connected clients
     */
    broadcastEvent(eventType, data) {
        const message = JSON.stringify({
            type: eventType,
            data,
            timestamp: new Date().toISOString(),
        });
        logger_1.logger.info("Broadcasting SSE event", { eventType, clientCount: this.clients.size });
        let successCount = 0;
        const failedClients = [];
        this.clients.forEach((client, clientId) => {
            try {
                client.res.write(`data: ${message}\n\n`);
                successCount++;
            }
            catch (error) {
                logger_1.logger.error("Failed to send SSE to client", { clientId, error });
                failedClients.push(clientId);
            }
        });
        failedClients.forEach((clientId) => this.removeClient(clientId));
        logger_1.logger.info("SSE broadcast completed", {
            eventType,
            successCount,
            totalClients: this.clients.size
        });
    }
    /**
     * Send broadcast started event
     */
    broadcastStarted(broadcastId, broadcastData) {
        this.broadcastEvent('broadcast:started', {
            broadcastId,
            status: 'LIVE',
            title: broadcastData.title,
            description: broadcastData.description,
            streamUrl: broadcastData.streamUrl,
            liveKitUrl: broadcastData.liveKitUrl,
            liveKitToken: broadcastData.liveKitToken,
        });
    }
    /**
     * Send broadcast ended event
     */
    broadcastEnded(broadcastId, broadcastData) {
        this.broadcastEvent('broadcast:ended', {
            broadcastId,
            status: 'ENDED',
            title: broadcastData.title,
        });
    }
    /**
     * Get active client count
     */
    getActiveClientCount() {
        return this.clients.size;
    }
}
exports.BroadcastSSEManager = BroadcastSSEManager;
exports.default = BroadcastSSEManager.getInstance();
//# sourceMappingURL=broadcast-sse-manager.js.map