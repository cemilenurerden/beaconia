import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { changePassword } from '../../src/api/user';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Tüm alanları doldurun.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalı.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor.');
      return;
    }
    setLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      Alert.alert('Başarılı', 'Şifreniz güncellendi.', [
        { text: 'Tamam', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Hata', err?.message ?? 'Şifre değiştirilemedi.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
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
            className="bg-white rounded-xl px-4 py-4 text-sm text-gray-900"
            style={inputStyle}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-600 mb-2">Yeni Şifre</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="En az 6 karakter"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="bg-white rounded-xl px-4 py-4 text-sm text-gray-900"
            style={inputStyle}
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
            className="bg-white rounded-xl px-4 py-4 text-sm text-gray-900"
            style={inputStyle}
          />
        </View>

        <Pressable
          onPress={handleSave}
          disabled={loading}
          style={({ pressed }) => ({ opacity: pressed || loading ? 0.7 : 1 })}
          className="mt-2 bg-indigo-600 rounded-xl py-4 items-center"
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
