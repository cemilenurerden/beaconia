import { useState, useMemo, useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthScreen } from '../../src/components/auth/AuthScreen';
import { AuthInput } from '../../src/components/auth/AuthInput';
import { AuthSubmitButton } from '../../src/components/auth/AuthSubmitButton';
import { api } from '../../src/api/client';
import { useFormValidation } from '../../src/hooks/useFormValidation';
import { useAuthSubmit } from '../../src/hooks/useAuthSubmit';
import { required, email as emailRule } from '../../src/utils/validation';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');

  const schema = useMemo(() => ({ email: [required, emailRule] }), []);
  const { errors, validateForm, clearFieldError } = useFormValidation(schema);

  const action = useCallback(async () => {
    await api.post('/auth/forgot-password', { email });
    router.push(`/(auth)/verify-reset-code?email=${encodeURIComponent(email)}`);
  }, [email, router]);

  const { loading, error, submit } = useAuthSubmit(action);

  const handleSendCode = () => {
    if (!validateForm({ email })) return;
    submit();
  };

  return (
    <AuthScreen
      navTitle="Şifremi Unuttum"
      headerTitle="Şifre Sıfırlama"
      headerSubtitle="Email adresinize bir doğrulama kodu göndereceğiz."
      error={error}
      footer={
        <Pressable onPress={() => router.back()}>
          <Text className="text-sm font-semibold text-blue-500">Giriş Ekranına Dön</Text>
        </Pressable>
      }
    >
      <AuthInput
        label="E-posta Adresi"
        placeholder="E-posta adresinizi girin"
        keyboardType="email-address"
        value={email}
        onChangeText={(v) => { setEmail(v); clearFieldError('email'); }}
        error={errors.email}
      />

      <AuthSubmitButton label="Kod Gönder" loading={loading} onPress={handleSendCode} />
    </AuthScreen>
  );
}
