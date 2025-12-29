import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import logger from "../../../utils/logger";

export class UsersController {
  constructor(private userService: UserService) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const requestingUserRole = req.user!.role;
      const result = await this.userService.getUsers(req.query, requestingUserRole);
      res.json(result);
    } catch (error: any) {
      logger.error("Get users error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async suspendUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isSuspended, suspendedReason } = req.body;
      const requestingUserRole = req.user!.role;

      if (requestingUserRole !== 'ADMIN') {
        res.status(403).json({ error: "Only administrators can suspend users" });
        return;
      }

      const user = await this.userService.updateUserStatus(id, {
        isSuspended,
        suspendedReason,
        suspendedAt: isSuspended ? new Date() : null,
      });

      res.json(user);
    } catch (error: any) {
      logger.error("Suspend user error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const requestingUserRole = req.user!.role;

      if (requestingUserRole !== 'ADMIN') {
        res.status(403).json({ error: "Only administrators can delete users" });
        return;
      }

      await this.userService.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      logger.error("Delete user error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}