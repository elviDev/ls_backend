import { Request, Response } from "express";
import { EventService } from "../services/event.service";
export declare class EventController {
    private eventService;
    constructor(eventService: EventService);
    getEvents(req: Request, res: Response): Promise<void>;
    getEventById(req: Request, res: Response): Promise<void>;
    createEvent(req: Request, res: Response): Promise<void>;
    updateEvent(req: Request, res: Response): Promise<void>;
    deleteEvent(req: Request, res: Response): Promise<void>;
    registerForEvent(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=event.controller.d.ts.map