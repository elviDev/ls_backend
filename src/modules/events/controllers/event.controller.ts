import { Request, Response } from "express";
import { EventService } from "../services/event.service";
import { EventDto, EventQueryDto } from "../dto/event.dto";
import { logError } from "../../../utils/logger";

export class EventController {
  constructor(private eventService: EventService) {}

  async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const query: EventQueryDto = {
        eventType: req.query.eventType as string,
        upcoming: req.query.upcoming === "true",
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
      };

      const result = await this.eventService.getEvents(query);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "events",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const event = await this.eventService.getEventById(id);
      res.json(event);
    } catch (error: any) {
      logError(error, {
        module: "events",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventData: EventDto = req.body;
      const organizerId = req.user!.id;

      const event = await this.eventService.createEvent(eventData, organizerId);
      res.status(201).json(event);
    } catch (error: any) {
      logError(error, {
        module: "events",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const eventData: Partial<EventDto> = req.body;
      const userId = req.user!.id;

      const event = await this.eventService.updateEvent(id, eventData, userId);
      res.json(event);
    } catch (error: any) {
      logError(error, {
        module: "events",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await this.eventService.deleteEvent(id, userId);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "events",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async registerForEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await this.eventService.registerForEvent(id, userId);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "events",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
