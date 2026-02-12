import { Router } from 'express';
import { LiveKitController } from '../controllers/livekit.controller';
import { authMiddleware, requireStaff } from '../../../middleware/auth';

const router = Router();
const liveKitController = new LiveKitController();

router.post('/token', (req, res) => liveKitController.generateToken(req, res));
router.post('/remove-participant', authMiddleware, requireStaff, (req, res) => liveKitController.removeParticipant(req, res));

export default router;