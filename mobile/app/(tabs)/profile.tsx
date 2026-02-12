import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900">Profil</Text>
      </View>

      <View className="flex-1 px-6 pt-6">
        {/* Avatar ve kullanıcı bilgisi */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-blue-500 items-center justify-center mb-3">
            <Text className="text-white font-bold text-2xl">
              {user?.name?.charAt(0).toUpperCase() ?? 'K'}
            </Text>
          </View>
          <Text className="text-lg font-bold text-gray-900">
            {user?.name ?? 'Kullanıcı'}
          </Text>
          <Text className="text-sm text-gray-400">{user?.email}</Text>
        </View>

        {/* Çıkış butonu */}
        <View className="mt-auto pb-6">
          <Pressable
            onPress={handleLogout}
            className="flex-row items-center justify-center rounded-2xl bg-red-50 py-4"
          >
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text className="text-base font-semibold text-red-500 ml-2">
              Çıkış Yap
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
