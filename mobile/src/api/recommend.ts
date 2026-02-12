import { api } from './client';
import type { RecommendInput, RecommendResult } from '../types';

export function getRecommendation(input: RecommendInput) {
  return api.post<RecommendResult>('/recommend', input);
}
