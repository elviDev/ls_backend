"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const event_service_1 = require("../services/event.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const eventService = new event_service_1.EventService();
const eventController = new event_controller_1.EventController(eventService);
// Public routes
router.get("/", (req, res) => eventController.getEvents(req, res));
router.get("/:id", (req, res) => eventController.getEventById(req, res));
// User routes
router.post("/:id/register", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => eventController.registerForEvent(req, res));
// Staff routes
router.post("/", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => eventController.createEvent(req, res));
router.put("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => eventController.updateEvent(req, res));
router.delete("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => eventController.deleteEvent(req, res));
exports.default = router;
//# sourceMappingURL=event.routes.js.map