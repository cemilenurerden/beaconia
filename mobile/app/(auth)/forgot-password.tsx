import { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthHeader } from '../../src/components/auth/AuthHeader';
import { AuthInput } from '../../src/components/auth/AuthInput';
import { api, ApiError } from '../../src/api/client';
import { useFormValidation } from '../../src/hooks/useFormValidation';
import { required, email as emailRule } from '../../src/utils/validation';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const schema = useMemo(() => ({ email: [required, emailRule] }), []);

  const { errors, validateForm, clearFieldError } = useFormValidation(schema);

  const handleSendCode = async () => {
    if (!validateForm({ email })) return;
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      router.push(`/(auth)/verify-reset-code?email=${encodeURIComponent(email)}`);
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
          Şifremi Unuttum
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          title="Şifre Sıfırlama"
          subtitle="Email adresinize bir doğrulama kodu göndereceğiz."
        />

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
          onChangeText={(v) => {
            setEmail(v);
            clearFieldError('email');
          }}
          error={errors.email}
        />

        <Pressable
          onPress={handleSendCode}
          disabled={loading}
          className="flex-row items-center justify-center rounded-2xl bg-blue-500 py-4 mt-4 mb-6"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="text-base font-semibold text-white mr-2">Kod Gönder</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </>
          )}
        </Pressable>

        <View className="flex-row justify-center mt-auto pb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-sm font-semibold text-blue-500">Giriş Ekranına Dön</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
