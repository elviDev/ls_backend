"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sseService = void 0;
const express_1 = require("express");
const sse_controller_1 = require("../controllers/sse.controller");
const sse_service_1 = require("../services/sse.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const sseService = new sse_service_1.SSEService();
exports.sseService = sseService;
const sseController = new sse_controller_1.SSEController(sseService);
// Public SSE connection endpoint
router.get("/connect", sseController.connect.bind(sseController));
// Staff-only stats endpoint
router.get("/stats", auth_1.requireAuth, auth_1.requireStaff, sseController.getStats.bind(sseController));
exports.default = router;
//# sourceMappingURL=sse.routes.js.map