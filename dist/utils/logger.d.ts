import winston from 'winston';
declare const logger: winston.Logger;
export declare const logRequest: (method: string, url: string, userId?: string) => void;
export declare const logError: (error: Error | string | any, context?: any) => void;
export declare const logAuth: (action: string, userId?: string, email?: string) => void;
export declare const logDatabase: (operation: string, table: string, recordId?: string) => void;
export declare const logSocketEvent: (event: string, socketId: string, userId?: string) => void;
export declare const logFileOperation: (operation: string, filename: string, userId?: string) => void;
export declare const logBusinessLogic: (action: string, module: string, details?: any) => void;
export default logger;
//# sourceMappingURL=logger.d.ts.map