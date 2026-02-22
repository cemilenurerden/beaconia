import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/auth';
import { updateProfile } from '../../src/api/user';

export default function EditCityScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [city, setCity] = useState(user?.city ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const trimmed = city.trim();
    if (trimmed.length > 0 && trimmed.length < 2) {
      Alert.alert('Hata', 'Şehir en az 2 karakter olmalı.');
      return;
    }
    if (trimmed === (user?.city ?? '')) {
      router.back();
      return;
    }
    setLoading(true);
    try {
      const updated = await updateProfile({ city: trimmed || null });
      updateUser({ city: updated.city });
      router.back();
    } catch (err: any) {
      Alert.alert('Hata', err?.message ?? 'Şehir güncellenemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text className="text-lg font-bold text-gray-900">Şehir Değiştir</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="mx-4 mt-6">
        <Text className="text-sm font-medium text-gray-600 mb-2">Şehir</Text>
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="Şehrinizi girin"
          placeholderTextColor="#9CA3AF"
          className="bg-white rounded-xl px-4 py-4 text-sm text-gray-900"
          style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
          autoFocus
          maxLength={50}
        />

        <Pressable
          onPress={handleSave}
          disabled={loading}
          style={({ pressed }) => ({ opacity: pressed || loading ? 0.7 : 1 })}
          className="mt-6 bg-indigo-600 rounded-xl py-4 items-center"
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text className="text-white font-semibold text-base">Kaydet</Text>
          }
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
