import { useState } from 'react';
import { useRouter } from 'expo-router';

export type Plan = 'yearly' | 'monthly';

export const FEATURES = [
  { icon: 'refresh' as const, title: 'Sınırsız Yenileme', desc: 'Günlük yenileme limiti olmadan dilediğin kadar öneri al.' },
  { icon: 'sparkles' as const, title: 'Öncelikli AI Önerileri', desc: 'Gelişmiş AI modeliyle daha kişisel aktivite önerileri.' },
  { icon: 'star' as const, title: 'Özel Kategoriler', desc: 'Premium kullanıcılara özel aktivite kategorilerine eriş.' },
  { icon: 'analytics' as const, title: 'Detaylı İstatistikler', desc: 'Aktivite geçmişin ve alışkanlıkların hakkında detaylı analiz.' },
] as const;

export function usePremium() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('yearly');

  function handleCheckout() {
    router.push({ pathname: '/checkout', params: { plan: selectedPlan } });
  }

  return {
    router,
    selectedPlan,
    setSelectedPlan,
    handleCheckout,
  };
}
