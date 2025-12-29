import { AccessToken } from 'livekit-server-sdk';

export class LiveKitService {
  private getApiKey(): string {
    const apiKey = process.env.LIVEKIT_API_KEY;
    if (!apiKey) {
      throw new Error('LIVEKIT_API_KEY environment variable is not set');
    }
    return apiKey;
  }

  private getApiSecret(): string {
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    if (!apiSecret) {
      throw new Error('LIVEKIT_API_SECRET environment variable is not set');
    }
    return apiSecret;
  }

  async generateToken(userId: string, roomName: string, userName: string, role: 'broadcaster' | 'listener' = 'listener') {
    const token = new AccessToken(this.getApiKey(), this.getApiSecret(), {
      identity: userId,
      name: userName,
    });

    // Set permissions based on role
    if (role === 'broadcaster') {
      token.addGrant({
        room: roomName,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });
    } else {
      token.addGrant({
        room: roomName,
        roomJoin: true,
        canPublish: false,
        canSubscribe: true,
        canPublishData: false,
      });
    }

    return token.toJwt();
  }
}