import { Router } from 'express';
import { LiveKitController } from '../controllers/livekit.controller';

const router = Router();
const liveKitController = new LiveKitController();

router.post('/token', (req, res) => liveKitController.generateToken(req, res));

export default router;