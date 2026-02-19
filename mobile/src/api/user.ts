import { api } from './client';
import type { UserStats, UserPreferences, ProfileAnalysis } from '../types';

export function getStats() {
  return api.get<UserStats>('/user/stats');
}

export function getPreferences() {
  return api.get<UserPreferences | null>('/user/preferences');
}

export function updatePreferences(preferences: UserPreferences) {
  return api.put<UserPreferences>('/user/preferences', preferences);
}

export function getProfileAnalysis() {
  return api.get<ProfileAnalysis>('/user/profile-analysis');
}
