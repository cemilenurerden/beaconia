import { useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthHeader } from '../../src/components/auth/AuthHeader';
import { AuthInput } from '../../src/components/auth/AuthInput';
import { api, ApiError } from '../../src/api/client';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email, code } = useLocalSearchParams<{ email: string; code: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = newPassword.length >= 6 && newPassword === confirmPassword;

  const handleReset = async () => {
    if (!canSubmit) return;

    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, code, newPassword });
      router.replace('/(auth)/login');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Bir hata oluştu. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200" />
      <View className="absolute right-0 top-0 bottom-0 w-1 bg-blue-200" />

      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text className="flex-1 text-center text-base font-semibold text-gray-900 mr-6">
          Yeni Şifre
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          title="Yeni Şifre Belirle"
          subtitle="Hesabınız için yeni bir şifre oluşturun."
        />

        {error !== '' && (
          <View className="mb-4 rounded-xl bg-red-50 px-4 py-3">
            <Text className="text-sm text-red-600">{error}</Text>
          </View>
        )}

        <AuthInput
          label="Yeni Şifre"
          placeholder="En az 6 karakter"
          isPassword
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <AuthInput
          label="Şifre Tekrar"
          placeholder="Şifrenizi tekrar girin"
          isPassword
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable
          onPress={handleReset}
          disabled={!canSubmit || loading}
          className="flex-row items-center justify-center rounded-2xl bg-blue-500 py-4 mt-4 mb-6"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="text-base font-semibold text-white mr-2">Şifreyi Değiştir</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
