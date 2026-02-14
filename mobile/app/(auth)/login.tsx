import { useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthScreen } from '../../src/components/auth/AuthScreen';
import { AuthInput } from '../../src/components/auth/AuthInput';
import { AuthSubmitButton } from '../../src/components/auth/AuthSubmitButton';
import { useAuthStore } from '../../src/store/auth';
import { api } from '../../src/api/client';
import { useFormValidation } from '../../src/hooks/useFormValidation';
import { useAuthSubmit } from '../../src/hooks/useAuthSubmit';
import { required, email as emailRule, minLength, maxLength } from '../../src/utils/validation';
import type { AuthResult } from '../../src/types';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const schema = useMemo(
    () => ({
      email: [required, emailRule, maxLength(254)],
      password: [required, minLength(6), maxLength(128)],
    }),
    [],
  );

  const { errors, validateForm, clearFieldError } = useFormValidation(schema);

  const action = useCallback(async () => {
    const result = await api.post<AuthResult>('/auth/login', { email, password });
    login(result.accessToken, result.user);
    router.replace('/(tabs)');
  }, [email, password, login, router]);

  const { loading, error, submit } = useAuthSubmit(action);

  const handleLogin = () => {
    if (!validateForm({ email, password })) return;
    submit();
  };

  return (
    <AuthScreen
      navTitle="Giriş Yap"
      headerTitle="Hoş Geldiniz"
      headerSubtitle="Devam etmek için giriş yapın."
      error={error}
      footer={
        <>
          <Text className="text-sm text-gray-400">Henüz hesabın yok mu? </Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text className="text-sm font-semibold text-blue-500">Kayıt Ol</Text>
          </Pressable>
        </>
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

      <AuthInput
        label="Şifre"
        placeholder="Şifrenizi girin"
        isPassword
        value={password}
        onChangeText={(v) => { setPassword(v); clearFieldError('password'); }}
        error={errors.password}
      />

      <Pressable className="self-end mb-6" onPress={() => router.push('/(auth)/forgot-password')}>
        <Text className="text-sm text-gray-400">Şifremi Unuttum</Text>
      </Pressable>

      <AuthSubmitButton label="Giriş Yap" loading={loading} onPress={handleLogin} className="mb-6" />

      {/* VEYA ayırıcı */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-200" />
        <Text className="mx-4 text-xs text-gray-400">VEYA</Text>
        <View className="flex-1 h-px bg-gray-200" />
      </View>

      {/* Sosyal giriş butonları */}
      <View className="flex-row justify-center gap-4 mb-8">
        <Pressable className="w-12 h-12 rounded-xl bg-gray-900 items-center justify-center">
          <Ionicons name="logo-apple" size={24} color="white" />
        </Pressable>
        <Pressable className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center">
          <Ionicons name="logo-google" size={24} color="#4285F4" />
        </Pressable>
      </View>
    </AuthScreen>
  );
}
