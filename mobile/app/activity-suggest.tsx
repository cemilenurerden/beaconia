import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { ENERGY_OPTIONS, BUDGET_OPTIONS, MOOD_OPTIONS } from '../src/constants/activity-suggest';
import { useActivitySuggest } from '../src/hooks/useActivitySuggest';
import LoadingScreen from '../src/components/activity-suggest/LoadingScreen';
import ResultScreen from '../src/components/activity-suggest/ResultScreen';

export default function ActivitySuggestScreen() {
  const router = useRouter();
  const {
    duration, setDuration,
    energy, setEnergy,
    isHome, setIsHome,
    budget, setBudget,
    isAlone, setIsAlone,
    mood, setMood,
    phase, result,
    handleRecommend, handleFavorite, resetToForm,
  } = useActivitySuggest();

  // ─── Loading ───
  if (phase === 'loading') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#EEF0FA' }}>
        <LoadingScreen />
      </SafeAreaView>
    );
  }

  // ─── Result ───
  if (phase === 'result' && result) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F4FF' }}>
        <ResultScreen
          result={result}
          onRetry={() => handleRecommend(true)}
          onBack={resetToForm}
          onFavorite={handleFavorite}
        />
      </SafeAreaView>
    );
  }

  // ─── Form ───
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Geri butonu */}
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, marginBottom: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        {/* Başlık */}
        <Text className="text-3xl font-bold text-gray-900 mt-2">Şimdi Ne?</Text>
        <Text className="text-base text-gray-400 mt-1 mb-8">
          Senin için en iyi öneriyi bulalım.
        </Text>

        {/* Ne kadar vaktin var? */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xs font-bold text-gray-500 tracking-wider">
              NE KADAR VAKTİN VAR?
            </Text>
            <View className="bg-blue-500 rounded-xl px-3 py-1">
              <Text className="text-white font-bold text-sm">{duration} dk</Text>
            </View>
          </View>
          <Slider
            minimumValue={10}
            maximumValue={120}
            step={5}
            value={duration}
            onValueChange={(v) => setDuration(Math.round(v))}
            minimumTrackTintColor="#3B82F6"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#3B82F6"
          />
          <View className="flex-row justify-between mt-1">
            <Text className="text-xs text-gray-400">10 dk</Text>
            <Text className="text-xs text-gray-400">120 dk</Text>
          </View>
        </View>

        {/* Enerjin nasıl? */}
        <View className="mb-8">
          <Text className="text-xs font-bold text-gray-500 tracking-wider mb-3">
            ENERJİN NASIL?
          </Text>
          <View className="flex-row bg-gray-100 rounded-2xl p-1">
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
                  backgroundColor: energy === opt ? '#FFFFFF' : 'transparent',
                  ...(energy === opt && {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }),
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: energy === opt ? '#111827' : '#9CA3AF',
                  }}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Konum */}
        <View className="mb-8 flex-row items-center bg-blue-50 rounded-2xl p-4">
          <View className="w-10 h-10 rounded-xl bg-blue-500 items-center justify-center">
            <Ionicons name="home" size={20} color="white" />
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-base font-semibold text-gray-900">Konum</Text>
            <Text className="text-xs text-gray-400">Evde misin?</Text>
          </View>
          <Switch
            value={isHome}
            onValueChange={setIsHome}
            trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
            thumbColor="white"
          />
        </View>

        {/* Bütçen nedir? */}
        <View className="mb-8">
          <Text className="text-xs font-bold text-gray-500 tracking-wider mb-3">
            BÜTÇEN NEDİR?
          </Text>
          <View className="flex-row gap-3">
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
                    backgroundColor: isSelected ? '#3B82F6' : '#FFFFFF',
                    borderColor: isSelected ? '#3B82F6' : '#E5E7EB',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      marginBottom: 4,
                      color: isSelected ? '#FFFFFF' : '#111827',
                    }}
                  >
                    {opt.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: isSelected ? '#BFDBFE' : '#9CA3AF',
                    }}
                  >
                    {opt.sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Yalnız mısın? */}
        <View className="mb-8 flex-row items-center bg-blue-50 rounded-2xl p-4">
          <View className="w-10 h-10 rounded-xl bg-blue-200 items-center justify-center">
            <Ionicons name="people" size={20} color="#3B82F6" />
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-base font-semibold text-gray-900">Yalnız mısın?</Text>
            <Text className="text-xs text-gray-400">Sosyal çevre ayarı</Text>
          </View>
          <Switch
            value={isAlone}
            onValueChange={setIsAlone}
            trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
            thumbColor="white"
          />
        </View>

        {/* Nasıl hissediyorsun? */}
        <View className="mb-8">
          <Text className="text-xs font-bold text-gray-500 tracking-wider mb-3">
            NASIL HİSSEDİYORSUN?
          </Text>
          <View className="flex-row gap-3">
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
                  backgroundColor: mood === emoji ? '#DBEAFE' : '#F3F4F6',
                  borderWidth: mood === emoji ? 2 : 0,
                  borderColor: mood === emoji ? '#60A5FA' : 'transparent',
                }}
              >
                <Text style={{ fontSize: 24 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Alt boşluk (buton için) */}
        <View className="h-24" />
      </ScrollView>

      {/* Öneri Getir butonu */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gray-50">
        <TouchableOpacity
          onPress={() => handleRecommend()}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 16,
            paddingVertical: 20,
            backgroundColor: '#3B82F6',
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
