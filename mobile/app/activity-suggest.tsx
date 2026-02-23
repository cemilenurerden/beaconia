import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { ENERGY_OPTIONS, BUDGET_OPTIONS, MOOD_OPTIONS, GOAL_OPTIONS } from '../src/constants/activity-suggest';
import { useActivitySuggest } from '../src/hooks/useActivitySuggest';
import { useSettingsStore } from '../src/store/settings';
import LoadingScreen from '../src/components/activity-suggest/LoadingScreen';
import ResultScreen from '../src/components/activity-suggest/ResultScreen';

export default function ActivitySuggestScreen() {
  const router = useRouter();
  const isDark = useSettingsStore((s) => s.darkModeEnabled);
  const {
    duration, setDuration,
    energy, setEnergy,
    isHome, setIsHome,
    budget, setBudget,
    isAlone, setIsAlone,
    mood, setMood,
    goal, setGoal,
    phase, result, refreshCount,
    handleRecommend, handleFavorite, handleSelectPlanB, resetToForm,
  } = useActivitySuggest();

  // ─── Loading ───
  if (phase === 'loading') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0F172A' : '#EEF0FA' }}>
        <LoadingScreen />
      </SafeAreaView>
    );
  }

  // ─── Result ───
  if (phase === 'result' && result) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0F172A' : '#F0F4FF' }}>
        <ResultScreen
          result={result}
          onRetry={() => handleRecommend(true)}
          onBack={resetToForm}
          onFavorite={handleFavorite}
          onSelectPlanB={handleSelectPlanB}
          refreshCount={refreshCount}
        />
      </SafeAreaView>
    );
  }

  // ─── Form ───
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0F172A' : '#F9FAFB' }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
        {/* Geri butonu */}
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, marginBottom: 8 }}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#F8FAFC' : '#111827'} />
        </TouchableOpacity>

        {/* Başlık */}
        <Text style={{ fontSize: 30, fontWeight: '700', color: isDark ? '#F8FAFC' : '#111827', marginTop: 8 }}>
          Şimdi Ne?
        </Text>
        <Text style={{ fontSize: 16, color: isDark ? '#94A3B8' : '#9CA3AF', marginTop: 4, marginBottom: 32 }}>
          Senin için en iyi öneriyi bulalım.
        </Text>

        {/* Ne kadar vaktin var? */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#94A3B8' : '#6B7280', letterSpacing: 1.5 }}>
              NE KADAR VAKTİN VAR?
            </Text>
            <View style={{ backgroundColor: '#4F46E5', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>{duration} dk</Text>
            </View>
          </View>
          <Slider
            minimumValue={10}
            maximumValue={120}
            step={5}
            value={duration}
            onValueChange={(v) => setDuration(Math.round(v))}
            minimumTrackTintColor="#4F46E5"
            maximumTrackTintColor={isDark ? '#334155' : '#E5E7EB'}
            thumbTintColor="#4F46E5"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontSize: 12, color: isDark ? '#64748B' : '#9CA3AF' }}>10 dk</Text>
            <Text style={{ fontSize: 12, color: isDark ? '#64748B' : '#9CA3AF' }}>120 dk</Text>
          </View>
        </View>

        {/* Enerjin nasıl? */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#94A3B8' : '#6B7280', letterSpacing: 1.5, marginBottom: 12 }}>
            ENERJİN NASIL?
          </Text>
          <View style={{ flexDirection: 'row', backgroundColor: isDark ? '#1E293B' : '#F3F4F6', borderRadius: 16, padding: 4 }}>
            {ENERGY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setEnergy(opt)}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: energy === opt ? (isDark ? '#334155' : '#FFFFFF') : 'transparent',
                  ...(energy === opt && {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }),
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: energy === opt ? (isDark ? '#F8FAFC' : '#111827') : '#9CA3AF' }}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Konum */}
        <View style={{ marginBottom: 32, flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#1E293B' : '#EEF2FF', borderRadius: 16, padding: 16 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="home" size={20} color="white" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: isDark ? '#F8FAFC' : '#111827' }}>Konum</Text>
            <Text style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#9CA3AF' }}>Evde misin?</Text>
          </View>
          <Switch
            value={isHome}
            onValueChange={setIsHome}
            trackColor={{ false: isDark ? '#334155' : '#D1D5DB', true: '#4F46E5' }}
            thumbColor="white"
          />
        </View>

        {/* Bütçen nedir? */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#94A3B8' : '#6B7280', letterSpacing: 1.5, marginBottom: 12 }}>
            BÜTÇEN NEDİR?
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {BUDGET_OPTIONS.map((opt) => {
              const isSelected = budget === opt.sub;
              return (
                <TouchableOpacity
                  key={opt.sub}
                  onPress={() => setBudget(opt.sub)}
                  activeOpacity={0.7}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    backgroundColor: isSelected ? '#4F46E5' : (isDark ? '#1E293B' : '#FFFFFF'),
                    borderColor: isSelected ? '#4F46E5' : (isDark ? '#334155' : '#E5E7EB'),
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 4, color: isSelected ? '#FFFFFF' : (isDark ? '#F8FAFC' : '#111827') }}>
                    {opt.label}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: isSelected ? '#BFDBFE' : (isDark ? '#94A3B8' : '#9CA3AF') }}>
                    {opt.sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Yalnız mısın? */}
        <View style={{ marginBottom: 32, flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#1E293B' : '#EEF2FF', borderRadius: 16, padding: 16 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: isDark ? '#312E81' : '#C7D2FE', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="people" size={20} color="#4F46E5" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: isDark ? '#F8FAFC' : '#111827' }}>Yalnız mısın?</Text>
            <Text style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#9CA3AF' }}>Sosyal çevre ayarı</Text>
          </View>
          <Switch
            value={isAlone}
            onValueChange={setIsAlone}
            trackColor={{ false: isDark ? '#334155' : '#D1D5DB', true: '#4F46E5' }}
            thumbColor="white"
          />
        </View>

        {/* Bugün ne yapmak istiyorsun? */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#94A3B8' : '#6B7280', letterSpacing: 1.5, marginBottom: 12 }}>
            BUGÜN NE YAPMAK İSTİYORSUN?
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {GOAL_OPTIONS.map((opt) => {
              const isSelected = goal === opt.label;
              return (
                <TouchableOpacity
                  key={opt.label}
                  onPress={() => setGoal(isSelected ? '' : opt.label)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    backgroundColor: isSelected ? '#4F46E5' : (isDark ? '#1E293B' : '#F3F4F6'),
                  }}
                >
                  <Text style={{ fontSize: 16, marginRight: 6 }}>{opt.emoji}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: isSelected ? '#FFFFFF' : (isDark ? '#CBD5E1' : '#374151') }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Nasıl hissediyorsun? */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#94A3B8' : '#6B7280', letterSpacing: 1.5, marginBottom: 12 }}>
            NASIL HİSSEDİYORSUN?
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {MOOD_OPTIONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => setMood(emoji)}
                activeOpacity={0.7}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: mood === emoji ? '#DBEAFE' : (isDark ? '#1E293B' : '#F3F4F6'),
                  borderWidth: mood === emoji ? 2 : 0,
                  borderColor: mood === emoji ? '#60A5FA' : 'transparent',
                }}
              >
                <Text style={{ fontSize: 24 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Alt boşluk (buton için) */}
        <View style={{ height: 96 }} />
      </ScrollView>

      {/* Öneri Getir butonu */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 24, paddingBottom: 32, paddingTop: 16,
        backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
      }}>
        <TouchableOpacity
          onPress={() => handleRecommend()}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 16,
            paddingVertical: 20,
            backgroundColor: '#4F46E5',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginRight: 8 }}>
            Öneri Getir
          </Text>
          <Text style={{ fontSize: 18 }}>🚀</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
