import { Request, Response } from "express";
import { ProgramService } from "../services/program.service";
export declare class ProgramController {
    private programService;
    private assetService;
    constructor(programService: ProgramService);
    getPrograms(req: Request, res: Response): Promise<void>;
    getProgramById(req: Request, res: Response): Promise<void>;
    getProgramBySlug(req: Request, res: Response): Promise<void>;
    createProgram(req: Request, res: Response): Promise<void>;
    updateProgram(req: Request, res: Response): Promise<void>;
    deleteProgram(req: Request, res: Response): Promise<void>;
    getProgramEpisodes(req: Request, res: Response): Promise<void>;
    getEpisodeById(req: Request, res: Response): Promise<void>;
    createEpisode(req: Request, res: Response): Promise<void>;
    updateEpisode(req: Request, res: Response): Promise<void>;
    deleteEpisode(req: Request, res: Response): Promise<void>;
    archiveProgram(req: Request, res: Response): Promise<void>;
    activateProgram(req: Request, res: Response): Promise<void>;
    getProgramAnalytics(req: Request, res: Response): Promise<void>;
    linkEpisodeToBroadcast(req: Request, res: Response): Promise<void>;
    createSchedule(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=program.controller.d.ts.map