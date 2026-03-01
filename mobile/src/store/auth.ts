import { create } from 'zustand';

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants';
import type { User } from '../types';

const KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
  ONBOARDING: 'auth_onboarding',
} as const;


interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;

  isHydrated: boolean;
  login: (token: string, refreshToken: string, user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  setUserProfilePhoto: (url: string) => void;
  updateUser: (fields: Partial<Pick<User, 'name' | 'city'>>) => void;
  hydrate: () => Promise<void>;
}


export const useAuthStore = create<AuthState>()((set, get) => ({

  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  hasSeenOnboarding: false,

  isHydrated: false,

  login: (token, refreshToken, user) => {
    set({ token, refreshToken, user, isAuthenticated: true });
    Promise.all([
      SecureStore.setItemAsync(KEYS.TOKEN, token),
      SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken),
      AsyncStorage.setItem(KEYS.USER, JSON.stringify(user)),
    ]).catch(() => {});
  },

  setTokens: (accessToken, refreshToken) => {
    set({ token: accessToken, refreshToken });
    Promise.all([
      SecureStore.setItemAsync(KEYS.TOKEN, accessToken),
      SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken),
    ]).catch(() => {});
  },

  logout: async () => {
    const { refreshToken } = get();
    set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
    const cleanups: Promise<void>[] = [
      SecureStore.deleteItemAsync(KEYS.TOKEN),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(KEYS.USER).then(() => {}),
    ];
    await Promise.allSettled(cleanups);
    // Server-side logout (best-effort)
    if (refreshToken) {
      fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
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
    const [token, refreshToken, userJson, onboardingDone] = await Promise.all([
      SecureStore.getItemAsync(KEYS.TOKEN),
      SecureStore.getItemAsync(KEYS.REFRESH_TOKEN),
      AsyncStorage.getItem(KEYS.USER),
      AsyncStorage.getItem(KEYS.ONBOARDING),
    ]);
    set({
      token: token ?? null,
      refreshToken: refreshToken ?? null,
      user: userJson ? (JSON.parse(userJson) as User) : null,
      isAuthenticated: !!token,
      hasSeenOnboarding: onboardingDone === 'true',
      isHydrated: true,
    });
  },

}));
