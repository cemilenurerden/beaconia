import { useState, useMemo, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthScreen } from '../../src/components/auth/AuthScreen';
import { AuthInput } from '../../src/components/auth/AuthInput';
import { AuthSubmitButton } from '../../src/components/auth/AuthSubmitButton';
import { api } from '../../src/api/client';
import { useFormValidation } from '../../src/hooks/useFormValidation';
import { useAuthSubmit } from '../../src/hooks/useAuthSubmit';
import { required, minLength, match } from '../../src/utils/validation';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email, code } = useLocalSearchParams<{ email: string; code: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const schema = useMemo(
    () => ({
      newPassword: [required, minLength(6)],
      confirmPassword: [required, match(() => newPassword)],
    }),
    [newPassword],
  );

  const { errors, validateForm, clearFieldError } = useFormValidation(schema);

  const action = useCallback(async () => {
    await api.post('/auth/reset-password', { email, code, newPassword });
    router.replace('/(auth)/login');
  }, [email, code, newPassword, router]);

  const { loading, error, submit } = useAuthSubmit(action);

  const handleReset = () => {
    if (!validateForm({ newPassword, confirmPassword })) return;
    submit();
  };

  return (
    <AuthScreen
      navTitle="Yeni Şifre"
      headerTitle="Yeni Şifre Belirle"
      headerSubtitle="Hesabınız için yeni bir şifre oluşturun."
      error={error}
    >
      <AuthInput
        label="Yeni Şifre"
        placeholder="En az 6 karakter"
        isPassword
        value={newPassword}
        onChangeText={(v) => { setNewPassword(v); clearFieldError('newPassword'); }}
        error={errors.newPassword}
      />

      <AuthInput
        label="Şifre Tekrar"
        placeholder="Şifrenizi tekrar girin"
        isPassword
        value={confirmPassword}
        onChangeText={(v) => { setConfirmPassword(v); clearFieldError('confirmPassword'); }}
        error={errors.confirmPassword}
      />

      <AuthSubmitButton label="Şifreyi Değiştir" loading={loading} onPress={handleReset} />
    </AuthScreen>
  );
}
