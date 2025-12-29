import { Socket } from "socket.io";
export interface SocketData {
    userId?: string;
    username?: string;
    userType?: "user" | "staff";
    role?: string;
}
export declare function validateStaffPermission(socket: Socket): boolean;
export declare function emitError(socket: Socket, message: string): void;
//# sourceMappingURL=validation.d.ts.map