import { Router } from "express";
import { BroadcastController } from "../controllers/broadcast.controller";
import { BroadcastService } from "../services/broadcast.service";
import { authMiddleware, requireStaff } from "../../../middleware/auth";

const router = Router();
// Create new instance to pick up updated methods
const broadcastService = new BroadcastService();
const broadcastController = new BroadcastController(broadcastService);

// Public routes
router.get("/", (req, res) => broadcastController.getBroadcasts(req, res));
router.get("/current", (req, res) =>
  broadcastController.getCurrentBroadcast(req, res)
);
router.get("/upcoming", (req, res) =>
  broadcastController.getUpcomingBroadcasts(req, res)
);
router.get("/events", (req, res) =>
  broadcastController.getBroadcastEvents(req, res)
);
router.get("/:id", (req, res) =>
  broadcastController.getBroadcastById(req, res)
);

// Protected routes
router.post("/", authMiddleware, requireStaff, (req, res) =>
  broadcastController.createBroadcast(req, res)
);
router.put("/:id", authMiddleware, requireStaff, (req, res) =>
  broadcastController.updateBroadcast(req, res)
);
router.delete("/:id", authMiddleware, requireStaff, (req, res) =>
  broadcastController.deleteBroadcast(req, res)
);
router.post("/:id/start", authMiddleware, requireStaff, (req, res) =>
  broadcastController.startBroadcast(req, res)
);
router.post("/:id/end", authMiddleware, requireStaff, (req, res) =>
  broadcastController.endBroadcast(req, res)
);

export default router;
