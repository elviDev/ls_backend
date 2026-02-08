import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { authMiddleware, requireAuth } from "../../../middleware/auth";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/login", (req, res) => authController.login(req, res));
router.post("/register", (req, res) => authController.register(req, res));
router.post("/register-staff", (req, res) => authController.registerStaff(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));
router.post("/verify-email", (req, res) => authController.verifyEmail(req, res));
router.get("/verify-email/:token", (req, res) => authController.verifyEmailByToken(req, res));
router.post("/resend-verification", (req, res) => authController.resendVerification(req, res));
router.post("/forgot-password", (req, res) => authController.forgotPassword(req, res));
router.post("/reset-password", (req, res) => authController.resetPassword(req, res));

router.get("/me", authMiddleware, requireAuth, (req, res) => authController.me(req, res));

export default router;