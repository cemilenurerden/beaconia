import { api } from './client';
import type { Feedback } from '../types';

interface FeedbackInput {
  decisionId: string;
  feedback: Feedback;
  reason?: string;
}

export function submitFeedback(input: FeedbackInput) {
  return api.post<void>('/feedback', input);
}
