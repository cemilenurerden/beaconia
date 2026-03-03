import { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthScreen } from '../../src/components/auth/AuthScreen';
import { OtpInput } from '../../src/components/auth/OtpInput';
import { AuthSubmitButton } from '../../src/components/auth/AuthSubmitButton';
import { api, ApiError } from '../../src/api/client';
import { useAuthSubmit } from '../../src/hooks/useAuthSubmit';
import { useResendCooldown } from '../../src/hooks/useResendCooldown';
import { useAuthStore } from '../../src/store/auth';
import type { AuthResult } from '../../src/types';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const login = useAuthStore((s) => s.login);
  const { seconds, canResend, reset } = useResendCooldown();

  const [code, setCode] = useState('');

  const verifyAction = useCallback(async () => {
    const result = await api.post<AuthResult>('/auth/verify-email', { email, code });
    login(result.accessToken, result.refreshToken, result.user);
    router.replace('/(tabs)');
  }, [email, code, login, router]);

  const { loading, error, submit } = useAuthSubmit(verifyAction);

  // 6 rakam girilince otomatik gönder
  useEffect(() => {
    if (code.length === 6) submit();
  }, [code, submit]);

  const handleResend = async () => {
    try {
      await api.post('/auth/resend-verification', { email });
      setCode('');
      reset();
      Alert.alert('Başarılı', 'Yeni doğrulama kodu gönderildi.');
    } catch (e) {
      Alert.alert('Hata', e instanceof ApiError ? e.message : 'Kod gönderilemedi. Tekrar deneyin.');
    }
  };

  return (
    <AuthScreen
      navTitle="E-posta Doğrulama"
      headerTitle="E-postanı Doğrula"
      headerSubtitle={`${email} adresine gönderilen 6 haneli kodu girin.`}
      error={error}
    >
      <OtpInput value={code} onChange={setCode} disabled={loading} />

      <AuthSubmitButton
        label="Doğrula"
        loading={loading}
        onPress={submit}
        disabled={code.length !== 6}
      />

      <View className="flex-row justify-center mt-2">
        <Text className="text-sm text-gray-400">Kod gelmedi mi? </Text>
        {canResend ? (
          <Pressable onPress={handleResend}>
            <Text className="text-sm font-semibold text-indigo-600">Tekrar Gönder</Text>
          </Pressable>
        ) : (
          <Text className="text-sm text-gray-400">{seconds}s sonra tekrar gönder</Text>
        )}
      </View>
    </AuthScreen>
  );
}
