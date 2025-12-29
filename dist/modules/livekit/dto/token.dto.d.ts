import { z } from 'zod';
export declare const TokenRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    roomName: z.ZodString;
    userName: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        broadcaster: "broadcaster";
        listener: "listener";
    }>>;
}, z.core.$strip>;
export type TokenRequestDto = z.infer<typeof TokenRequestSchema>;
//# sourceMappingURL=token.dto.d.ts.map