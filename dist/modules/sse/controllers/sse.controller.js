"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEController = void 0;
const logger_1 = require("../../../utils/logger");
class SSEController {
    constructor(sseService) {
        this.sseService = sseService;
    }
    async connect(req, res) {
        try {
            const clientId = req.query.clientId || `client_${Date.now()}`;
            const userId = req.user?.id;
            this.sseService.addClient(res, clientId, userId);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'sse', action: 'connect' });
            res.status(500).json({ error: error.message });
        }
    }
    async getStats(req, res) {
        try {
            const stats = {
                activeClients: this.sseService.getActiveClientCount(),
                activeBroadcasts: this.sseService.getActiveBroadcasts()
            };
            res.json(stats);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'sse', action: 'getStats' });
            res.status(500).json({ error: error.message });
        }
    }
}
exports.SSEController = SSEController;
//# sourceMappingURL=sse.controller.js.map