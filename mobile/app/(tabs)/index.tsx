import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/auth';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-5">
          <Ionicons name="person-outline" size={40} color="#3B82F6" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Hoş geldin, {user?.name ?? 'Kullanıcı'}!
        </Text>
        <Text className="text-sm text-gray-400 mb-8">Başarıyla giriş yaptın.</Text>

        <Pressable
          onPress={handleLogout}
          className="flex-row items-center justify-center rounded-2xl bg-red-500 py-4 px-8"
        >
          <Ionicons name="log-out-outline" size={18} color="white" />
          <Text className="text-base font-semibold text-white ml-2">Çıkış Yap</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
