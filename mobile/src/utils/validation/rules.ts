export const required = (value: string): string | null =>
  value.trim() ? null : 'Bu alan zorunludur';

export const email = (value: string): string | null => {
  if (!value.trim()) return null;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value) ? null : 'Geçerli bir e-posta adresi girin';
};

export const minLength =
  (min: number) =>
  (value: string): string | null => {
    if (!value) return null;
    return value.length >= min ? null : `En az ${min} karakter olmalıdır`;
  };

export const maxLength =
  (max: number) =>
  (value: string): string | null => {
    if (!value) return null;
    return value.length <= max ? null : `En fazla ${max} karakter olmalıdır`;
  };

export const passwordStrength = (value: string): string | null => {
  if (!value) return null;
  if (!/[a-z]/.test(value)) return 'Şifre en az 1 küçük harf içermelidir';
  if (!/[A-Z]/.test(value)) return 'Şifre en az 1 büyük harf içermelidir';
  if (!/[0-9]/.test(value)) return 'Şifre en az 1 rakam içermelidir';
  return null;
};

export const match =
  (getTarget: () => string) =>
  (value: string): string | null => {
    if (!value) return null;
    return value === getTarget() ? null : 'Alanlar eşleşmiyor';
  };
