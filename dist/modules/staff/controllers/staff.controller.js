"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffController = void 0;
const logger_1 = require("../../../utils/logger");
class StaffController {
    constructor(staffService) {
        this.staffService = staffService;
    }
    async getStaff(req, res) {
        try {
            const query = {
                role: req.query.role,
                department: req.query.department,
                search: req.query.search,
                isActive: req.query.isActive === "true",
                isApproved: req.query.isApproved === "true",
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder,
                page: parseInt(req.query.page) || 1,
                perPage: parseInt(req.query.perPage) || 10,
            };
            const requestingUserRole = req.user.role;
            const result = await this.staffService.getStaff(query, requestingUserRole);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: "staff", action: "Get staff error" });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getStaffById(req, res) {
        try {
            const { id } = req.params;
            const requestingUserId = req.user.id;
            const requestingUserRole = req.user.role;
            const staff = await this.staffService.getStaffById(id, requestingUserId, requestingUserRole);
            res.json(staff);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: "staff", action: "Get staff by ID error" });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createStaff(req, res) {
        try {
            const staffData = req.body;
            const requestingUserRole = req.user.role;
            const staff = await this.staffService.createStaff(staffData, requestingUserRole);
            res.status(201).json(staff);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: "staff", action: "Create staff error" });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateStaff(req, res) {
        try {
            const { id } = req.params;
            const staffData = req.body;
            const requestingUserId = req.user.id;
            const requestingUserRole = req.user.role;
            const staff = await this.staffService.updateStaff(id, staffData, requestingUserId, requestingUserRole);
            res.json(staff);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: "staff", action: "Update staff error" });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async approveStaff(req, res) {
        try {
            const { id } = req.params;
            const requestingUserRole = req.user.role;
            const requestingUserId = req.user.id;
            const staff = await this.staffService.approveStaff(id, requestingUserRole, requestingUserId);
            res.json(staff);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: "staff", action: "Approve staff error" });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deactivateStaff(req, res) {
        try {
            const { id } = req.params;
            const requestingUserRole = req.user.role;
            const staff = await this.staffService.deactivateStaff(id, requestingUserRole);
            res.json(staff);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: "staff", action: "Deactivate staff error" });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.StaffController = StaffController;
//# sourceMappingURL=staff.controller.js.map