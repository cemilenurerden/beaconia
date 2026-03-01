import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/auth';

export default function Index() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasSeenOnboarding = useAuthStore((s) => s.hasSeenOnboarding);

  // Store henüz SecureStore/AsyncStorage'dan okumadı, bekle
  if (!isHydrated) return null;

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
