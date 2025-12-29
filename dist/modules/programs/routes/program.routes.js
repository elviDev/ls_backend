"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const program_controller_1 = require("../controllers/program.controller");
const program_service_1 = require("../services/program.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const programService = new program_service_1.ProgramService();
const programController = new program_controller_1.ProgramController(programService);
router.get("/", (req, res) => programController.getPrograms(req, res));
router.get("/:id", (req, res) => programController.getProgramById(req, res));
router.post("/", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => programController.createProgram(req, res));
router.put("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => programController.updateProgram(req, res));
router.delete("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => programController.deleteProgram(req, res));
router.post("/:id/episodes", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => programController.createEpisode(req, res));
exports.default = router;
//# sourceMappingURL=program.routes.js.map