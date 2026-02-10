import { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthHeader } from '../../src/components/auth/AuthHeader';
import { AuthInput } from '../../src/components/auth/AuthInput';
import { useAuthStore } from '../../src/store/auth';
import { api, ApiError } from '../../src/api/client';
import { useFormValidation } from '../../src/hooks/useFormValidation';
import { required, email as emailRule, minLength, maxLength, passwordStrength, match } from '../../src/utils/validation';
import type { AuthResult } from '../../src/types';

export default function RegisterScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleRegister = async () => {
    if (!validateForm({ name, email, password, confirmPassword })) return;
    setError('');
    setLoading(true);
    try {
      const result = await api.post<AuthResult>('/auth/register', { name, email, password });
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
          Kayıt Ol
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          title="Şimdi Bu'ya Katıl"
          subtitle="Yeni bir deneyim için hesabını oluştur."
        />

        {error !== '' && (
          <View className="mb-4 rounded-xl bg-red-50 px-4 py-3">
            <Text className="text-sm text-red-600">{error}</Text>
          </View>
        )}

        <AuthInput
          label="Ad Soyad"
          placeholder="Adınızı ve soyadınızı girin"
          value={name}
          onChangeText={(v) => {
            setName(v);
            clearFieldError('name');
          }}
          error={errors.name}
        />

        <AuthInput
          label="E-posta Adresi"
          placeholder="E-posta adresinizi girin"
          keyboardType="email-address"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            clearFieldError('email');
          }}
          error={errors.email}
        />

        <AuthInput
          label="Şifre"
          placeholder="Güçlü bir şifre belirleyin"
          isPassword
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            clearFieldError('password');
          }}
          error={errors.password}
        />

        <AuthInput
          label="Şifre Tekrarı"
          placeholder="Şifrenizi tekrar girin"
          isPassword
          value={confirmPassword}
          onChangeText={(v) => {
            setConfirmPassword(v);
            clearFieldError('confirmPassword');
          }}
          error={errors.confirmPassword}
        />

        {/* Hesap Oluştur butonu */}
        <Pressable
          onPress={handleRegister}
          disabled={loading}
          className="flex-row items-center justify-center rounded-2xl bg-blue-500 py-4 mt-4 mb-6"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="text-base font-semibold text-white mr-2">Hesap Oluştur</Text>
              <Ionicons name="chevron-forward" size={18} color="white" />
            </>
          )}
        </Pressable>

        {/* Giriş yap linki */}
        <View className="flex-row justify-center mt-auto pb-6">
          <Text className="text-sm text-gray-400">Zaten bir hesabın var mı? </Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-sm font-semibold text-blue-500">Giriş Yap</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
