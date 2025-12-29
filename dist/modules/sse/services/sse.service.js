"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEService = void 0;
const logger_1 = require("../../../utils/logger");
const logger_2 = __importDefault(require("../../../utils/logger"));
class SSEService {
    constructor() {
        this.clients = new Map();
        this.activeBroadcasts = new Map();
    }
    addClient(res, clientId, userId) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.write('data: {"type":"connected","message":"SSE connection established"}\n\n');
        // Send current live broadcasts to new client
        this.activeBroadcasts.forEach((broadcast) => {
            this.sendToClient(clientId, 'broadcast:live', broadcast);
        });
        this.clients.set(clientId, { res, id: clientId, userId });
        (0, logger_1.logSocketEvent)('sse_connected', clientId, userId);
        res.on("close", () => this.removeClient(clientId));
        res.on("error", (error) => {
            (0, logger_1.logError)(error, { clientId, userId });
            this.removeClient(clientId);
        });
    }
    removeClient(clientId) {
        const client = this.clients.get(clientId);
        if (client) {
            this.clients.delete(clientId);
            (0, logger_1.logSocketEvent)('sse_disconnected', clientId, client.userId);
        }
    }
    broadcastStarted(broadcastId, broadcastData) {
        this.activeBroadcasts.set(broadcastId, broadcastData);
        this.broadcastToAll('broadcast:started', broadcastData);
    }
    broadcastEnded(broadcastId) {
        const broadcast = this.activeBroadcasts.get(broadcastId);
        if (broadcast) {
            this.activeBroadcasts.delete(broadcastId);
            this.broadcastToAll('broadcast:ended', { broadcastId, status: 'ENDED' });
        }
    }
    broadcastToAll(eventType, data) {
        const message = JSON.stringify({
            type: eventType,
            data,
            timestamp: new Date().toISOString(),
        });
        const failedClients = [];
        this.clients.forEach((client, clientId) => {
            try {
                client.res.write(`data: ${message}\n\n`);
            }
            catch (error) {
                (0, logger_1.logError)(error, { clientId, eventType });
                failedClients.push(clientId);
            }
        });
        failedClients.forEach(id => this.removeClient(id));
        logger_2.default.info(`📡 SSE broadcast: ${eventType} to ${this.clients.size} clients`);
    }
    sendToClient(clientId, eventType, data) {
        const client = this.clients.get(clientId);
        if (client) {
            const message = JSON.stringify({
                type: eventType,
                data,
                timestamp: new Date().toISOString(),
            });
            try {
                client.res.write(`data: ${message}\n\n`);
            }
            catch (error) {
                (0, logger_1.logError)(error, { clientId, eventType });
                this.removeClient(clientId);
            }
        }
    }
    getActiveClientCount() {
        return this.clients.size;
    }
    getActiveBroadcasts() {
        return Array.from(this.activeBroadcasts.values());
    }
}
exports.SSEService = SSEService;
//# sourceMappingURL=sse.service.js.map