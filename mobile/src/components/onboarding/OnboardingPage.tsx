import { View, Text, useWindowDimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { OnboardingItem } from '../../data/onboarding';

interface OnboardingPageProps {
  item: OnboardingItem;
}

export function OnboardingPage({ item }: OnboardingPageProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={{ width, backgroundColor: '#F5F5F0' }} className="flex-1 items-center justify-center px-8">
      {/* Outer soft shadow */}
      <View
        style={{
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: '#F5F5F0',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 40,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.12,
              shadowRadius: 20,
            },
            android: {
              elevation: 12,
            },
          }),
        }}
      >
        {/* Inner white ring */}
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
              },
              android: {
                elevation: 4,
              },
            }),
          }}
        >
          {/* Gradient circle */}
          <LinearGradient
            colors={item.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={item.icon} size={36} color={item.iconColor} />
          </LinearGradient>
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
