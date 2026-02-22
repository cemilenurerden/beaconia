import '../global.css';
import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSettingsStore } from '../src/store/settings';
import { requestPermissions, syncNotifications } from '../src/notifications';

export default function RootLayout() {
  useEffect(() => {
    // İzin iste, sonra mevcut ayarlara göre bildirimleri ayarla
    requestPermissions().then((granted) => {
      if (!granted) return;
      syncNotifications(useSettingsStore.getState());
    });

    // Ayarlar değiştiğinde bildirimleri güncelle
    const unsubscribe = useSettingsStore.subscribe((state) => {
      syncNotifications(state);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <Slot />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
