import { useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthHeader } from '../../src/components/auth/AuthHeader';
import { AuthInput } from '../../src/components/auth/AuthInput';
import { api, ApiError } from '../../src/api/client';

export default function VerifyResetCodeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = code.trim().length === 6;

  const handleVerify = async () => {
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/verify-reset-code', { email, code });
      router.push(`/(auth)/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Bir hata oluştu. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResending(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setCode('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Kod gönderilemedi. Tekrar deneyin.');
    } finally {
      setResending(false);
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
          Kod Doğrulama
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          title="Doğrulama Kodu"
          subtitle={`${email} adresine gönderilen 6 haneli kodu girin.`}
        />

        {error !== '' && (
          <View className="mb-4 rounded-xl bg-red-50 px-4 py-3">
            <Text className="text-sm text-red-600">{error}</Text>
          </View>
        )}

        <AuthInput
          label="Doğrulama Kodu"
          placeholder="6 haneli kodu girin"
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={setCode}
        />

        <Pressable
          onPress={handleVerify}
          disabled={!canSubmit || loading}
          className="flex-row items-center justify-center rounded-2xl bg-blue-500 py-4 mt-4 mb-6"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="text-base font-semibold text-white mr-2">Kodu Doğrula</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </>
          )}
        </Pressable>

        <View className="flex-row justify-center">
          <Text className="text-sm text-gray-400">Kod gelmedi mi? </Text>
          <Pressable onPress={handleResend} disabled={resending}>
            <Text className="text-sm font-semibold text-blue-500">
              {resending ? 'Gönderiliyor...' : 'Tekrar Gönder'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
