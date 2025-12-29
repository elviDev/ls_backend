"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const logger_1 = require("../../../utils/logger");
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
            (0, logger_1.logError)(error, { module: 'users', action: 'Get users error' });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async suspendUser(req, res) {
        try {
            const { id } = req.params;
            const { isSuspended, suspendedReason } = req.body;
            const requestingUserRole = req.user.role;
            if (requestingUserRole !== 'ADMIN') {
                return res.status(403).json({ error: "Only administrators can suspend users" });
            }
            const user = await this.userService.updateUserStatus(id, {
                isSuspended,
                suspendedReason,
                suspendedAt: isSuspended ? new Date() : null,
            });
            res.json(user);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'users', action: 'Suspend user error' });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const requestingUserRole = req.user.role;
            if (requestingUserRole !== 'ADMIN') {
                return res.status(403).json({ error: "Only administrators can delete users" });
            }
            await this.userService.deleteUser(id);
            res.json({ message: "User deleted successfully" });
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'users', action: 'Delete user error' });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map