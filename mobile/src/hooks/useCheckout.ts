import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

function formatCardNumber(text: string) {
  const cleaned = text.replace(/\D/g, '').slice(0, 16);
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(text: string) {
  const cleaned = text.replace(/\D/g, '').slice(0, 4);
  if (cleaned.length >= 3) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  }
  return cleaned;
}

export function useCheckout() {
  const router = useRouter();
  const { plan } = useLocalSearchParams<{ plan: string }>();

  const isYearly = plan === 'yearly';
  const price = isYearly ? '₺299/yıl' : '₺40/ay';
  const priceLabel = isYearly ? 'Yıllık Plan' : 'Aylık Plan';

  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const isFormValid =
    cardHolder.trim().length >= 3 &&
    cardNumber.replace(/\s/g, '').length === 16 &&
    expiry.length === 5 &&
    cvv.length >= 3;

  function handleCardNumberChange(t: string) {
    setCardNumber(formatCardNumber(t));
  }

  function handleExpiryChange(t: string) {
    setExpiry(formatExpiry(t));
  }

  function handleCvvChange(t: string) {
    setCvv(t.replace(/\D/g, '').slice(0, 4));
  }

  function handlePayment() {
    Alert.alert('Yakında', 'Ödeme entegrasyonu henüz aktif değil.');
  }

  return {
    router,
    price,
    priceLabel,
    cardHolder,
    setCardHolder,
    cardNumber,
    handleCardNumberChange,
    expiry,
    handleExpiryChange,
    cvv,
    handleCvvChange,
    isFormValid,
    handlePayment,
  };
}
