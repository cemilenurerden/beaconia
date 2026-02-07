import { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  useWindowDimensions,
  type ViewabilityConfig,
  type ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { onboardingPages } from '../src/data/onboarding';
import { OnboardingPage } from '../src/components/onboarding/OnboardingPage';
import { DotIndicator } from '../src/components/onboarding/DotIndicator';
import { useAuthStore } from '../src/store/auth';

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
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
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const handleFinish = () => {
    completeOnboarding();
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    if (isLastPage) {
      handleFinish();
      return;
    }
    flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header: Skip button */}
      <View className="flex-row items-center justify-end px-6 py-2">
        {!isLastPage && (
          <Pressable onPress={handleFinish} className="flex-row items-center gap-1">
            <Text className="text-base text-gray-400">Atla</Text>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </Pressable>
        )}
      </View>

      {/* Pages */}
      <FlatList
        ref={flatListRef}
        data={onboardingPages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OnboardingPage item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Footer: Dots + Button */}
      <View className="items-center gap-6 px-6 pb-8">
        <DotIndicator total={onboardingPages.length} activeIndex={activeIndex} />

        <Pressable
          onPress={handleNext}
          className="w-full flex-row items-center justify-center gap-2 rounded-2xl bg-blue-500 py-4"
        >
          <Ionicons name="arrow-forward-circle" size={22} color="white" />
          <Text className="text-base font-semibold text-white">
            {onboardingPages[activeIndex].buttonText}
          </Text>
        </Pressable>

        {isLastPage && (
          <Text className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Premium Karar Deneyimi
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
