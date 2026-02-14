import { useState, useMemo, useCallback } from 'react';
import { Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthScreen } from '../../src/components/auth/AuthScreen';
import { AuthInput } from '../../src/components/auth/AuthInput';
import { AuthSubmitButton } from '../../src/components/auth/AuthSubmitButton';
import { useAuthStore } from '../../src/store/auth';
import { api } from '../../src/api/client';
import { useFormValidation } from '../../src/hooks/useFormValidation';
import { useAuthSubmit } from '../../src/hooks/useAuthSubmit';
import { required, email as emailRule, minLength, maxLength, passwordStrength, match } from '../../src/utils/validation';
import type { AuthResult } from '../../src/types';

export default function RegisterScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const schema = useMemo(
    () => ({
      name: [required, minLength(2), maxLength(50)],
      email: [required, emailRule, maxLength(254)],
      password: [required, minLength(6), maxLength(128), passwordStrength],
      confirmPassword: [required, match(() => password)],
    }),
    [password],
  );

  const { errors, validateForm, clearFieldError } = useFormValidation(schema);

  const action = useCallback(async () => {
    const result = await api.post<AuthResult>('/auth/register', { name, email, password });
    login(result.accessToken, result.user);
    router.replace('/(tabs)');
  }, [name, email, password, login, router]);

  const { loading, error, submit } = useAuthSubmit(action);

  const handleRegister = () => {
    if (!validateForm({ name, email, password, confirmPassword })) return;
    submit();
  };

  return (
    <AuthScreen
      navTitle="Kayıt Ol"
      headerTitle="Şimdi Bu'ya Katıl"
      headerSubtitle="Yeni bir deneyim için hesabını oluştur."
      error={error}
      footer={
        <>
          <Text className="text-sm text-gray-400">Zaten bir hesabın var mı? </Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-sm font-semibold text-blue-500">Giriş Yap</Text>
          </Pressable>
        </>
      }
    >
      <AuthInput
        label="Ad Soyad"
        placeholder="Adınızı ve soyadınızı girin"
        value={name}
        onChangeText={(v) => { setName(v); clearFieldError('name'); }}
        error={errors.name}
      />

      <AuthInput
        label="E-posta Adresi"
        placeholder="E-posta adresinizi girin"
        keyboardType="email-address"
        value={email}
        onChangeText={(v) => { setEmail(v); clearFieldError('email'); }}
        error={errors.email}
      />

      <AuthInput
        label="Şifre"
        placeholder="Güçlü bir şifre belirleyin"
        isPassword
        value={password}
        onChangeText={(v) => { setPassword(v); clearFieldError('password'); }}
        error={errors.password}
      />

      <AuthInput
        label="Şifre Tekrarı"
        placeholder="Şifrenizi tekrar girin"
        isPassword
        value={confirmPassword}
        onChangeText={(v) => { setConfirmPassword(v); clearFieldError('confirmPassword'); }}
        error={errors.confirmPassword}
      />

      <AuthSubmitButton
        label="Hesap Oluştur"
        loading={loading}
        onPress={handleRegister}
        icon="chevron-forward"
      />
    </AuthScreen>
  );
}
