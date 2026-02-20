import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
        <Text className="text-lg font-bold text-gray-900">Şifre Değiştir</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="mx-4 mt-6 gap-4">
        <View>
          <Text className="text-sm font-medium text-gray-600 mb-2">Mevcut Şifre</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Mevcut şifrenizi girin"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-gray-900"
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-600 mb-2">Yeni Şifre</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Yeni şifrenizi girin"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-gray-900"
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-600 mb-2">Yeni Şifre Tekrar</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Yeni şifrenizi tekrar girin"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-gray-900"
          />
        </View>

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          className="mt-2 bg-indigo-600 rounded-xl py-4 items-center"
        >
          <Text className="text-white font-semibold text-base">Kaydet</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
