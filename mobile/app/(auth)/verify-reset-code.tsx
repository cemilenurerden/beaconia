import { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthScreen } from '../../src/components/auth/AuthScreen';
import { OtpInput } from '../../src/components/auth/OtpInput';
import { AuthSubmitButton } from '../../src/components/auth/AuthSubmitButton';
import { api, ApiError } from '../../src/api/client';
import { useAuthSubmit } from '../../src/hooks/useAuthSubmit';
import { useResendCooldown } from '../../src/hooks/useResendCooldown';

export default function VerifyResetCodeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { seconds, canResend, reset } = useResendCooldown();

  const [code, setCode] = useState('');

  const verifyAction = useCallback(async () => {
    await api.post('/auth/verify-reset-code', { email, code });
    router.push(`/(auth)/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
  }, [email, code, router]);

  const { loading, error, submit } = useAuthSubmit(verifyAction);

  // 6 rakam girilince otomatik gönder
  useEffect(() => {
    if (code.length === 6) submit();
  }, [code, submit]);

  const handleResend = async () => {
    try {
      await api.post('/auth/forgot-password', { email });
      setCode('');
      reset();
      Alert.alert('Başarılı', 'Yeni doğrulama kodu gönderildi.');
    } catch (e) {
      Alert.alert('Hata', e instanceof ApiError ? e.message : 'Kod gönderilemedi. Tekrar deneyin.');
    }
  };

  return (
    <AuthScreen
      navTitle="Kod Doğrulama"
      headerTitle="Doğrulama Kodu"
      headerSubtitle={`${email} adresine gönderilen 6 haneli kodu girin.`}
      error={error}
    >
      <OtpInput value={code} onChange={setCode} disabled={loading} />

      <AuthSubmitButton
        label="Kodu Doğrula"
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
