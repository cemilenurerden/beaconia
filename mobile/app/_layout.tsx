import '../global.css';
import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { useSettingsStore } from '../src/store/settings';
import { useAuthStore } from '../src/store/auth';
import { requestPermissions, syncNotifications } from '../src/notifications';

export default function RootLayout() {
  const darkModeEnabled = useSettingsStore((s) => s.darkModeEnabled);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  // darkModeEnabled değiştiğinde NativeWind'e bildir → dark: sınıfları aktive olur
  useEffect(() => {
    setColorScheme(darkModeEnabled ? 'dark' : 'light');
  }, [darkModeEnabled]);

  useEffect(() => {
    requestPermissions().then((granted) => {
      if (!granted) return;
      syncNotifications(useSettingsStore.getState());
    });

    const unsubscribe = useSettingsStore.subscribe((state) => {
      syncNotifications(state);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <Slot />
      <StatusBar style={darkModeEnabled ? 'light' : 'dark'} />
    </SafeAreaProvider>
  );
}
