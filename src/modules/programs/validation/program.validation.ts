import { z } from 'zod';

export const ProgramCategoryEnum = z.enum([
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

export const ProgramStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']);

export const createProgramSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  category: ProgramCategoryEnum,
  schedule: z.string().min(1, 'Schedule is required'),
  image: z.string().optional(),
  imageUrl: z.string().url().optional(),
  genreId: z.string().cuid().optional(),
  hostId: z.string().cuid().optional(),
  status: ProgramStatusEnum.optional()
});

export const updateProgramSchema = createProgramSchema.partial();

export const programQuerySchema = z.object({
  category: ProgramCategoryEnum.optional(),
  status: ProgramStatusEnum.optional(),
  hostId: z.string().cuid().optional(),
  genreId: z.string().cuid().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional()
});

export const createEpisodeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  audioFile: z.string().url().optional(),
  duration: z.number().min(0).optional(),
  airDate: z.coerce.date(),
  broadcastId: z.string().cuid().optional()
});

export const updateEpisodeSchema = createEpisodeSchema.partial();

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional()
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type ProgramQueryInput = z.infer<typeof programQuerySchema>;
export type CreateEpisodeInput = z.infer<typeof createEpisodeSchema>;
export type UpdateEpisodeInput = z.infer<typeof updateEpisodeSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;