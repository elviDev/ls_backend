"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreController = void 0;
const logger_1 = require("../../../utils/logger");
class GenreController {
    constructor(genreService) {
        this.genreService = genreService;
    }
    async getGenres(req, res) {
        try {
            const result = await this.genreService.getGenres();
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "genres",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getGenreById(req, res) {
        try {
            const { id } = req.params;
            const genre = await this.genreService.getGenreById(id);
            res.json(genre);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "genres",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createGenre(req, res) {
        try {
            const genreData = req.body;
            const genre = await this.genreService.createGenre(genreData);
            res.status(201).json(genre);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "genres",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateGenre(req, res) {
        try {
            const { id } = req.params;
            const genreData = req.body;
            const genre = await this.genreService.updateGenre(id, genreData);
            res.json(genre);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "genres",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteGenre(req, res) {
        try {
            const { id } = req.params;
            const result = await this.genreService.deleteGenre(id);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "genres",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.GenreController = GenreController;
//# sourceMappingURL=genre.controller.js.map