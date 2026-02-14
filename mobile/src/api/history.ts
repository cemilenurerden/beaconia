import { api } from './client';
import type { Decision, Pagination } from '../types';

interface HistoryResponse {
  decisions: Decision[];
  pagination: Pagination;
}

export function getHistory(page = 1, limit = 20) {
  return api.get<HistoryResponse>(`/history?page=${page}&limit=${limit}`);
}
