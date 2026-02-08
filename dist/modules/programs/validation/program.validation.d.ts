import { z } from 'zod';
export declare const ProgramCategoryEnum: z.ZodEnum<{
    INTERVIEW: "INTERVIEW";
    TALK_SHOW: "TALK_SHOW";
    MUSIC: "MUSIC";
    TECHNOLOGY: "TECHNOLOGY";
    BUSINESS: "BUSINESS";
    SPORTS: "SPORTS";
    NEWS: "NEWS";
    ENTERTAINMENT: "ENTERTAINMENT";
    EDUCATION: "EDUCATION";
}>;
export declare const ProgramStatusEnum: z.ZodEnum<{
    ARCHIVED: "ARCHIVED";
    ACTIVE: "ACTIVE";
    INACTIVE: "INACTIVE";
}>;
export declare const createProgramSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodEnum<{
        INTERVIEW: "INTERVIEW";
        TALK_SHOW: "TALK_SHOW";
        MUSIC: "MUSIC";
        TECHNOLOGY: "TECHNOLOGY";
        BUSINESS: "BUSINESS";
        SPORTS: "SPORTS";
        NEWS: "NEWS";
        ENTERTAINMENT: "ENTERTAINMENT";
        EDUCATION: "EDUCATION";
    }>;
    schedule: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    genreId: z.ZodOptional<z.ZodString>;
    hostId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        ARCHIVED: "ARCHIVED";
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>>;
}, z.core.$strip>;
export declare const updateProgramSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<{
        INTERVIEW: "INTERVIEW";
        TALK_SHOW: "TALK_SHOW";
        MUSIC: "MUSIC";
        TECHNOLOGY: "TECHNOLOGY";
        BUSINESS: "BUSINESS";
        SPORTS: "SPORTS";
        NEWS: "NEWS";
        ENTERTAINMENT: "ENTERTAINMENT";
        EDUCATION: "EDUCATION";
    }>>;
    schedule: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    imageUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    genreId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    hostId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        ARCHIVED: "ARCHIVED";
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>>>;
}, z.core.$strip>;
export declare const programQuerySchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodEnum<{
        INTERVIEW: "INTERVIEW";
        TALK_SHOW: "TALK_SHOW";
        MUSIC: "MUSIC";
        TECHNOLOGY: "TECHNOLOGY";
        BUSINESS: "BUSINESS";
        SPORTS: "SPORTS";
        NEWS: "NEWS";
        ENTERTAINMENT: "ENTERTAINMENT";
        EDUCATION: "EDUCATION";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        ARCHIVED: "ARCHIVED";
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>>;
    hostId: z.ZodOptional<z.ZodString>;
    genreId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const createEpisodeSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    audioFile: z.ZodOptional<z.ZodString>;
    duration: z.ZodOptional<z.ZodNumber>;
    airDate: z.ZodCoercedDate<unknown>;
    broadcastId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateEpisodeSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    audioFile: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    duration: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    airDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    broadcastId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type ProgramQueryInput = z.infer<typeof programQuerySchema>;
export type CreateEpisodeInput = z.infer<typeof createEpisodeSchema>;
export type UpdateEpisodeInput = z.infer<typeof updateEpisodeSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
//# sourceMappingURL=program.validation.d.ts.map