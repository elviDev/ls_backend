import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UsersController } from "../controllers/users.controller";
import { UserService } from "../services/user.service";
import { authMiddleware, requireAuth, requireStaff } from "../../../middleware/auth";

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);
const usersController = new UsersController(userService);

// Admin routes for user management
router.get("/", authMiddleware, requireStaff, (req, res) => usersController.getUsers(req, res));
router.patch("/:id", authMiddleware, requireStaff, (req, res) => usersController.suspendUser(req, res));
router.delete("/:id", authMiddleware, requireStaff, (req, res) => usersController.deleteUser(req, res));

// Protected user profile routes
router.get("/me", authMiddleware, requireAuth, (req, res) => userController.getProfile(req, res));
router.put("/me", authMiddleware, requireAuth, (req, res) => userController.updateProfile(req, res));
router.post("/me/change-password", authMiddleware, requireAuth, (req, res) => userController.changePassword(req, res));
router.get("/me/favorites", authMiddleware, requireAuth, (req, res) => userController.getFavorites(req, res));

// Public routes
router.get("/public/:userId", (req, res) => userController.getPublicProfile(req, res));

export default router;