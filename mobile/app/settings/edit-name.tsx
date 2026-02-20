import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/auth';

export default function EditNameScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.name ?? '');

  const handleSave = () => {
    Alert.alert('Yakında', 'Bu özellik yakında geliyor.');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text className="text-lg font-bold text-gray-900">Adı Değiştir</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="mx-4 mt-6">
        <Text className="text-sm font-medium text-gray-600 mb-2">Ad Soyad</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Adınızı girin"
          placeholderTextColor="#9CA3AF"
          className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-gray-900"
          autoFocus
        />

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          className="mt-6 bg-indigo-600 rounded-xl py-4 items-center"
        >
          <Text className="text-white font-semibold text-base">Kaydet</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
