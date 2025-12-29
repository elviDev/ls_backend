import { Request, Response, NextFunction } from "express";
export interface AuthUser {
    id: string;
    email: string;
    name?: string | null;
    username?: string | null;
    profileImage?: string | null;
    userType: "user" | "staff";
    role?: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function requireAuth(req: Request, res: Response, next: NextFunction): void;
export declare function requireStaff(req: Request, res: Response, next: NextFunction): void;
export declare function requireModerator(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map