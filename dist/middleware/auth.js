"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireAuth = requireAuth;
exports.requireStaff = requireStaff;
exports.requireModerator = requireModerator;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const logger_1 = __importDefault(require("../utils/logger"));
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            next();
            return;
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
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
                req.user = {
                    id: staff.id,
                    email: staff.email,
                    name: `${staff.firstName} ${staff.lastName}`,
                    username: staff.username,
                    profileImage: staff.profileImage,
                    userType: "staff",
                    role: staff.role,
                    isApproved: staff.isApproved,
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
                req.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    username: user.username,
                    profileImage: user.profileImage,
                    userType: "user",
                };
            }
        }
        next();
    }
    catch (error) {
        logger_1.default.debug("Auth middleware error", { error });
        next();
    }
}
function requireAuth(req, res, next) {
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    next();
}
function requireStaff(req, res, next) {
    console.log(req.user);
    if (!req.user || req.user.userType !== "staff") {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
    }
    // Admin is considered staff
    const staffRoles = ["ADMIN", "HOST", "PRODUCER", "MODERATOR"];
    if (!req.user.role || !staffRoles.includes(req.user.role)) {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
    }
    console.log("Here!!!!");
    next();
}
function requireModerator(req, res, next) {
    if (!req.user || req.user.userType !== "staff") {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
    }
    const moderatorRoles = ["ADMIN", "HOST", "PRODUCER"];
    if (!req.user.role || !moderatorRoles.includes(req.user.role)) {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
    }
    next();
}
//# sourceMappingURL=auth.js.map