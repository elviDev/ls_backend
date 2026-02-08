"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const api_routes_1 = __importDefault(require("./routes/api.routes"));
const asset_routes_1 = __importDefault(require("./modules/assets/routes/asset.routes"));
const logging_1 = require("./middleware/logging");
const error_1 = require("./middleware/error");
const socket_server_1 = require("./modules/chat/socket/socket-server");
const logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 3001;
// Trust proxy for Railway deployment
app.set('trust proxy', true);
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || 'https://lsfrontend-production.up.railway.app',
        'http://localhost:3000', // Allow localhost for development
        'https://lsfrontend-production.up.railway.app' // Production frontend
    ],
    credentials: true
}));
// Rate limiting with proper trust proxy configuration
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increase limit to 500 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    // Use X-Forwarded-For header when behind proxy
    validate: { trustProxy: false }, // Disable validation to prevent crash
    skip: () => false
});
app.use(limiter);
// Logging middleware
app.use(logging_1.requestLogger);
// File upload routes (before JSON parsing)
app.use('/api/assets', asset_routes_1.default);
app.use('/api/upload', asset_routes_1.default); // Redirect upload calls to assets
// Body parsing for non-multipart requests
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
    const allowedOrigins = [
        process.env.FRONTEND_URL || 'https://lsfrontend-production.up.railway.app',
        'http://localhost:3000',
        'https://lsfrontend-production.up.railway.app'
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
}, express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Other API routes
app.use('/api', api_routes_1.default);
// Error handling
app.use(logging_1.errorLogger);
app.use(error_1.errorHandler);
// Initialize Socket.IO
(0, socket_server_1.createSocketServer)(server);
server.listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT}`);
});
// Global error handlers to prevent server crashes
process.on('unhandledRejection', (reason, promise) => {
    logger_1.default.error('Unhandled Rejection at:', { promise, reason: reason?.message || reason });
    // Don't exit the process in production
});
process.on('uncaughtException', (error) => {
    logger_1.default.error('Uncaught Exception:', { error: error.message, stack: error.stack });
    // Don't exit the process in production
});
exports.default = app;
//# sourceMappingURL=server.js.map