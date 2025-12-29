"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = socketAuthMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../../lib/prisma");
const logger_1 = __importDefault(require("../../../utils/logger"));
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
async function socketAuthMiddleware(socket, next) {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            // Allow anonymous users
            socket.data = {
                userId: null,
                username: "Anonymous",
                userType: "anonymous"
            };
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.userType === "staff") {
            const staff = await prisma_1.prisma.staff.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    role: true,
                    isActive: true,
                    isApproved: true,
                },
            });
            if (staff && staff.isActive && staff.isApproved) {
                socket.data = {
                    userId: staff.id,
                    username: staff.username || `${staff.firstName} ${staff.lastName}`,
                    userType: "staff",
                    role: staff.role
                };
            }
        }
        else {
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    isActive: true,
                    isSuspended: true,
                },
            });
            if (user && user.isActive && !user.isSuspended) {
                socket.data = {
                    userId: user.id,
                    username: user.username || user.name || "User",
                    userType: "user"
                };
            }
        }
        next();
    }
    catch (error) {
        logger_1.default.debug("Socket auth error", { error });
        // Allow connection but as anonymous
        socket.data = {
            userId: null,
            username: "Anonymous",
            userType: "anonymous"
        };
        next();
    }
}
//# sourceMappingURL=auth.middleware.js.map