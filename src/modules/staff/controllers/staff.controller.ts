import { Request, Response } from "express";
import { StaffService } from "../services/staff.service";
import { StaffDto, StaffUpdateDto, StaffQueryDto } from "../dto/staff.dto";
import { logError } from "../../../utils/logger";

export class StaffController {
  constructor(private staffService: StaffService) {}

  async getStaff(req: Request, res: Response): Promise<void> {
    try {
      const query: StaffQueryDto = {
        role: req.query.role as string,
        department: req.query.department as string,
        search: req.query.search as string,
        isActive: req.query.isActive === "true",
        isApproved: req.query.isApproved === "true",
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as string,
        page: parseInt(req.query.page as string) || 1,
        perPage: parseInt(req.query.perPage as string) || 10,
      };

      const requestingUserRole = req.user!.role;
      const result = await this.staffService.getStaff(
        query,
        requestingUserRole
      );
      res.json(result);
    } catch (error: any) {
      logError(error, { module: "staff", action: "Get staff error" });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getStaffById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const requestingUserId = req.user!.id;
      const requestingUserRole = req.user!.role;

      const staff = await this.staffService.getStaffById(
        id,
        requestingUserId,
        requestingUserRole
      );
      res.json(staff);
    } catch (error: any) {
      logError(error, { module: "staff", action: "Get staff by ID error" });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createStaff(req: Request, res: Response): Promise<void> {
    try {
      const staffData: StaffDto = req.body;
      const requestingUserRole = req.user!.role;

      const staff = await this.staffService.createStaff(
        staffData,
        requestingUserRole
      );
      res.status(201).json(staff);
    } catch (error: any) {
      logError(error, { module: "staff", action: "Create staff error" });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateStaff(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const staffData: StaffUpdateDto = req.body;
      const requestingUserId = req.user!.id;
      const requestingUserRole = req.user!.role;

      const staff = await this.staffService.updateStaff(
        id,
        staffData,
        requestingUserId,
        requestingUserRole
      );
      res.json(staff);
    } catch (error: any) {
      logError(error, { module: "staff", action: "Update staff error" });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async approveStaff(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const requestingUserRole = req.user!.role;
      const requestingUserId = req.user!.id;

      const staff = await this.staffService.approveStaff(
        id,
        requestingUserRole,
        requestingUserId
      );
      res.json(staff);
    } catch (error: any) {
      logError(error, { module: "staff", action: "Approve staff error" });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deactivateStaff(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const requestingUserRole = req.user!.role;

      const staff = await this.staffService.deactivateStaff(
        id,
        requestingUserRole
      );
      res.json(staff);
    } catch (error: any) {
      logError(error, { module: "staff", action: "Deactivate staff error" });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteStaff(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const requestingUserRole = req.user!.role;

      const result = await this.staffService.deleteStaff(
        id,
        requestingUserRole
      );
      res.json(result);
    } catch (error: any) {
      logError(error, { module: "staff", action: "Delete staff error" });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
