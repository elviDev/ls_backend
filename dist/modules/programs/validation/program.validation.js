"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.updateEpisodeSchema = exports.createEpisodeSchema = exports.programQuerySchema = exports.updateProgramSchema = exports.createProgramSchema = exports.ProgramStatusEnum = exports.ProgramCategoryEnum = void 0;
const zod_1 = require("zod");
exports.ProgramCategoryEnum = zod_1.z.enum([
    'TALK_SHOW',
    'MUSIC',
    'TECHNOLOGY',
    'BUSINESS',
    'INTERVIEW',
    'SPORTS',
    'NEWS',
    'ENTERTAINMENT',
    'EDUCATION'
]);
exports.ProgramStatusEnum = zod_1.z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']);
exports.createProgramSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(255),
    description: zod_1.z.string().min(1, 'Description is required'),
    category: exports.ProgramCategoryEnum,
    schedule: zod_1.z.string().min(1, 'Schedule is required'),
    image: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url().optional(),
    genreId: zod_1.z.string().cuid().optional(),
    hostId: zod_1.z.string().cuid().optional(),
    status: exports.ProgramStatusEnum.optional()
});
exports.updateProgramSchema = exports.createProgramSchema.partial();
exports.programQuerySchema = zod_1.z.object({
    category: exports.ProgramCategoryEnum.optional(),
    status: exports.ProgramStatusEnum.optional(),
    hostId: zod_1.z.string().cuid().optional(),
    genreId: zod_1.z.string().cuid().optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().min(1).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).optional()
});
exports.createEpisodeSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(255),
    description: zod_1.z.string().optional(),
    audioFile: zod_1.z.string().url().optional(),
    duration: zod_1.z.number().min(0).optional(),
    airDate: zod_1.z.coerce.date(),
    broadcastId: zod_1.z.string().cuid().optional()
});
exports.updateEpisodeSchema = exports.createEpisodeSchema.partial();
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).optional()
});
//# sourceMappingURL=program.validation.js.map