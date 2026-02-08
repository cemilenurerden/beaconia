import { useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthHeader } from '../../src/components/auth/AuthHeader';
import { AuthInput } from '../../src/components/auth/AuthInput';
import { useAuthStore } from '../../src/store/auth';
import { api, ApiError } from '../../src/api/client';
import type { AuthResult } from '../../src/types';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = email.trim() && password.trim();

  const handleLogin = async () => {
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const result = await api.post<AuthResult>('/auth/login', { email, password });
      login(result.accessToken, result.user);
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Bir hata oluştu. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Sol ve sağ mavi border efekti */}
      <View className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200" />
      <View className="absolute right-0 top-0 bottom-0 w-1 bg-blue-200" />

      {/* Header */}
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text className="flex-1 text-center text-base font-semibold text-gray-900 mr-6">
          Giriş Yap
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader title="Hoş Geldiniz" subtitle="Devam etmek için giriş yapın." />

        {error !== '' && (
          <View className="mb-4 rounded-xl bg-red-50 px-4 py-3">
            <Text className="text-sm text-red-600">{error}</Text>
          </View>
        )}

        <AuthInput
          label="E-posta Adresi"
          placeholder="E-posta adresinizi girin"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <AuthInput
          label="Şifre"
          placeholder="Şifrenizi girin"
          isPassword
          value={password}
          onChangeText={setPassword}
        />

        <Pressable className="self-end mb-6">
          <Text className="text-sm text-gray-400">Şifremi Unuttum</Text>
        </Pressable>

        {/* Giriş Yap butonu */}
        <Pressable
          onPress={handleLogin}
          disabled={!canSubmit || loading}
          className="flex-row items-center justify-center rounded-2xl bg-blue-500 py-4 mb-6"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="text-base font-semibold text-white mr-2">Giriş Yap</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </>
          )}
        </Pressable>

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

        {/* Kayıt ol linki */}
        <View className="flex-row justify-center mt-auto pb-6">
          <Text className="text-sm text-gray-400">Henüz hesabın yok mu? </Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text className="text-sm font-semibold text-blue-500">Kayıt Ol</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
