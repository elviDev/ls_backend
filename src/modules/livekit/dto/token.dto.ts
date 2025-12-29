import { z } from 'zod';

export const TokenRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  roomName: z.string().min(1, 'Room name is required'),
  userName: z.string().min(1, 'User name is required'),
  role: z.enum(['broadcaster', 'listener']).default('listener'),
});

export type TokenRequestDto = z.infer<typeof TokenRequestSchema>;