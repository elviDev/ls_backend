import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { Prisma } from "@prisma/client";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle Prisma database connection errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    logger.error("Database connection error", {
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
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error("Database query error", {
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
    logger.error("Validation error", {
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

  logger.error("Error occurred", {
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

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`,
  });
};

export const createError = (statusCode: number, message: string): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};