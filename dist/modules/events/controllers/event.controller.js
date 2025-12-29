"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const logger_1 = require("../../../utils/logger");
class EventController {
    constructor(eventService) {
        this.eventService = eventService;
    }
    async getEvents(req, res) {
        try {
            const query = {
                eventType: req.query.eventType,
                upcoming: req.query.upcoming === "true",
                limit: parseInt(req.query.limit) || 10,
                search: req.query.search,
            };
            const result = await this.eventService.getEvents(query);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'events', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getEventById(req, res) {
        try {
            const { id } = req.params;
            const event = await this.eventService.getEventById(id);
            res.json(event);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'events', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createEvent(req, res) {
        try {
            const eventData = req.body;
            const organizerId = req.user.id;
            const event = await this.eventService.createEvent(eventData, organizerId);
            res.status(201).json(event);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'events', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateEvent(req, res) {
        try {
            const { id } = req.params;
            const eventData = req.body;
            const userId = req.user.id;
            const event = await this.eventService.updateEvent(id, eventData, userId);
            res.json(event);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'events', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.eventService.deleteEvent(id, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'events', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async registerForEvent(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.eventService.registerForEvent(id, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'events', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.EventController = EventController;
//# sourceMappingURL=event.controller.js.map