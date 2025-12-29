"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastSchema = exports.podcastSchema = exports.registerSchema = exports.loginSchema = exports.validate = void 0;
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                logger_1.logger.warn("Validation error", { errors: error.errors });
                res.status(400).json({
                    error: "Validation failed",
                    details: error.errors
                });
                return;
            }
            next(error);
        }
    };
};
exports.validate = validate;
// Common validation schemas
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
    rememberMe: zod_1.z.boolean().optional(),
});
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    name: zod_1.z.string().min(1).optional(),
    username: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    confirmPassword: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
}).refine((data) => {
    if (data.confirmPassword && data.password !== data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
exports.podcastSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    image: zod_1.z.string().url().optional(),
    host: zod_1.z.string().min(1),
    genreId: zod_1.z.string().optional(),
});
exports.broadcastSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    scheduledStart: zod_1.z.string().datetime(),
    scheduledEnd: zod_1.z.string().datetime(),
    programId: zod_1.z.string().optional(),
    isLive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=validation.js.map