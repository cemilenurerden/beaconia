import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="items-center mb-8">
      <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-5">
        <Ionicons name="cloud" size={40} color="#3B82F6" />
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-2">{title}</Text>
      <Text className="text-sm text-gray-400">{subtitle}</Text>
    </View>
  );
}
