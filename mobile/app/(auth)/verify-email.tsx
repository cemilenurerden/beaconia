import { useState, useCallback } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthScreen } from '../../src/components/auth/AuthScreen';
import { AuthInput } from '../../src/components/auth/AuthInput';
import { AuthSubmitButton } from '../../src/components/auth/AuthSubmitButton';
import { api, ApiError } from '../../src/api/client';
import { useAuthSubmit } from '../../src/hooks/useAuthSubmit';
import { useAuthStore } from '../../src/store/auth';
import type { AuthResult } from '../../src/types';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const login = useAuthStore((s) => s.login);

  const [code, setCode] = useState('');
  const [resending, setResending] = useState(false);

  const canSubmit = code.trim().length === 6;

  const verifyAction = useCallback(async () => {
    const result = await api.post<AuthResult>('/auth/verify-email', { email, code });
    login(result.accessToken, result.refreshToken, result.user);
    router.replace('/(tabs)');
  }, [email, code, login, router]);

  const { loading, error, submit } = useAuthSubmit(verifyAction);

  const handleVerify = () => {
    if (!canSubmit) return;
    submit();
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-verification', { email });
      setCode('');
      Alert.alert('Başarılı', 'Yeni doğrulama kodu gönderildi.');
    } catch (e) {
      Alert.alert('Hata', e instanceof ApiError ? e.message : 'Kod gönderilemedi. Tekrar deneyin.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthScreen
      navTitle="E-posta Doğrulama"
      headerTitle="E-postanı Doğrula"
      headerSubtitle={`${email} adresine gönderilen 6 haneli kodu girin.`}
      error={error}
    >
      <AuthInput
        label="Doğrulama Kodu"
        placeholder="6 haneli kodu girin"
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />

      <AuthSubmitButton
        label="Doğrula"
        loading={loading}
        onPress={handleVerify}
        disabled={!canSubmit}
      />

      <View className="flex-row justify-center">
        <Text className="text-sm text-gray-400">Kod gelmedi mi? </Text>
        <Pressable onPress={handleResend} disabled={resending}>
          <Text className="text-sm font-semibold text-indigo-600">
            {resending ? 'Gönderiliyor...' : 'Tekrar Gönder'}
          </Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}
