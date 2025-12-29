import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UserDto, ChangePasswordDto } from "../dto/user.dto";
import { logError } from "../../../utils/logger";

export class UserController {
  constructor(private userService: UserService) {}

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await this.userService.getUserProfile(userId);
      res.json(profile);
    } catch (error: any) {
      logError(error, { module: 'users', action: req.method + ' ' + req.originalUrl });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const userData: UserDto = req.body;
      
      const updatedProfile = await this.userService.updateProfile(userId, userData);
      res.json(updatedProfile);
    } catch (error: any) {
      logError(error, { module: 'users', action: req.method + ' ' + req.originalUrl });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const passwordData: ChangePasswordDto = req.body;
      
      const result = await this.userService.changePassword(userId, passwordData);
      res.json(result);
    } catch (error: any) {
      logError(error, { module: 'users', action: req.method + ' ' + req.originalUrl });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getFavorites(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const favorites = await this.userService.getFavorites(userId);
      res.json(favorites);
    } catch (error: any) {
      logError(error, { module: 'users', action: req.method + ' ' + req.originalUrl });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getPublicProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const profile = await this.userService.getPublicProfile(userId);
      res.json(profile);
    } catch (error: any) {
      logError(error, { module: 'users', action: req.method + ' ' + req.originalUrl });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}