import { Router } from "express";
import { GenreController } from "../controllers/genre.controller";
import { GenreService } from "../services/genre.service";
import { authMiddleware, requireStaff, requireModerator } from "../../../middleware/auth";

const router = Router();
const genreService = new GenreService();
const genreController = new GenreController(genreService);

// Public routes
router.get("/", (req, res) => genreController.getGenres(req, res));
router.get("/:id", (req, res) => genreController.getGenreById(req, res));

// Staff routes (moderator+ only)
router.post("/", authMiddleware, requireModerator, (req, res) => genreController.createGenre(req, res));
router.put("/:id", authMiddleware, requireModerator, (req, res) => genreController.updateGenre(req, res));
router.delete("/:id", authMiddleware, requireModerator, (req, res) => genreController.deleteGenre(req, res));

export default router;