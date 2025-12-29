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
const upload_routes_1 = __importDefault(require("./modules/upload/routes/upload.routes"));
const logging_1 = require("./middleware/logging");
const error_1 = require("./middleware/error");
const socket_server_1 = require("./modules/chat/socket/socket-server");
const logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 3001;
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Logging middleware
app.use(logging_1.requestLogger);
// File upload routes (before JSON parsing)
app.use('/api/assets', asset_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
// Body parsing for non-multipart requests
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
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
exports.default = app;
//# sourceMappingURL=server.js.map