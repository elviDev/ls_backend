import { Request, Response, NextFunction } from 'express';
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const errorLogger: (error: Error, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=logging.d.ts.map