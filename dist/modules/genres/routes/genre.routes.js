"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const genre_controller_1 = require("../controllers/genre.controller");
const genre_service_1 = require("../services/genre.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const genreService = new genre_service_1.GenreService();
const genreController = new genre_controller_1.GenreController(genreService);
// Public routes
router.get("/", (req, res) => genreController.getGenres(req, res));
router.get("/:id", (req, res) => genreController.getGenreById(req, res));
// Staff routes (moderator+ only)
router.post("/", auth_1.authMiddleware, auth_1.requireModerator, (req, res) => genreController.createGenre(req, res));
router.put("/:id", auth_1.authMiddleware, auth_1.requireModerator, (req, res) => genreController.updateGenre(req, res));
router.delete("/:id", auth_1.authMiddleware, auth_1.requireModerator, (req, res) => genreController.deleteGenre(req, res));
exports.default = router;
//# sourceMappingURL=genre.routes.js.map