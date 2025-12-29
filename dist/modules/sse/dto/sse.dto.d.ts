import { z } from "zod";
export declare const SSEEventSchema: z.ZodObject<{
    type: z.ZodString;
    data: z.ZodAny;
    timestamp: z.ZodString;
}, z.core.$strip>;
export declare const BroadcastNotificationSchema: z.ZodObject<{
    broadcastId: z.ZodString;
    status: z.ZodEnum<{
        LIVE: "LIVE";
        ENDED: "ENDED";
    }>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    streamUrl: z.ZodOptional<z.ZodString>;
    liveKitUrl: z.ZodOptional<z.ZodString>;
    liveKitToken: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SSEEvent = z.infer<typeof SSEEventSchema>;
export type BroadcastNotification = z.infer<typeof BroadcastNotificationSchema>;
//# sourceMappingURL=sse.dto.d.ts.map