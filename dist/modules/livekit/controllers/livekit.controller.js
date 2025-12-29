"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveKitController = void 0;
const livekit_service_1 = require("../services/livekit.service");
const token_dto_1 = require("../dto/token.dto");
class LiveKitController {
    constructor() {
        this.liveKitService = new livekit_service_1.LiveKitService();
    }
    async generateToken(req, res) {
        try {
            const validatedData = token_dto_1.TokenRequestSchema.parse(req.body);
            const { userId, roomName, userName, role } = validatedData;
            const token = await this.liveKitService.generateToken(userId, roomName, userName, role);
            res.json({ token });
        }
        catch (error) {
            console.error('Error generating LiveKit token:', error);
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    error: 'Invalid request data',
                    details: error.errors
                });
            }
            res.status(500).json({
                error: 'Failed to generate token'
            });
        }
    }
}
exports.LiveKitController = LiveKitController;
//# sourceMappingURL=livekit.controller.js.map