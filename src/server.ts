import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from './routes/api.routes';
import assetRoutes from './modules/assets/routes/asset.routes';
import { requestLogger, errorLogger } from './middleware/logging';
import { errorHandler } from './middleware/error';
import { createSocketServer } from './modules/chat/socket/socket-server';
import logger from './utils/logger';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Trust proxy for Railway deployment
app.set('trust proxy', true);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'https://lsfrontend-production.up.railway.app',
    'http://localhost:3000',
    'https://lsfrontend-production.up.railway.app',
    'https://cbs-radio.com',
    'https://www.cbs-radio.com'
  ],
  credentials: true
}));

// Rate limiting with proper trust proxy configuration
const limiter = rateLimit({
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
app.use(requestLogger);

// File upload routes (before JSON parsing)
app.use('/api/assets', assetRoutes);
app.use('/api/upload', assetRoutes); // Redirect upload calls to assets

// Body parsing for non-multipart requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'https://lsfrontend-production.up.railway.app',
    'http://localhost:3000',
    'https://lsfrontend-production.up.railway.app',
    'https://cbs-radio.com',
    'https://www.cbs-radio.com'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(path.join(process.cwd(), 'uploads')));

// Other API routes
app.use('/api', apiRoutes);

// Error handling
app.use(errorLogger);
app.use(errorHandler);

// Initialize Socket.IO
createSocketServer(server);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Global error handlers to prevent server crashes
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', { promise, reason: reason?.message || reason });
  // Don't exit the process in production
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  // Don't exit the process in production
});

export default app;