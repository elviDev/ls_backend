import { Request, Response } from "express";
import { UserService } from "../services/user.service";
export declare class UsersController {
    private userService;
    constructor(userService: UserService);
    getUsers(req: Request, res: Response): Promise<void>;
    suspendUser(req: Request, res: Response): Promise<void>;
    deleteUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=users.controller.d.ts.map