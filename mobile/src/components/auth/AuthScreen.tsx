import { type ReactNode } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthHeader } from './AuthHeader';

interface AuthScreenProps {
  navTitle: string;
  headerTitle: string;
  headerSubtitle: string;
  error: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthScreen({ navTitle, headerTitle, headerSubtitle, error, children, footer }: AuthScreenProps) {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Sol ve sağ mavi border efekti */}
      <View className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200" />
      <View className="absolute right-0 top-0 bottom-0 w-1 bg-blue-200" />

      {/* Header */}
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text className="flex-1 text-center text-base font-semibold text-gray-900 mr-6">
          {navTitle}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader title={headerTitle} subtitle={headerSubtitle} />

        {error !== '' && (
          <View className="mb-4 rounded-xl bg-red-50 px-4 py-3">
            <Text className="text-sm text-red-600">{error}</Text>
          </View>
        )}

        {children}

        {footer && (
          <View className="flex-row justify-center mt-auto pb-6">
            {footer}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
