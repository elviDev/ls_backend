import winston from 'winston';

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 0)}` : '';
    return `${timestamp} [${level}] ${message}${metaStr}`;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: consoleFormat,
  transports: [
    new winston.transports.Console()
  ],
});

export const logRequest = (method: string, url: string, userId?: string) => {
  const userInfo = userId ? ` [User: ${userId}]` : '';
  logger.info(`${method} ${url}${userInfo}`);
};

export const logError = (error: Error, context?: any) => {
  const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
  logger.error(`${error.message}${contextStr}`);
  if (error.stack && process.env.NODE_ENV !== 'production') {
    logger.error(error.stack);
  }
};

export const logAuth = (action: string, userId?: string, email?: string) => {
  const userInfo = userId ? ` [${userId}]` : '';
  const emailInfo = email ? ` (${email})` : '';
  logger.info(`🔐 ${action.toUpperCase()}${userInfo}${emailInfo}`);
};

export const logDatabase = (operation: string, table: string, recordId?: string) => {
  const recordInfo = recordId ? ` [${recordId}]` : '';
  logger.info(`💾 ${operation.toUpperCase()} ${table}${recordInfo}`);
};

export const logSocketEvent = (event: string, socketId: string, userId?: string) => {
  const userInfo = userId ? ` [User: ${userId}]` : '';
  logger.info(`🔌 ${event.toUpperCase()} [${socketId}]${userInfo}`);
};

export const logFileOperation = (operation: string, filename: string, userId?: string) => {
  const userInfo = userId ? ` [User: ${userId}]` : '';
  logger.info(`📁 ${operation.toUpperCase()} ${filename}${userInfo}`);
};

export const logBusinessLogic = (action: string, module: string, details?: any) => {
  const detailsStr = details ? ` | ${JSON.stringify(details)}` : '';
  logger.info(`⚙️ ${module.toUpperCase()}: ${action}${detailsStr}`);
};

export default logger;