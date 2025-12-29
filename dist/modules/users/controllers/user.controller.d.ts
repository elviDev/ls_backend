import { Request, Response } from "express";
import { UserService } from "../services/user.service";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getProfile(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;
    changePassword(req: Request, res: Response): Promise<void>;
    getFavorites(req: Request, res: Response): Promise<void>;
    getPublicProfile(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map