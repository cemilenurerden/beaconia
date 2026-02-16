import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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

export default function CheckoutScreen() {
  const router = useRouter();
  const { plan } = useLocalSearchParams<{ plan: string }>();

  const isYearly = plan === 'yearly';
  const price = isYearly ? '₺299/yıl' : '₺40/ay';
  const priceLabel = isYearly ? 'Yıllık Plan' : 'Aylık Plan';

  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid =
    cardHolder.trim().length >= 3 &&
    cardNumber.replace(/\s/g, '').length === 16 &&
    expiry.length === 5 &&
    cvv.length >= 3;

  async function handlePayment() {
    if (!isFormValid) return;
    setLoading(true);
    // TODO: Gerçek ödeme entegrasyonu (Stripe, iyzico vb.)
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Ödeme Başarılı!',
        'Premium üyeliğin aktif edildi. Artık sınırsız yenileme yapabilirsin!',
        [{ text: 'Harika!', onPress: () => router.dismissAll() }],
      );
    }, 2000);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F172A' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginLeft: 12 }}>Ödeme</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Plan Özeti */}
          <View style={{
            backgroundColor: '#1E293B', borderRadius: 16, padding: 20,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 28, borderWidth: 1, borderColor: '#7C3AED44',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: '#7C3AED22', alignItems: 'center', justifyContent: 'center',
              }}>
                <Ionicons name="diamond" size={22} color="#A78BFA" />
              </View>
              <View style={{ marginLeft: 14 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>Beaconia Premium</Text>
                <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>{priceLabel}</Text>
              </View>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#A78BFA' }}>{price}</Text>
          </View>

          {/* Kart Bilgileri */}
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#94A3B8', letterSpacing: 1, marginBottom: 16 }}>
            KART BİLGİLERİ
          </Text>

          {/* Kart Sahibi */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#CBD5E1', marginBottom: 8 }}>Kart Üzerindeki İsim</Text>
            <View style={{
              backgroundColor: '#1E293B', borderRadius: 14, flexDirection: 'row',
              alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: '#334155',
            }}>
              <Ionicons name="person-outline" size={18} color="#64748B" />
              <TextInput
                value={cardHolder}
                onChangeText={setCardHolder}
                placeholder="Ad Soyad"
                placeholderTextColor="#475569"
                autoCapitalize="words"
                style={{ flex: 1, color: '#FFFFFF', fontSize: 16, paddingVertical: 16, marginLeft: 12 }}
              />
            </View>
          </View>

          {/* Kart Numarası */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#CBD5E1', marginBottom: 8 }}>Kart Numarası</Text>
            <View style={{
              backgroundColor: '#1E293B', borderRadius: 14, flexDirection: 'row',
              alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: '#334155',
            }}>
              <Ionicons name="card-outline" size={18} color="#64748B" />
              <TextInput
                value={cardNumber}
                onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor="#475569"
                keyboardType="number-pad"
                maxLength={19}
                style={{ flex: 1, color: '#FFFFFF', fontSize: 16, paddingVertical: 16, marginLeft: 12, letterSpacing: 1 }}
              />
            </View>
          </View>

          {/* Son Kullanma & CVV */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#CBD5E1', marginBottom: 8 }}>Son Kullanma</Text>
              <View style={{
                backgroundColor: '#1E293B', borderRadius: 14, flexDirection: 'row',
                alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: '#334155',
              }}>
                <Ionicons name="calendar-outline" size={18} color="#64748B" />
                <TextInput
                  value={expiry}
                  onChangeText={(t) => setExpiry(formatExpiry(t))}
                  placeholder="AA/YY"
                  placeholderTextColor="#475569"
                  keyboardType="number-pad"
                  maxLength={5}
                  style={{ flex: 1, color: '#FFFFFF', fontSize: 16, paddingVertical: 16, marginLeft: 12 }}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#CBD5E1', marginBottom: 8 }}>CVV</Text>
              <View style={{
                backgroundColor: '#1E293B', borderRadius: 14, flexDirection: 'row',
                alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: '#334155',
              }}>
                <Ionicons name="lock-closed-outline" size={18} color="#64748B" />
                <TextInput
                  value={cvv}
                  onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))}
                  placeholder="000"
                  placeholderTextColor="#475569"
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                  style={{ flex: 1, color: '#FFFFFF', fontSize: 16, paddingVertical: 16, marginLeft: 12 }}
                />
              </View>
            </View>
          </View>

          {/* Güvenlik Notu */}
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: '#1E293B', borderRadius: 12, padding: 14, marginBottom: 24,
          }}>
            <Ionicons name="shield-checkmark" size={20} color="#059669" />
            <Text style={{ fontSize: 12, color: '#94A3B8', marginLeft: 10, flex: 1 }}>
              Kart bilgilerin 256-bit SSL ile şifrelenir. Güvenli ödeme altyapısı kullanılmaktadır.
            </Text>
          </View>

          {/* Ödeme Butonu */}
          <TouchableOpacity
            onPress={handlePayment}
            disabled={!isFormValid || loading}
            activeOpacity={0.8}
            style={{
              backgroundColor: isFormValid && !loading ? '#7C3AED' : '#334155',
              borderRadius: 16, paddingVertical: 20,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: isFormValid && !loading ? '#FFFFFF' : '#64748B' }}>
              {loading ? 'Ödeme Yapılıyor...' : `${price} Öde`}
            </Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 11, color: '#475569', textAlign: 'center', marginTop: 14, lineHeight: 18 }}>
            Ödeme butonuna basarak Kullanım Koşullarını kabul etmiş olursun. Aboneliğini istediğin zaman iptal edebilirsin.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
