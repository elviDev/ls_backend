"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.notFoundHandler = exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    logger_1.logger.error("Error occurred", {
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