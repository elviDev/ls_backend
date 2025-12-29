import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import logger from "../utils/logger";

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn("Validation error", { errors: error.issues });
        res.status(400).json({ 
          error: "Validation failed", 
          details: error.issues 
        });
        return;
      }
      next(error);
    }
  };
};

// Common validation schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  username: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => {
  if (data.confirmPassword && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const podcastSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  image: z.string().url().optional(),
  host: z.string().min(1),
  genreId: z.string().optional(),
});

export const broadcastSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  programId: z.string().optional(),
  isLive: z.boolean().optional(),
});