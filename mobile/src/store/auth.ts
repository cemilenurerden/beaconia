import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';

const KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  ONBOARDING: 'auth_onboarding',
} as const;

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  isHydrated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  completeOnboarding: () => void;
  setUserProfilePhoto: (url: string) => void;
  updateUser: (fields: Partial<Pick<User, 'name' | 'city'>>) => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  hasSeenOnboarding: false,
  isHydrated: false,

  login: (token, user) => {
    set({ token, user, isAuthenticated: true });
    Promise.all([
      SecureStore.setItemAsync(KEYS.TOKEN, token),
      AsyncStorage.setItem(KEYS.USER, JSON.stringify(user)),
    ]).catch(() => {});
  },

  logout: () => {
    set({ token: null, user: null, isAuthenticated: false });
    Promise.all([
      SecureStore.deleteItemAsync(KEYS.TOKEN),
      AsyncStorage.removeItem(KEYS.USER),
    ]).catch(() => {});
  },

  completeOnboarding: () => {
    set({ hasSeenOnboarding: true });
    AsyncStorage.setItem(KEYS.ONBOARDING, 'true').catch(() => {});
  },

  setUserProfilePhoto: (url) =>
    set((state) => {
      const updated = state.user ? { ...state.user, profilePhoto: url } : null;
      if (updated) AsyncStorage.setItem(KEYS.USER, JSON.stringify(updated)).catch(() => {});
      return { user: updated };
    }),

  updateUser: (fields) =>
    set((state) => {
      const updated = state.user ? { ...state.user, ...fields } : null;
      if (updated) AsyncStorage.setItem(KEYS.USER, JSON.stringify(updated)).catch(() => {});
      return { user: updated };
    }),

  hydrate: async () => {
    const [token, userJson, onboardingDone] = await Promise.all([
      SecureStore.getItemAsync(KEYS.TOKEN),
      AsyncStorage.getItem(KEYS.USER),
      AsyncStorage.getItem(KEYS.ONBOARDING),
    ]);
    set({
      token: token ?? null,
      user: userJson ? (JSON.parse(userJson) as User) : null,
      isAuthenticated: !!token,
      hasSeenOnboarding: onboardingDone === 'true',
      isHydrated: true,
    });
  },
}));
