import { z } from 'zod';

const energyLevelEnum = z.enum(['low', 'medium', 'high']);
const locationEnum = z.enum(['home', 'outdoor', 'any']);
const costEnum = z.enum(['free', 'low', 'medium']);
const socialEnum = z.enum(['solo', 'friends', 'both']);

export const recommendSchema = z.object({
  duration: z.number().int().min(5).max(480),
  energy: energyLevelEnum,
  location: locationEnum,
  cost: costEnum,
  social: socialEnum,
  mood: z.string().optional(),
});

export type RecommendInput = z.infer<typeof recommendSchema>;
