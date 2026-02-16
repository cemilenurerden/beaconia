import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const FEATURES = [
  { icon: 'refresh' as const, title: 'Sınırsız Yenileme', desc: 'Günlük yenileme limiti olmadan dilediğin kadar öneri al.' },
  { icon: 'sparkles' as const, title: 'Öncelikli AI Önerileri', desc: 'Gelişmiş AI modeliyle daha kişisel aktivite önerileri.' },
  { icon: 'star' as const, title: 'Özel Kategoriler', desc: 'Premium kullanıcılara özel aktivite kategorilerine eriş.' },
  { icon: 'analytics' as const, title: 'Detaylı İstatistikler', desc: 'Aktivite geçmişin ve alışkanlıkların hakkında detaylı analiz.' },
];

type Plan = 'yearly' | 'monthly';

export default function PremiumScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('yearly');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F172A' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={{ alignItems: 'center', paddingTop: 32, paddingBottom: 40, paddingHorizontal: 20 }}>
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Ionicons name="diamond" size={40} color="#FFFFFF" />
          </View>
          <Text style={{ fontSize: 32, fontWeight: '800', color: '#FFFFFF', textAlign: 'center' }}>
            Beaconia Premium
          </Text>
          <Text style={{ fontSize: 16, color: '#94A3B8', textAlign: 'center', marginTop: 12, lineHeight: 24 }}>
            Günlük yenileme limitini kaldır, sınırsız öneri al ve daha fazlasını keşfet.
          </Text>
        </View>

        {/* Limit Uyarısı */}
        <View style={{
          marginHorizontal: 20, backgroundColor: '#1E293B', borderRadius: 16,
          padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 28,
          borderWidth: 1, borderColor: '#F59E0B33',
        }}>
          <View style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: '#F59E0B22', alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="alert-circle" size={24} color="#F59E0B" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#F59E0B' }}>
              Günlük hakkın doldu!
            </Text>
            <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
              Ücretsiz planda günde 3 yenileme hakkın var. Premium ile sınırsız yenile!
            </Text>
          </View>
        </View>

        {/* Features */}
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          {FEATURES.map((f) => (
            <View key={f.title} style={{
              backgroundColor: '#1E293B', borderRadius: 16, padding: 20,
              flexDirection: 'row', alignItems: 'center',
            }}>
              <View style={{
                width: 48, height: 48, borderRadius: 14,
                backgroundColor: '#7C3AED22', alignItems: 'center', justifyContent: 'center',
              }}>
                <Ionicons name={f.icon} size={24} color="#A78BFA" />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>{f.title}</Text>
                <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, lineHeight: 20 }}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <View style={{ paddingHorizontal: 20, marginTop: 32, gap: 12 }}>
          <TouchableOpacity
            onPress={() => setSelectedPlan('yearly')}
            activeOpacity={0.8}
            style={{
              backgroundColor: selectedPlan === 'yearly' ? '#7C3AED' : '#1E293B',
              borderRadius: 16, padding: 22, alignItems: 'center',
              borderWidth: 2,
              borderColor: selectedPlan === 'yearly' ? '#A78BFA' : '#334155',
            }}
          >
            <View style={{
              position: 'absolute', top: -12, backgroundColor: '#F59E0B',
              paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12,
            }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#0F172A' }}>%38 TASARRUF</Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: selectedPlan === 'yearly' ? '#C4B5FD' : '#94A3B8', marginBottom: 4, marginTop: 4 }}>YILLIK</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF' }}>
              ₺299<Text style={{ fontSize: 16, fontWeight: '600' }}>/yıl</Text>
            </Text>
            <Text style={{ fontSize: 13, color: selectedPlan === 'yearly' ? '#C4B5FD' : '#94A3B8', marginTop: 4 }}>Ayda sadece ₺24.92</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.8}
            style={{
              backgroundColor: selectedPlan === 'monthly' ? '#7C3AED' : '#1E293B',
              borderRadius: 16, padding: 22, alignItems: 'center',
              borderWidth: selectedPlan === 'monthly' ? 2 : 1,
              borderColor: selectedPlan === 'monthly' ? '#A78BFA' : '#334155',
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: selectedPlan === 'monthly' ? '#C4B5FD' : '#94A3B8', marginBottom: 4 }}>AYLIK</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF' }}>
              ₺40<Text style={{ fontSize: 16, fontWeight: '600' }}>/ay</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/checkout', params: { plan: selectedPlan } })}
            activeOpacity={0.8}
            style={{
              backgroundColor: '#7C3AED', borderRadius: 16, paddingVertical: 20,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>Premium'a Geç</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 12 }}>
            İstediğin zaman iptal edebilirsin.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
