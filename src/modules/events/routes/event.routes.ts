import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { EventService } from "../services/event.service";
import { authMiddleware, requireAuth, requireStaff } from "../../../middleware/auth";

const router = Router();
const eventService = new EventService();
const eventController = new EventController(eventService);

// Public routes
router.get("/", (req, res) => eventController.getEvents(req, res));
router.get("/:id", (req, res) => eventController.getEventById(req, res));

// User routes
router.post("/:id/register", authMiddleware, requireAuth, (req, res) => eventController.registerForEvent(req, res));

// Staff routes
router.post("/", authMiddleware, requireStaff, (req, res) => eventController.createEvent(req, res));
router.put("/:id", authMiddleware, requireStaff, (req, res) => eventController.updateEvent(req, res));
router.delete("/:id", authMiddleware, requireStaff, (req, res) => eventController.deleteEvent(req, res));

export default router;