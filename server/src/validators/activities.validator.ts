import { z } from 'zod';

const energyLevelEnum = z.enum(['low', 'medium', 'high']);
const locationEnum = z.enum(['home', 'outdoor', 'any']);
const costEnum = z.enum(['free', 'low', 'medium']);
const socialEnum = z.enum(['solo', 'friends', 'both']);

export const filterActivitiesSchema = z.object({
  duration: z.coerce.number().int().min(1).max(480).optional(),
  energy: energyLevelEnum.optional(),
  location: locationEnum.optional(),
  cost: costEnum.optional(),
  social: socialEnum.optional(),
  mood: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type FilterActivitiesInput = z.infer<typeof filterActivitiesSchema>;
