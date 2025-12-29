"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.requestLogger = void 0;
const logger_1 = require("../utils/logger");
const logger_2 = __importDefault(require("../utils/logger"));
const requestLogger = (req, res, next) => {
    const userId = req.user?.id;
    const userInfo = userId ? ` [User: ${userId}]` : '';
    const start = Date.now();
    logger_2.default.info(`🚀 ${req.method} ${req.originalUrl}${userInfo}`);
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusColor = res.statusCode >= 400 ? '🔴' : res.statusCode >= 300 ? '🟡' : '🟢';
        logger_2.default.info(`${statusColor} ${res.statusCode} ${req.method} ${req.originalUrl} - ${duration}ms`);
        if (res.statusCode >= 400) {
            (0, logger_1.logError)(new Error(`HTTP ${res.statusCode}`), {
                method: req.method,
                url: req.originalUrl,
                duration,
                userId
            });
        }
    });
    next();
};
exports.requestLogger = requestLogger;
const errorLogger = (error, req, res, next) => {
    logger_2.default.error(`🚨 ${error.message} | ${req.method} ${req.originalUrl}`);
    (0, logger_1.logError)(error, {
        method: req.method,
        url: req.originalUrl,
        userId: req.user?.id,
        body: req.body,
        params: req.params
    });
    next(error);
};
exports.errorLogger = errorLogger;
//# sourceMappingURL=logging.js.map