import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/auth';
import { useHomeStats } from '../../src/hooks/useHomeStats';
import { useSettingsStore } from '../../src/store/settings';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'Kullanıcı';
  const stats = useHomeStats();
  const isDark = useSettingsStore((s) => s.darkModeEnabled);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Selamlama */}
        <View className="px-6 pb-4" style={{ paddingTop: 80 }}>
          <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Selam {firstName},
          </Text>
          <Text className="text-3xl font-bold text-indigo-600">
            Bugün Ne Yapıyoruz?
          </Text>
        </View>

        {/* Ana kart */}
        <View className="px-6 mt-2">
          <View className={`w-full rounded-3xl ${isDark ? 'bg-slate-800' : 'bg-white'} px-8 py-8 items-center shadow-sm border ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
            <View className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'} items-center justify-center mb-6`}>
              <Ionicons name="sparkles" size={32} color="#4F46E5" />
            </View>

            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} text-center mb-3`}>
              Harekete geçmeye{'\n'}hazır mısın?
            </Text>

            <Text className={`text-base ${isDark ? 'text-slate-400' : 'text-gray-400'} text-center mb-8 leading-6`}>
              Senin için seçtiğimiz günlük{'\n'}aktivitelerle potansiyelini{'\n'}keşfet.
            </Text>

            <Pressable onPress={() => router.push('/activity-suggest')} className="flex-row items-center justify-center rounded-2xl py-5 px-8 w-full" style={{ backgroundColor: '#4F46E5' }}>
              <Text className="text-lg font-semibold text-white mr-2">
                Hadi Başlayalım
              </Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Bilgi kartları */}
        <View className="flex-row px-6 mt-4 gap-3">
          <View className={`flex-1 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} p-5 shadow-sm border ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
            <View className={`w-10 h-10 rounded-xl ${isDark ? 'bg-green-900' : 'bg-green-100'} items-center justify-center mb-3`}>
              <Ionicons name="flag" size={20} color="#22C55E" />
            </View>
            <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-400'} mb-1`}>Günlük Hedef</Text>
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stats.dailyCompleted}/{stats.dailyGoal}
            </Text>
            <Text className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Tamamlandı</Text>
          </View>

          <View className={`flex-1 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} p-5 shadow-sm border ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
            <View className={`w-10 h-10 rounded-xl ${isDark ? 'bg-orange-900' : 'bg-orange-100'} items-center justify-center mb-3`}>
              <Ionicons name="flame" size={20} color="#F97316" />
            </View>
            <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-400'} mb-1`}>Streak</Text>
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.streak} Gün</Text>
            <Text className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Devam et!</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
