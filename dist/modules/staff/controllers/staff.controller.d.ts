import { Request, Response } from "express";
import { StaffService } from "../services/staff.service";
export declare class StaffController {
    private staffService;
    constructor(staffService: StaffService);
    getStaff(req: Request, res: Response): Promise<void>;
    getStaffById(req: Request, res: Response): Promise<void>;
    createStaff(req: Request, res: Response): Promise<void>;
    updateStaff(req: Request, res: Response): Promise<void>;
    approveStaff(req: Request, res: Response): Promise<void>;
    deactivateStaff(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=staff.controller.d.ts.map