"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastNotificationSchema = exports.SSEEventSchema = void 0;
const zod_1 = require("zod");
exports.SSEEventSchema = zod_1.z.object({
    type: zod_1.z.string(),
    data: zod_1.z.any(),
    timestamp: zod_1.z.string(),
});
exports.BroadcastNotificationSchema = zod_1.z.object({
    broadcastId: zod_1.z.string(),
    status: zod_1.z.enum(['LIVE', 'ENDED']),
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    streamUrl: zod_1.z.string().optional(),
    liveKitUrl: zod_1.z.string().optional(),
    liveKitToken: zod_1.z.string().optional(),
});
//# sourceMappingURL=sse.dto.js.map