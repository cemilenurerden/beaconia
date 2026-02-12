import { z } from 'zod';

export const preferencesSchema = z.object({
  duration: z.number().int().min(5).max(480),
  energy: z.enum(['low', 'medium', 'high']),
  location: z.enum(['home', 'outdoor', 'any']),
  cost: z.enum(['free', 'low', 'medium']),
  social: z.enum(['solo', 'friends', 'both']),
  mood: z.string().optional(),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;
