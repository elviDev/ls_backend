import { Router } from "express";
import { StaffController } from "../controllers/staff.controller";
import { StaffService } from "../services/staff.service";
import { authMiddleware, requireStaff, requireModerator } from "../../../middleware/auth";

const router = Router();
const staffService = new StaffService();
const staffController = new StaffController(staffService);

// Staff routes (authenticated staff only)
router.get("/", authMiddleware, requireStaff, (req, res) => staffController.getStaff(req, res));
router.get("/:id", authMiddleware, requireStaff, (req, res) => staffController.getStaffById(req, res));
router.put("/:id", authMiddleware, requireStaff, (req, res) => staffController.updateStaff(req, res));
router.patch("/:id", authMiddleware, requireModerator, (req, res) => staffController.updateStaff(req, res));

// Admin routes (moderator+ only)
router.post("/", authMiddleware, requireModerator, (req, res) => staffController.createStaff(req, res));
router.post("/:id/approve", authMiddleware, requireModerator, (req, res) => staffController.approveStaff(req, res));
router.post("/:id/deactivate", authMiddleware, requireModerator, (req, res) => staffController.deactivateStaff(req, res));

export default router;