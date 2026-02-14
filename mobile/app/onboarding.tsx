import { View, Text, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { onboardingPages } from '../src/data/onboarding';
import { OnboardingPage } from '../src/components/onboarding/OnboardingPage';
import { DotIndicator } from '../src/components/onboarding/DotIndicator';
import { useOnboarding } from '../src/hooks/useOnboarding';

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const {
    flatListRef,
    activeIndex,
    isLastPage,
    viewabilityConfig,
    onViewableItemsChanged,
    handleFinish,
    handleNext,
  } = useOnboarding();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F0' }}>
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
      <View className="items-center px-6 pb-8 pt-4 -mt-8">
        <DotIndicator total={onboardingPages.length} activeIndex={activeIndex} />

        <View className="mt-16 w-full">
          <Pressable
            onPress={handleNext}
            className="w-full flex-row items-center justify-center gap-2 rounded-2xl bg-blue-500 py-4"
          >
            <Ionicons name="arrow-forward-circle" size={22} color="white" />
            <Text className="text-base font-semibold text-white">
              {onboardingPages[activeIndex].buttonText}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
