import { z } from "zod";

export const SSEEventSchema = z.object({
  type: z.string(),
  data: z.any(),
  timestamp: z.string(),
});

export const BroadcastNotificationSchema = z.object({
  broadcastId: z.string(),
  status: z.enum(['LIVE', 'ENDED']),
  title: z.string(),
  description: z.string().optional(),
  streamUrl: z.string().optional(),
  liveKitUrl: z.string().optional(),
  liveKitToken: z.string().optional(),
});

export type SSEEvent = z.infer<typeof SSEEventSchema>;
export type BroadcastNotification = z.infer<typeof BroadcastNotificationSchema>;