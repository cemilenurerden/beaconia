import { z } from 'zod';

const feedbackEnum = z.enum(['up', 'down', 'retry', 'plan_b']);

export const feedbackSchema = z.object({
  decisionId: z.string().uuid('Geçerli bir decision ID giriniz'),
  feedback: feedbackEnum,
  reason: z.string().max(500).optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
