import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: Request, res: Response): Promise<void>;
    register(req: Request, res: Response): Promise<void>;
    registerStaff(req: Request, res: Response): Promise<void>;
    me(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    verifyEmail(req: Request, res: Response): Promise<void>;
    verifyEmailByToken(req: Request, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    resendVerification(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map