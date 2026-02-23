import { api } from './client';
import type { UserStats, UserPreferences, ProfileAnalysis, User, Insight } from '../types';

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

export function updateProfile(data: { name?: string; city?: string | null }) {
  return api.put<Pick<User, 'id' | 'name' | 'email' | 'city' | 'profilePhoto'>>('/user/profile', data);
}

export function changePassword(data: { currentPassword: string; newPassword: string }) {
  return api.put<{ message: string }>('/user/password', data);
}

export function deleteAccount() {
  return api.delete<{ message: string }>('/user/account');
}

export function getSelfAnalysis() {
  return api.get<Insight[]>('/user/self-analysis');
}
