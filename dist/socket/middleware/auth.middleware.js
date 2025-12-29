"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = socketAuthMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../lib/prisma");
const logger_1 = require("../../utils/logger");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
async function socketAuthMiddleware(socket, next) {
    try {
        // Get token from handshake auth or query
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        if (!token) {
            // No token = anonymous user
            logger_1.logger.info("🔓 Anonymous socket connection", { socketId: socket.id });
            socket.data = {
                userId: "anonymous",
                username: "Anonymous",
                userType: "user",
                role: "USER",
            };
            next();
            return;
        }
        // Verify JWT token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        let userData = null;
        if (decoded.userType === "staff") {
            const staff = await prisma_1.prisma.staff.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    profileImage: true,
                    role: true,
                    isActive: true,
                    isApproved: true,
                },
            });
            if (staff && staff.isActive && staff.isApproved) {
                userData = {
                    userId: staff.id,
                    username: `${staff.firstName} ${staff.lastName}`,
                    userType: "staff",
                    role: staff.role,
                };
            }
        }
        else {
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    username: true,
                    profileImage: true,
                    isActive: true,
                    isSuspended: true,
                },
            });
            if (user && user.isActive && !user.isSuspended) {
                userData = {
                    userId: user.id,
                    username: user.name || user.username || "User",
                    userType: "user",
                    role: "USER",
                };
            }
        }
        if (userData) {
            socket.data = userData;
            logger_1.logger.info("🔐 Authenticated socket connection", {
                socketId: socket.id,
                userId: userData.userId,
                username: userData.username,
                userType: userData.userType,
                role: userData.role,
            });
        }
        else {
            logger_1.logger.warn("⚠️ Invalid user in token, using anonymous", { socketId: socket.id });
            socket.data = {
                userId: "anonymous",
                username: "Anonymous",
                userType: "user",
                role: "USER",
            };
        }
        next();
    }
    catch (error) {
        logger_1.logger.warn("🔓 Token validation failed, using anonymous", {
            socketId: socket.id,
            error: error instanceof Error ? error.message : "Unknown error",
        });
        // On error, allow connection but as anonymous
        socket.data = {
            userId: "anonymous",
            username: "Anonymous",
            userType: "user",
            role: "USER",
        };
        next();
    }
}
//# sourceMappingURL=auth.middleware.js.map