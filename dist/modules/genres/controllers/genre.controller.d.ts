import { Request, Response } from "express";
import { GenreService } from "../services/genre.service";
export declare class GenreController {
    private genreService;
    constructor(genreService: GenreService);
    getGenres(req: Request, res: Response): Promise<void>;
    getGenreById(req: Request, res: Response): Promise<void>;
    createGenre(req: Request, res: Response): Promise<void>;
    updateGenre(req: Request, res: Response): Promise<void>;
    deleteGenre(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=genre.controller.d.ts.map