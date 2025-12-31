import { Router } from "express";
import { ProgramController } from "../controllers/program.controller";
import { ProgramService } from "../services/program.service";
import { authMiddleware, requireStaff } from "../../../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validation.middleware";
import multer from "multer";
import { 
  createProgramSchema, 
  updateProgramSchema, 
  programQuerySchema,
  createEpisodeSchema,
  updateEpisodeSchema,
  paginationSchema
} from "../validation/program.validation";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
const programService = new ProgramService();
const programController = new ProgramController(programService);

// Program routes
router.get("/", validateQuery(programQuerySchema), (req, res) => programController.getPrograms(req, res));
router.get("/slug/:slug", (req, res) => programController.getProgramBySlug(req, res));
router.get("/:id", (req, res) => programController.getProgramById(req, res));
router.get("/:id/analytics", authMiddleware, requireStaff, (req, res) => programController.getProgramAnalytics(req, res));
router.post("/", authMiddleware, requireStaff, upload.single('image'), validateBody(createProgramSchema), (req, res) => programController.createProgram(req, res));
router.patch("/:id", authMiddleware, requireStaff, upload.single('image'), validateBody(updateProgramSchema), (req, res) => programController.updateProgram(req, res));
router.delete("/:id", authMiddleware, requireStaff, (req, res) => programController.deleteProgram(req, res));
router.patch("/:id/archive", authMiddleware, requireStaff, (req, res) => programController.archiveProgram(req, res));
router.patch("/:id/activate", authMiddleware, requireStaff, (req, res) => programController.activateProgram(req, res));
router.post("/:id/schedule", authMiddleware, requireStaff, (req, res) => programController.createSchedule(req, res));

// Episode routes
router.get("/:id/episodes", validateQuery(paginationSchema), (req, res) => programController.getProgramEpisodes(req, res));
router.get("/:id/episodes/:episodeId", (req, res) => programController.getEpisodeById(req, res));
router.post("/:id/episodes", authMiddleware, requireStaff, upload.single('audioFile'), validateBody(createEpisodeSchema), (req, res) => programController.createEpisode(req, res));
router.patch("/:id/episodes/:episodeId", authMiddleware, requireStaff, upload.single('audioFile'), validateBody(updateEpisodeSchema), (req, res) => programController.updateEpisode(req, res));
router.delete("/:id/episodes/:episodeId", authMiddleware, requireStaff, (req, res) => programController.deleteEpisode(req, res));
router.patch("/:id/episodes/:episodeId/link-broadcast", authMiddleware, requireStaff, (req, res) => programController.linkEpisodeToBroadcast(req, res));

export default router;