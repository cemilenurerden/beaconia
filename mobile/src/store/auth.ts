import { create } from 'zustand';
import type { User } from '../types';
import { useSettingsStore } from './settings';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  completeOnboarding: () => void;
  setUserProfilePhoto: (url: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  hasSeenOnboarding: false,
  login: (token, user) => {
    set({ token, user, isAuthenticated: true });
    if (user.profilePhoto) {
      useSettingsStore.getState().setProfilePhoto(user.profilePhoto);
    }
  },
  logout: () => set({ token: null, user: null, isAuthenticated: false }),
  completeOnboarding: () => set({ hasSeenOnboarding: true }),
  setUserProfilePhoto: (url) =>
    set((state) => ({ user: state.user ? { ...state.user, profilePhoto: url } : null })),
}));
