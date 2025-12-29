"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramController = void 0;
const logger_1 = require("../../../utils/logger");
class ProgramController {
    constructor(programService) {
        this.programService = programService;
    }
    async getPrograms(req, res) {
        try {
            const result = await this.programService.getPrograms();
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'programs', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getProgramById(req, res) {
        try {
            const { id } = req.params;
            const program = await this.programService.getProgramById(id);
            res.json(program);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'programs', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createProgram(req, res) {
        try {
            const programData = req.body;
            const hostId = req.user.id;
            const program = await this.programService.createProgram(programData, hostId);
            res.status(201).json(program);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'programs', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateProgram(req, res) {
        try {
            const { id } = req.params;
            const programData = req.body;
            const userId = req.user.id;
            const program = await this.programService.updateProgram(id, programData, userId);
            res.json(program);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'programs', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteProgram(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.programService.deleteProgram(id, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'programs', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createEpisode(req, res) {
        try {
            const { id } = req.params;
            const episodeData = req.body;
            const userId = req.user.id;
            const episode = await this.programService.createEpisode(id, episodeData, userId);
            res.status(201).json(episode);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'programs', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.ProgramController = ProgramController;
//# sourceMappingURL=program.controller.js.map