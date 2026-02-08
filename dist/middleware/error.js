"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.notFoundHandler = exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const client_1 = require("@prisma/client");
const errorHandler = (error, req, res, next) => {
    // Handle Prisma database connection errors
    if (error instanceof client_1.Prisma.PrismaClientInitializationError) {
        logger_1.default.error("Database connection error", {
            error: error.message,
            path: req.path,
            method: req.method,
        });
        res.status(503).json({
            error: "Database service temporarily unavailable. Please try again later.",
            ...(process.env.NODE_ENV === "development" && { details: error.message }),
        });
        return;
    }
    // Handle Prisma query errors
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        logger_1.default.error("Database query error", {
            code: error.code,
            meta: error.meta,
            path: req.path,
            method: req.method,
        });
        res.status(400).json({
            error: "Database query failed",
            ...(process.env.NODE_ENV === "development" && { code: error.code, details: error.message }),
        });
        return;
    }
    // Handle validation errors
    if (error.name === 'ValidationError') {
        logger_1.default.error("Validation error", {
            error: error.message,
            path: req.path,
            method: req.method,
        });
        res.status(400).json({
            error: error.message || "Validation failed",
            ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
        });
        return;
    }
    // Handle standard application errors
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    logger_1.default.error("Error occurred", {
        error: error.message,
        stack: error.stack,
        statusCode,
        path: req.path,
        method: req.method,
    });
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        error: `Route ${req.originalUrl} not found`,
    });
};
exports.notFoundHandler = notFoundHandler;
const createError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
exports.createError = createError;
//# sourceMappingURL=error.js.map