import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  const userInfo = userId ? ` [User: ${userId}]` : '';
  const start = Date.now();
  
  logger.info(`🚀 ${req.method} ${req.originalUrl}${userInfo}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '🔴' : res.statusCode >= 300 ? '🟡' : '🟢';
    logger.info(`${statusColor} ${res.statusCode} ${req.method} ${req.originalUrl} - ${duration}ms`);
    
    if (res.statusCode >= 400) {
      logger.error(`HTTP ${res.statusCode}`, {
        method: req.method,
        url: req.originalUrl,
        duration,
        userId
      });
    }
  });
  
  next();
};

export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`🚨 ${error.message} | ${req.method} ${req.originalUrl}`);
  logger.error(error.message, {
    method: req.method,
    url: req.originalUrl,
    userId: (req as any).user?.id,
    body: req.body,
    params: req.params
  });
  next(error);
};