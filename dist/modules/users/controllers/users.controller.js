"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const logger_1 = __importDefault(require("../../../utils/logger"));
class UsersController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUsers(req, res) {
        try {
            const requestingUserRole = req.user.role;
            const result = await this.userService.getUsers(req.query, requestingUserRole);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error("Get users error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async suspendUser(req, res) {
        try {
            const { id } = req.params;
            const { isSuspended, suspendedReason } = req.body;
            const requestingUserRole = req.user.role;
            if (requestingUserRole !== 'ADMIN') {
                res.status(403).json({ error: "Only administrators can suspend users" });
                return;
            }
            const user = await this.userService.updateUserStatus(id, {
                isSuspended,
                suspendedReason,
                suspendedAt: isSuspended ? new Date() : null,
            });
            res.json(user);
        }
        catch (error) {
            logger_1.default.error("Suspend user error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const requestingUserRole = req.user.role;
            if (requestingUserRole !== 'ADMIN') {
                res.status(403).json({ error: "Only administrators can delete users" });
                return;
            }
            await this.userService.deleteUser(id);
            res.json({ message: "User deleted successfully" });
        }
        catch (error) {
            logger_1.default.error("Delete user error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map