import { create } from 'zustand';

interface SettingsState {
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  notifyActivitySuggestions: boolean;
  notifyReminders: boolean;
  notifyAppNews: boolean;
  profilePhoto: string | null;
  language: 'tr' | 'en';
  toggleNotifications: () => void;
  toggleDarkMode: () => void;
  toggleActivitySuggestions: () => void;
  toggleReminders: () => void;
  toggleAppNews: () => void;
  setProfilePhoto: (uri: string | null) => void;
  setLanguage: (lang: 'tr' | 'en') => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  notificationsEnabled: true,
  darkModeEnabled: false,
  notifyActivitySuggestions: true,
  notifyReminders: true,
  notifyAppNews: false,
  profilePhoto: null,
  language: 'tr',
  toggleNotifications: () =>
    set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
  toggleDarkMode: () =>
    set((state) => ({ darkModeEnabled: !state.darkModeEnabled })),
  toggleActivitySuggestions: () =>
    set((state) => ({ notifyActivitySuggestions: !state.notifyActivitySuggestions })),
  toggleReminders: () =>
    set((state) => ({ notifyReminders: !state.notifyReminders })),
  toggleAppNews: () =>
    set((state) => ({ notifyAppNews: !state.notifyAppNews })),
  setProfilePhoto: (uri) => set({ profilePhoto: uri }),
  setLanguage: (lang) => set({ language: lang }),
}));
