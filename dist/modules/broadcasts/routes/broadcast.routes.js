"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const broadcast_controller_1 = require("../controllers/broadcast.controller");
const broadcast_service_1 = require("../services/broadcast.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
// Create new instance to pick up updated methods
const broadcastService = new broadcast_service_1.BroadcastService();
const broadcastController = new broadcast_controller_1.BroadcastController(broadcastService);
// Public routes
router.get("/", (req, res) => broadcastController.getBroadcasts(req, res));
router.get("/current", (req, res) => broadcastController.getCurrentBroadcast(req, res));
router.get("/upcoming", (req, res) => broadcastController.getUpcomingBroadcasts(req, res));
router.get("/events", (req, res) => broadcastController.getBroadcastEvents(req, res));
router.get("/:id", (req, res) => broadcastController.getBroadcastById(req, res));
// Protected routes
router.post("/", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => broadcastController.createBroadcast(req, res));
router.put("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => broadcastController.updateBroadcast(req, res));
router.delete("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => broadcastController.deleteBroadcast(req, res));
router.post("/:id/start", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => broadcastController.startBroadcast(req, res));
router.post("/:id/end", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => broadcastController.endBroadcast(req, res));
exports.default = router;
//# sourceMappingURL=broadcast.routes.js.map