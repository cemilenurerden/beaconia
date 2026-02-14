import { useRef, useState, useCallback } from 'react';
import { FlatList, type ViewabilityConfig, type ViewToken } from 'react-native';
import { useRouter } from 'expo-router';
import { onboardingPages } from '../data/onboarding';
import { useAuthStore } from '../store/auth';

export function useOnboarding() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const isLastPage = activeIndex === onboardingPages.length - 1;

  const viewabilityConfig: ViewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const handleFinish = useCallback(() => {
    completeOnboarding();
    router.replace('/(auth)/login');
  }, [completeOnboarding, router]);

  const handleNext = useCallback(() => {
    if (isLastPage) {
      handleFinish();
      return;
    }
    flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
  }, [isLastPage, handleFinish, activeIndex]);

  return {
    flatListRef,
    activeIndex,
    isLastPage,
    viewabilityConfig,
    onViewableItemsChanged,
    handleFinish,
    handleNext,
  };
}
