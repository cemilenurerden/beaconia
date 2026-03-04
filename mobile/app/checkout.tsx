import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/constants/theme';
import { useCheckout } from '../src/hooks/useCheckout';

type CardInputProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder'>;

function CardInput({ icon, label, value, onChangeText, placeholder, style, ...rest }: CardInputProps) {
  return (
    <View>
      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.slate300, marginBottom: 8 }}>{label}</Text>
      <View style={{
        backgroundColor: colors.slate800, borderRadius: 14, flexDirection: 'row',
        alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: colors.slate700,
      }}>
        <Ionicons name={icon} size={18} color={colors.slate500} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.slate600}
          style={[{ flex: 1, color: colors.white, fontSize: 16, paddingVertical: 16, marginLeft: 12 }, style]}
          {...rest}
        />
      </View>
    </View>
  );
}

export default function CheckoutScreen() {
  const {
    router, price, priceLabel,
    cardHolder, setCardHolder,
    cardNumber, handleCardNumberChange,
    expiry, handleExpiryChange,
    cvv, handleCvvChange,
    isFormValid, handlePayment,
  } = useCheckout();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.slate900 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.white, marginLeft: 12 }}>Ödeme</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Plan Özeti */}
          <View style={{
            backgroundColor: colors.slate800, borderRadius: 16, padding: 20,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 28, borderWidth: 1, borderColor: '#4F46E544',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: '#4F46E522', alignItems: 'center', justifyContent: 'center',
              }}>
                <Ionicons name="diamond" size={22} color={colors.purpleMid} />
              </View>
              <View style={{ marginLeft: 14 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.white }}>Beaconia Premium</Text>
                <Text style={{ fontSize: 13, color: colors.slate400, marginTop: 2 }}>{priceLabel}</Text>
              </View>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.purpleMid }}>{price}</Text>
          </View>

          {/* Kart Bilgileri */}
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.slate400, letterSpacing: 1, marginBottom: 16 }}>
            KART BİLGİLERİ
          </Text>

          <View style={{ marginBottom: 16 }}>
            <CardInput
              icon="person-outline"
              label="Kart Üzerindeki İsim"
              value={cardHolder}
              onChangeText={setCardHolder}
              placeholder="Ad Soyad"
              autoCapitalize="words"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <CardInput
              icon="card-outline"
              label="Kart Numarası"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              placeholder="0000 0000 0000 0000"
              keyboardType="number-pad"
              maxLength={19}
              style={{ letterSpacing: 1 }}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
            <View style={{ flex: 1 }}>
              <CardInput
                icon="calendar-outline"
                label="Son Kullanma"
                value={expiry}
                onChangeText={handleExpiryChange}
                placeholder="AA/YY"
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CardInput
                icon="lock-closed-outline"
                label="CVV"
                value={cvv}
                onChangeText={handleCvvChange}
                placeholder="000"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>

          {/* Güvenlik Notu */}
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: colors.slate800, borderRadius: 12, padding: 14, marginBottom: 24,
          }}>
            <Ionicons name="shield-checkmark" size={20} color={colors.green} />
            <Text style={{ fontSize: 12, color: colors.slate400, marginLeft: 10, flex: 1 }}>
              Kart bilgilerin 256-bit SSL ile şifrelenir. Güvenli ödeme altyapısı kullanılmaktadır.
            </Text>
          </View>

          {/* Ödeme Butonu */}
          <TouchableOpacity
            onPress={handlePayment}
            disabled={!isFormValid}
            activeOpacity={0.8}
            style={{
              backgroundColor: isFormValid ? colors.purple : colors.slate700,
              borderRadius: 16, paddingVertical: 20,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: isFormValid ? colors.white : colors.slate500 }}>
              {`${price} Öde`}
            </Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 11, color: colors.slate600, textAlign: 'center', marginTop: 14, lineHeight: 18 }}>
            Ödeme butonuna basarak Kullanım Koşullarını kabul etmiş olursun. Aboneliğini istediğin zaman iptal edebilirsin.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
