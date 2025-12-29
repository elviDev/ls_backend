"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const users_controller_1 = require("../controllers/users.controller");
const user_service_1 = require("../services/user.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const userService = new user_service_1.UserService();
const userController = new user_controller_1.UserController(userService);
const usersController = new users_controller_1.UsersController(userService);
// Admin routes for user management
router.get("/", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => usersController.getUsers(req, res));
router.patch("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => usersController.suspendUser(req, res));
router.delete("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => usersController.deleteUser(req, res));
// Protected user profile routes
router.get("/me", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => userController.getProfile(req, res));
router.put("/me", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => userController.updateProfile(req, res));
router.post("/me/change-password", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => userController.changePassword(req, res));
router.get("/me/favorites", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => userController.getFavorites(req, res));
// Public routes
router.get("/public/:userId", (req, res) => userController.getPublicProfile(req, res));
exports.default = router;
//# sourceMappingURL=user.routes.js.map