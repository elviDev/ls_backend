import { Request, Response } from "express";
import { ProgramService } from "../services/program.service";
export declare class ProgramController {
    private programService;
    constructor(programService: ProgramService);
    getPrograms(req: Request, res: Response): Promise<void>;
    getProgramById(req: Request, res: Response): Promise<void>;
    createProgram(req: Request, res: Response): Promise<void>;
    updateProgram(req: Request, res: Response): Promise<void>;
    deleteProgram(req: Request, res: Response): Promise<void>;
    createEpisode(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=program.controller.d.ts.map