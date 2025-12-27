import { Response } from 'express';

interface SSEClient {
  res: Response;
  id: string;
}

/**
 * Manages Server-Sent Events (SSE) connections for broadcast notifications.
 * Allows real-time broadcasting of events to all connected clients.
 */
export class BroadcastSSEManager {
  private clients: Map<string, SSEClient> = new Map();
  private static instance: BroadcastSSEManager;

  private constructor() {}

  static getInstance(): BroadcastSSEManager {
    if (!BroadcastSSEManager.instance) {
      BroadcastSSEManager.instance = new BroadcastSSEManager();
    }
    return BroadcastSSEManager.instance;
  }

  /**
   * Register a new SSE client connection
   */
  addClient(res: Response, clientId: string): void {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Send initial connection message
    res.write('data: {"type":"connected","message":"SSE connection established"}\n\n');

    this.clients.set(clientId, { res, id: clientId });

    console.log(`📡 [SSE] Client connected: ${clientId}, Total: ${this.clients.size}`);

    // Handle client disconnect
    res.on('close', () => {
      this.removeClient(clientId);
    });

    res.on('error', (error) => {
      console.error(`❌ [SSE] Error on client ${clientId}:`, error);
      this.removeClient(clientId);
    });
  }

  /**
   * Remove a client connection
   */
  removeClient(clientId: string): void {
    if (this.clients.has(clientId)) {
      this.clients.delete(clientId);
      console.log(`📴 [SSE] Client disconnected: ${clientId}, Remaining: ${this.clients.size}`);
    }
  }

  /**
   * Broadcast an event to all connected clients
   */
  broadcastEvent(eventType: string, data: any): void {
    const message = JSON.stringify({
      type: eventType,
      data,
      timestamp: new Date().toISOString(),
    });

    console.log(`📢 [SSE] Broadcasting to ${this.clients.size} clients:`, { eventType, clientCount: this.clients.size });

    let successCount = 0;
    const failedClients: string[] = [];

    this.clients.forEach((client, clientId) => {
      try {
        client.res.write(`data: ${message}\n\n`);
        successCount++;
      } catch (error) {
        console.error(`❌ [SSE] Failed to send to client ${clientId}:`, error);
        failedClients.push(clientId);
      }
    });

    // Clean up failed clients
    failedClients.forEach((clientId) => this.removeClient(clientId));

    console.log(`✅ [SSE] Event sent successfully to ${successCount}/${this.clients.size} clients`);
  }

  /**
   * Send broadcast started event
   */
  broadcastStarted(broadcastId: string, broadcastData: any): void {
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
  broadcastEnded(broadcastId: string, broadcastData: any): void {
    this.broadcastEvent('broadcast:ended', {
      broadcastId,
      status: 'ENDED',
      title: broadcastData.title,
    });
  }

  /**
   * Get active client count
   */
  getActiveClientCount(): number {
    return this.clients.size;
  }
}

export default BroadcastSSEManager.getInstance();
