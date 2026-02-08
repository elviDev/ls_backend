"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const program_controller_1 = require("../controllers/program.controller");
const program_service_1 = require("../services/program.service");
const auth_1 = require("../../../middleware/auth");
const validation_middleware_1 = require("../middleware/validation.middleware");
const multer_1 = __importDefault(require("multer"));
const program_validation_1 = require("../validation/program.validation");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
const programService = new program_service_1.ProgramService();
const programController = new program_controller_1.ProgramController(programService);
// Program routes
router.get("/", (0, validation_middleware_1.validateQuery)(program_validation_1.programQuerySchema), (req, res) => programController.getPrograms(req, res));
router.get("/slug/:slug", (req, res) => programController.getProgramBySlug(req, res));
router.get("/:id", (req, res) => programController.getProgramById(req, res));
router.get("/:id/analytics", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => programController.getProgramAnalytics(req, res));
router.post("/", auth_1.authMiddleware, auth_1.requireStaff, upload.single('image'), (0, validation_middleware_1.validateBody)(program_validation_1.createProgramSchema), (req, res) => programController.createProgram(req, res));
router.patch("/:id", auth_1.authMiddleware, auth_1.requireStaff, upload.single('image'), (0, validation_middleware_1.validateBody)(program_validation_1.updateProgramSchema), (req, res) => programController.updateProgram(req, res));
router.delete("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => programController.deleteProgram(req, res));
router.patch("/:id/archive", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => programController.archiveProgram(req, res));
router.patch("/:id/activate", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => programController.activateProgram(req, res));
router.post("/:id/schedule", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => programController.createSchedule(req, res));
// Episode routes
router.get("/:id/episodes", (0, validation_middleware_1.validateQuery)(program_validation_1.paginationSchema), (req, res) => programController.getProgramEpisodes(req, res));
router.get("/:id/episodes/:episodeId", (req, res) => programController.getEpisodeById(req, res));
router.post("/:id/episodes", auth_1.authMiddleware, auth_1.requireStaff, upload.single('audioFile'), (0, validation_middleware_1.validateBody)(program_validation_1.createEpisodeSchema), (req, res) => programController.createEpisode(req, res));
router.patch("/:id/episodes/:episodeId", auth_1.authMiddleware, auth_1.requireStaff, upload.single('audioFile'), (0, validation_middleware_1.validateBody)(program_validation_1.updateEpisodeSchema), (req, res) => programController.updateEpisode(req, res));
router.delete("/:id/episodes/:episodeId", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => programController.deleteEpisode(req, res));
router.patch("/:id/episodes/:episodeId/link-broadcast", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => programController.linkEpisodeToBroadcast(req, res));
exports.default = router;
//# sourceMappingURL=program.routes.js.map