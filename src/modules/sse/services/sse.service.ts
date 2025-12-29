import { Response } from "express";
import { BroadcastNotification } from "../dto/sse.dto";
import { logError, logSocketEvent } from "../../../utils/logger";
import logger from "../../../utils/logger";

interface SSEClient {
  res: Response;
  id: string;
  userId?: string;
}

export class SSEService {
  private clients: Map<string, SSEClient> = new Map();
  private activeBroadcasts: Map<string, BroadcastNotification> = new Map();

  addClient(res: Response, clientId: string, userId?: string): void {
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
    logSocketEvent('sse_connected', clientId, userId);

    res.on("close", () => this.removeClient(clientId));
    res.on("error", (error) => {
      logError(error, { clientId, userId });
      this.removeClient(clientId);
    });
  }

  removeClient(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      this.clients.delete(clientId);
      logSocketEvent('sse_disconnected', clientId, client.userId);
    }
  }

  broadcastStarted(broadcastId: string, broadcastData: BroadcastNotification): void {
    this.activeBroadcasts.set(broadcastId, broadcastData);
    this.broadcastToAll('broadcast:started', broadcastData);
  }

  broadcastEnded(broadcastId: string): void {
    const broadcast = this.activeBroadcasts.get(broadcastId);
    if (broadcast) {
      this.activeBroadcasts.delete(broadcastId);
      this.broadcastToAll('broadcast:ended', { broadcastId, status: 'ENDED' });
    }
  }

  private broadcastToAll(eventType: string, data: any): void {
    const message = JSON.stringify({
      type: eventType,
      data,
      timestamp: new Date().toISOString(),
    });

    const failedClients: string[] = [];
    this.clients.forEach((client, clientId) => {
      try {
        client.res.write(`data: ${message}\n\n`);
      } catch (error) {
        logError(error as Error, { clientId, eventType });
        failedClients.push(clientId);
      }
    });

    failedClients.forEach(id => this.removeClient(id));
    logger.info(`📡 SSE broadcast: ${eventType} to ${this.clients.size} clients`);
  }

  private sendToClient(clientId: string, eventType: string, data: any): void {
    const client = this.clients.get(clientId);
    if (client) {
      const message = JSON.stringify({
        type: eventType,
        data,
        timestamp: new Date().toISOString(),
      });
      try {
        client.res.write(`data: ${message}\n\n`);
      } catch (error) {
        logError(error as Error, { clientId, eventType });
        this.removeClient(clientId);
      }
    }
  }

  getActiveClientCount(): number {
    return this.clients.size;
  }

  getActiveBroadcasts(): BroadcastNotification[] {
    return Array.from(this.activeBroadcasts.values());
  }
}