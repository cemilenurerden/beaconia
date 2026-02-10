import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900">Geçmiş</Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
          <Ionicons name="time-outline" size={32} color="#9CA3AF" />
        </View>
        <Text className="text-base font-semibold text-gray-900 mb-1">
          Henüz geçmiş yok
        </Text>
        <Text className="text-sm text-gray-400 text-center">
          Aktivitelerini tamamladıkça{'\n'}burada görünecek.
        </Text>
      </View>
    </SafeAreaView>
  );
}
