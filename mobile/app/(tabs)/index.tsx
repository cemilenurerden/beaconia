import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/auth';
import { useHomeStats } from '../../src/hooks/useHomeStats';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'Kullanıcı';
  const stats = useHomeStats();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Üst kısım */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
          <Ionicons name="flash" size={20} color="#3B82F6" />
        </View>
        <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center">
          <Text className="text-white font-bold text-sm">
            {firstName.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Selamlama */}
      <View className="px-6 pt-8 pb-4">
        <Text className="text-3xl font-bold text-gray-900">
          Selam {firstName},
        </Text>
        <Text className="text-3xl font-bold text-blue-500">
          Bugün Ne Yapıyoruz?
        </Text>
      </View>

      {/* Ana kart */}
      <View className="px-6 mt-4">
        <View className="w-full rounded-3xl bg-white px-8 py-10 items-center shadow-sm border border-gray-100">
          <View className="w-16 h-16 rounded-2xl bg-blue-100 items-center justify-center mb-6">
            <Ionicons name="sparkles" size={32} color="#3B82F6" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
            Harekete geçmeye{'\n'}hazır mısın?
          </Text>

          <Text className="text-base text-gray-400 text-center mb-8 leading-6">
            Senin için seçtiğimiz günlük{'\n'}aktivitelerle potansiyelini{'\n'}keşfet.
          </Text>

          <Pressable onPress={() => router.push('/activity-suggest')} className="flex-row items-center justify-center rounded-2xl bg-blue-500 py-5 px-8 w-full">
            <Text className="text-lg font-semibold text-white mr-2">
              Hadi Başlayalım
            </Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Bilgi kartları */}
      <View className="flex-row px-6 mt-4 gap-3">
        <View className="flex-1 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <View className="w-10 h-10 rounded-xl bg-green-100 items-center justify-center mb-3">
            <Ionicons name="flag" size={20} color="#22C55E" />
          </View>
          <Text className="text-sm text-gray-400 mb-1">Günlük Hedef</Text>
          <Text className="text-xl font-bold text-gray-900">
            {stats.dailyCompleted}/{stats.dailyGoal}
          </Text>
          <Text className="text-xs text-gray-400">Tamamlandı</Text>
        </View>

        <View className="flex-1 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <View className="w-10 h-10 rounded-xl bg-orange-100 items-center justify-center mb-3">
            <Ionicons name="flame" size={20} color="#F97316" />
          </View>
          <Text className="text-sm text-gray-400 mb-1">Streak</Text>
          <Text className="text-xl font-bold text-gray-900">{stats.streak} Gün</Text>
          <Text className="text-xs text-gray-400">Devam et!</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
