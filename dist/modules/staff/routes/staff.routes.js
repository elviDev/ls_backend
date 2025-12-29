"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staff_controller_1 = require("../controllers/staff.controller");
const staff_service_1 = require("../services/staff.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const staffService = new staff_service_1.StaffService();
const staffController = new staff_controller_1.StaffController(staffService);
// Staff routes (authenticated staff only)
router.get("/", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => staffController.getStaff(req, res));
router.get("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => staffController.getStaffById(req, res));
router.put("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => staffController.updateStaff(req, res));
// Admin routes (moderator+ only)
router.post("/", auth_1.authMiddleware, auth_1.requireModerator, (req, res) => staffController.createStaff(req, res));
router.post("/:id/approve", auth_1.authMiddleware, auth_1.requireModerator, (req, res) => staffController.approveStaff(req, res));
router.post("/:id/deactivate", auth_1.authMiddleware, auth_1.requireModerator, (req, res) => staffController.deactivateStaff(req, res));
exports.default = router;
//# sourceMappingURL=staff.routes.js.map