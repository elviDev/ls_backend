import { Router } from "express";
import { ProgramController } from "../controllers/program.controller";
import { ProgramService } from "../services/program.service";
import { authMiddleware, requireStaff } from "../../../middleware/auth";

const router = Router();
const programService = new ProgramService();
const programController = new ProgramController(programService);

router.get("/", (req, res) => programController.getPrograms(req, res));
router.get("/:id", (req, res) => programController.getProgramById(req, res));
router.post("/", authMiddleware, requireStaff, (req, res) => programController.createProgram(req, res));
router.put("/:id", authMiddleware, requireStaff, (req, res) => programController.updateProgram(req, res));
router.delete("/:id", authMiddleware, requireStaff, (req, res) => programController.deleteProgram(req, res));
router.post("/:id/episodes", authMiddleware, requireStaff, (req, res) => programController.createEpisode(req, res));

export default router;