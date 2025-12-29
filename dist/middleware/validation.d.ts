import { Request, Response, NextFunction } from "express";
import { z } from "zod";
export declare const validate: (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const registerSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const podcastSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    host: z.ZodString;
    genreId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const broadcastSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    scheduledStart: z.ZodString;
    scheduledEnd: z.ZodString;
    programId: z.ZodOptional<z.ZodString>;
    isLive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=validation.d.ts.map