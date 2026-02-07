import { View, Text, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { OnboardingItem } from '../../data/onboarding';

interface OnboardingPageProps {
  item: OnboardingItem;
}

export function OnboardingPage({ item }: OnboardingPageProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-8">
      <View className="mb-10 h-36 w-36 items-center justify-center rounded-3xl bg-blue-50">
        <View className="h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Ionicons name={item.icon} size={48} color="#3B82F6" />
        </View>
      </View>

      <Text className="mb-4 text-center text-3xl font-bold text-gray-900">
        {item.title}
      </Text>

      <Text className="text-center text-base leading-6 text-gray-500">
        {item.description}
      </Text>
    </View>
  );
}
