"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logBusinessLogic = exports.logFileOperation = exports.logSocketEvent = exports.logDatabase = exports.logAuth = exports.logError = exports.logRequest = void 0;
const winston_1 = __importDefault(require("winston"));
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 0)}` : '';
    return `${timestamp} [${level}] ${message}${metaStr}`;
}));
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: consoleFormat,
    transports: [
        new winston_1.default.transports.Console()
    ],
});
const logRequest = (method, url, userId) => {
    const userInfo = userId ? ` [User: ${userId}]` : '';
    logger.info(`${method} ${url}${userInfo}`);
};
exports.logRequest = logRequest;
const logError = (error, context) => {
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    logger.error(`${error.message}${contextStr}`);
    if (error.stack && process.env.NODE_ENV !== 'production') {
        logger.error(error.stack);
    }
};
exports.logError = logError;
const logAuth = (action, userId, email) => {
    const userInfo = userId ? ` [${userId}]` : '';
    const emailInfo = email ? ` (${email})` : '';
    logger.info(`🔐 ${action.toUpperCase()}${userInfo}${emailInfo}`);
};
exports.logAuth = logAuth;
const logDatabase = (operation, table, recordId) => {
    const recordInfo = recordId ? ` [${recordId}]` : '';
    logger.info(`💾 ${operation.toUpperCase()} ${table}${recordInfo}`);
};
exports.logDatabase = logDatabase;
const logSocketEvent = (event, socketId, userId) => {
    const userInfo = userId ? ` [User: ${userId}]` : '';
    logger.info(`🔌 ${event.toUpperCase()} [${socketId}]${userInfo}`);
};
exports.logSocketEvent = logSocketEvent;
const logFileOperation = (operation, filename, userId) => {
    const userInfo = userId ? ` [User: ${userId}]` : '';
    logger.info(`📁 ${operation.toUpperCase()} ${filename}${userInfo}`);
};
exports.logFileOperation = logFileOperation;
const logBusinessLogic = (action, module, details) => {
    const detailsStr = details ? ` | ${JSON.stringify(details)}` : '';
    logger.info(`⚙️ ${module.toUpperCase()}: ${action}${detailsStr}`);
};
exports.logBusinessLogic = logBusinessLogic;
exports.default = logger;
//# sourceMappingURL=logger.js.map