import { api } from './client';
import type { Activity } from '../types';

export function getFavorites() {
  return api.get<Activity[]>('/favorites');
}

export function addFavorite(activityId: string) {
  return api.post<{ ok: boolean }>(`/favorites/${activityId}`);
}

export function removeFavorite(activityId: string) {
  return api.delete<{ ok: boolean }>(`/favorites/${activityId}`);
}
