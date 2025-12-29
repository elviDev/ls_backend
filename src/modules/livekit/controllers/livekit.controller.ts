import { Request, Response } from 'express';
import { LiveKitService } from '../services/livekit.service';
import { TokenRequestSchema } from '../dto/token.dto';

export class LiveKitController {
  private liveKitService: LiveKitService;

  constructor() {
    this.liveKitService = new LiveKitService();
  }

  async generateToken(req: Request, res: Response) {
    try {
      const validatedData = TokenRequestSchema.parse(req.body);
      const { userId, roomName, userName, role } = validatedData;

      const token = await this.liveKitService.generateToken(userId, roomName, userName, role);

      res.json({ token });
    } catch (error: any) {
      console.error('Error generating LiveKit token:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Invalid request data',
          details: error.errors
        });
      }

      res.status(500).json({
        error: 'Failed to generate token'
      });
    }
  }
}