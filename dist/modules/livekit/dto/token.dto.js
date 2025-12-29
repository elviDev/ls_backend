"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRequestSchema = void 0;
const zod_1 = require("zod");
exports.TokenRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'User ID is required'),
    roomName: zod_1.z.string().min(1, 'Room name is required'),
    userName: zod_1.z.string().min(1, 'User name is required'),
    role: zod_1.z.enum(['broadcaster', 'listener']).default('listener'),
});
//# sourceMappingURL=token.dto.js.map