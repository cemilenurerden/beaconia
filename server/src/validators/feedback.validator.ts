import { z } from 'zod';

const feedbackEnum = z.enum(['up', 'down', 'retry']);

export const feedbackSchema = z.object({
  decisionId: z.string().uuid('Geçerli bir decision ID giriniz'),
  feedback: feedbackEnum,
  reason: z.string().optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
