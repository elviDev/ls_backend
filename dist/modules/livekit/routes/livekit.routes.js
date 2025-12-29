"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const livekit_controller_1 = require("../controllers/livekit.controller");
const router = (0, express_1.Router)();
const liveKitController = new livekit_controller_1.LiveKitController();
router.post('/token', (req, res) => liveKitController.generateToken(req, res));
exports.default = router;
//# sourceMappingURL=livekit.routes.js.map