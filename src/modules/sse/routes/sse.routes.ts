import { Router } from "express";
import { SSEController } from "../controllers/sse.controller";
import { SSEService } from "../services/sse.service";
import { requireAuth, requireStaff } from "../../../middleware/auth";

const router = Router();
const sseService = new SSEService();
const sseController = new SSEController(sseService);

// Public SSE connection endpoint
router.get("/connect", sseController.connect.bind(sseController));

// Staff-only stats endpoint
router.get("/stats", requireAuth, requireStaff, sseController.getStats.bind(sseController));

export { sseService };
export default router;