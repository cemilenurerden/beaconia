import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/constants/theme';
import { usePremium, FEATURES, Plan } from '../src/hooks/usePremium';

function FeatureCard({ icon, title, desc }: { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string }) {
  return (
    <View style={{
      backgroundColor: colors.slate800, borderRadius: 16, padding: 20,
      flexDirection: 'row', alignItems: 'center',
    }}>
      <View style={{
        width: 48, height: 48, borderRadius: 14,
        backgroundColor: '#4F46E522', alignItems: 'center', justifyContent: 'center',
      }}>
        <Ionicons name={icon} size={24} color={colors.purpleMid} />
      </View>
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.white }}>{title}</Text>
        <Text style={{ fontSize: 13, color: colors.slate400, marginTop: 4, lineHeight: 20 }}>{desc}</Text>
      </View>
    </View>
  );
}

type PlanOptionProps = {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
  label: string;
  price: string;
  unit: string;
  subtitle?: string;
  badge?: string;
};

function PlanOption({ selected, onSelect, label, price, unit, subtitle, badge }: PlanOptionProps) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.8}
      style={{
        backgroundColor: selected ? colors.purple : colors.slate800,
        borderRadius: 16, padding: 22, alignItems: 'center',
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.purpleMid : colors.slate700,
      }}
    >
      {badge && (
        <View style={{
          position: 'absolute', top: -12, backgroundColor: colors.yellow,
          paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12,
        }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: colors.slate900 }}>{badge}</Text>
        </View>
      )}
      <Text style={{ fontSize: 13, fontWeight: '600', color: selected ? '#C4B5FD' : colors.slate400, marginBottom: 4, marginTop: badge ? 4 : 0 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.white }}>
        {price}<Text style={{ fontSize: 16, fontWeight: '600' }}>/{unit}</Text>
      </Text>
      {subtitle && (
        <Text style={{ fontSize: 13, color: selected ? '#C4B5FD' : colors.slate400, marginTop: 4 }}>{subtitle}</Text>
      )}
    </TouchableOpacity>
  );
}

export default function PremiumScreen() {
  const { router, selectedPlan, setSelectedPlan, handleCheckout } = usePremium();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.slate900 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={{ alignItems: 'center', paddingTop: 32, paddingBottom: 40, paddingHorizontal: 20 }}>
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Ionicons name="diamond" size={40} color={colors.white} />
          </View>
          <Text style={{ fontSize: 32, fontWeight: '800', color: colors.white, textAlign: 'center' }}>
            Beaconia Premium
          </Text>
          <Text style={{ fontSize: 16, color: colors.slate400, textAlign: 'center', marginTop: 12, lineHeight: 24 }}>
            Ücretsiz planda günde 1 öneri ve 3 yenileme hakkın var. Premium ile sınırsız kullan!
          </Text>
        </View>

        {/* Limit Uyarısı */}
        <View style={{
          marginHorizontal: 20, backgroundColor: colors.slate800, borderRadius: 16,
          padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 28,
          borderWidth: 1, borderColor: '#F59E0B33',
        }}>
          <View style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: '#F59E0B22', alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="alert-circle" size={24} color={colors.yellow} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.yellow }}>
              Günlük hakkın doldu!
            </Text>
            <Text style={{ fontSize: 13, color: colors.slate400, marginTop: 4 }}>
              Ücretsiz planda günde 1 öneri ve 3 yenileme hakkın var. Premium ile sınırsız kullan!
            </Text>
          </View>
        </View>

        {/* Features */}
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
          ))}
        </View>

        {/* Pricing */}
        <View style={{ paddingHorizontal: 20, marginTop: 32, gap: 12 }}>
          <PlanOption
            plan="yearly"
            selected={selectedPlan === 'yearly'}
            onSelect={() => setSelectedPlan('yearly')}
            label="YILLIK"
            price="₺299"
            unit="yıl"
            subtitle="Ayda sadece ₺24.92"
            badge="%38 TASARRUF"
          />
          <PlanOption
            plan="monthly"
            selected={selectedPlan === 'monthly'}
            onSelect={() => setSelectedPlan('monthly')}
            label="AYLIK"
            price="₺40"
            unit="ay"
          />
        </View>

        {/* CTA */}
        <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
          <TouchableOpacity
            onPress={handleCheckout}
            activeOpacity={0.8}
            style={{
              backgroundColor: colors.purple, borderRadius: 16, paddingVertical: 20,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.white }}>Premium'a Geç</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 12, color: colors.slate500, textAlign: 'center', marginTop: 12 }}>
            İstediğin zaman iptal edebilirsin.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
