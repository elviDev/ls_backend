"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveKitService = void 0;
const livekit_server_sdk_1 = require("livekit-server-sdk");
class LiveKitService {
    getApiKey() {
        const apiKey = process.env.LIVEKIT_API_KEY;
        if (!apiKey) {
            throw new Error('LIVEKIT_API_KEY environment variable is not set');
        }
        return apiKey;
    }
    getApiSecret() {
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        if (!apiSecret) {
            throw new Error('LIVEKIT_API_SECRET environment variable is not set');
        }
        return apiSecret;
    }
    async generateToken(userId, roomName, userName, role = 'listener') {
        const token = new livekit_server_sdk_1.AccessToken(this.getApiKey(), this.getApiSecret(), {
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
        }
        else {
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
exports.LiveKitService = LiveKitService;
//# sourceMappingURL=livekit.service.js.map