"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStaffPermission = validateStaffPermission;
exports.emitError = emitError;
const logger_1 = require("../../utils/logger");
function validateStaffPermission(socket) {
    const socketData = socket.data;
    if (socketData.userType !== "staff") {
        logger_1.logger.warn("Staff permission validation failed", {
            socketId: socket.id,
            userType: socketData.userType,
        });
        socket.emit("error", { message: "Insufficient permissions" });
        return false;
    }
    return true;
}
function emitError(socket, message) {
    socket.emit("error", { message });
}
//# sourceMappingURL=validation.js.map