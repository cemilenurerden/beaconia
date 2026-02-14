import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Switch,
  Alert, Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { getPreferences, updatePreferences } from '../src/api/user';
import { getRecommendation } from '../src/api/recommend';
import { addFavorite } from '../src/api/favorites';
import { formToApiInput, preferencesToForm } from '../src/utils/mappers';
import type { RecommendResult } from '../src/types';

const ENERGY_OPTIONS = ['Düşük', 'Orta', 'Yüksek'] as const;

const BUDGET_OPTIONS = [
  { label: '₺0', sub: 'BEDAVA' },
  { label: '₺', sub: 'EKONOMİK' },
  { label: '₺₺', sub: 'LÜKS' },
] as const;

const MOOD_OPTIONS = ['😊', '🔥', '🤩', '😢'] as const;

const LOADING_MESSAGES = [
  'Enerjine uygun aktiviteler taranıyor...',
  'Ruh haline göre eşleştiriliyor...',
  'Sana özel seçenekler hazırlanıyor...',
  'Yapay zeka düşünüyor...',
];

const CATEGORY_ICONS: Record<string, string> = {
  fitness: '🏃',
  wellness: '🧘',
  entertainment: '🎬',
  education: '📚',
  social: '👥',
  cooking: '🍳',
  outdoor: '🌿',
  art: '🎨',
  music: '🎵',
  hobby: '🧩',
  'self-care': '💆',
  productivity: '🧹',
  culture: '🏛️',
  sports: '⚽',
  adventure: '🧗',
  shopping: '🛍️',
  puzzle: '🧠',
};

type Phase = 'form' | 'loading' | 'result';

// ─── Loading Screen ───
function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotating messages
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);

    // Dot animation
    const animateDots = () => {
      const createDotAnim = (dot: Animated.Value, delay: number) =>
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ]);

      Animated.loop(
        Animated.parallel([
          createDotAnim(dot1, 0),
          createDotAnim(dot2, 200),
          createDotAnim(dot3, 400),
        ]),
      ).start();
    };

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();

    animateDots();
    return () => clearInterval(msgTimer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF0FA', alignItems: 'center', justifyContent: 'center' }}>
      {/* Pulse halo */}
      <Animated.View
        style={{
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: '#DDD6FE',
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale: pulse }],
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Ionicons name="sparkles" size={36} color="#3B3FBF" />
        </View>
      </Animated.View>

      {/* Title */}
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginTop: 32 }}>
        Sana Özel Seçiliyor
      </Text>

      {/* Animated dots */}
      <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#3B3FBF',
              opacity: dot,
            }}
          />
        ))}
      </View>

      {/* Bottom message */}
      <Text style={{ position: 'absolute', bottom: 60, fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 40 }}>
        {LOADING_MESSAGES[msgIndex]}
      </Text>
    </View>
  );
}

// ─── Result Screen ───
function ResultScreen({
  result,
  onRetry,
  onBack,
  onFavorite,
}: {
  result: RecommendResult;
  onRetry: () => void;
  onBack: () => void;
  onFavorite: () => void;
}) {
  const [showPlanB, setShowPlanB] = useState(false);
  const { selected, reason, firstStep, planB } = result;
  const icon = CATEGORY_ICONS[selected.category] || '✨';
  const durationMid = Math.round((selected.durationMin + selected.durationMax) / 2);

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F4FF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Senin İçin Seçtik</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="share-outline" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Activity Card */}
        <View style={{ alignItems: 'center', marginTop: 28, marginBottom: 28 }}>
          <Text style={{ fontSize: 64 }}>{icon}</Text>
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#111827', marginTop: 16, textAlign: 'center' }}>
            {selected.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, marginTop: 14 }}>
            <Ionicons name="time-outline" size={16} color="#059669" />
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#059669', marginLeft: 6 }}>
              Toplam {durationMid} Dakika
            </Text>
          </View>
        </View>

        {/* Reason Card */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Ionicons name="sparkles" size={20} color="#7C3AED" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginLeft: 8 }}>Neden bu?</Text>
          </View>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 18, padding: 22, minHeight: 100, borderWidth: 1, borderColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 16, color: '#374151', lineHeight: 26 }}>{reason}</Text>
          </View>
        </View>

        {/* First Step Card */}
        <View style={{ backgroundColor: '#059669', borderRadius: 18, padding: 22, minHeight: 90, marginBottom: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#A7F3D0', letterSpacing: 1, marginBottom: 10 }}>
            ŞİMDİ HEMEN BAŞLA
          </Text>
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF', lineHeight: 26 }}>
            İlk Adım: {firstStep}
          </Text>
        </View>

        {/* Plan B */}
        {planB && (
          <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setShowPlanB(!showPlanB)}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18 }}>🔀</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginLeft: 8 }}>
                  Başka bir şey mi lazım? (Plan B)
                </Text>
              </View>
              <Ionicons name={showPlanB ? 'chevron-up' : 'chevron-down'} size={22} color="#6B7280" />
            </TouchableOpacity>
            {showPlanB && (
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E5E7EB' }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                  {CATEGORY_ICONS[planB.category] || '✨'} {planB.title}
                </Text>
                <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 6 }}>
                  {Math.round((planB.durationMin + planB.durationMax) / 2)} dakika
                  {planB.location === 'home' ? ' · Evde' : planB.location === 'outdoor' ? ' · Dışarıda' : ''}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', backgroundColor: '#FFFFFF',
        paddingVertical: 14, paddingHorizontal: 20,
        borderTopWidth: 1, borderTopColor: '#F3F4F6',
        justifyContent: 'space-around',
      }}>
        <TouchableOpacity onPress={onFavorite} activeOpacity={0.7} style={{ alignItems: 'center' }}>
          <Ionicons name="thumbs-up" size={24} color="#059669" />
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#059669', marginTop: 4 }}>HARİKA</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onRetry} activeOpacity={0.7} style={{ alignItems: 'center' }}>
          <Ionicons name="refresh" size={24} color="#F59E0B" />
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#F59E0B', marginTop: 4 }}>YENİLE</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={{ alignItems: 'center' }}>
          <Ionicons name="hand-left" size={24} color="#EF4444" />
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#EF4444', marginTop: 4 }}>KALSIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Screen ───
export default function ActivitySuggestScreen() {
  const router = useRouter();

  const [duration, setDuration] = useState(45);
  const [energy, setEnergy] = useState<string>('Orta');
  const [isHome, setIsHome] = useState(true);
  const [budget, setBudget] = useState<string>('EKONOMİK');
  const [isAlone, setIsAlone] = useState(false);
  const [mood, setMood] = useState<string>('🔥');

  const [phase, setPhase] = useState<Phase>('form');
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [excludeIds, setExcludeIds] = useState<string[]>([]);

  // Sayfa açılışında önceki tercihleri yükle
  useEffect(() => {
    getPreferences().then((prefs) => {
      if (!prefs) return;
      const form = preferencesToForm(prefs);
      setDuration(form.duration);
      setEnergy(form.energy);
      setIsHome(form.isHome);
      setBudget(form.budget);
      setIsAlone(form.isAlone);
      setMood(form.mood);
    }).catch(() => {});
  }, []);

  async function handleFavorite() {
    if (!result) return;
    try {
      await addFavorite(result.selected.id);
      Alert.alert('Favorilere Eklendi', `${result.selected.title} favorilerine eklendi!`);
      setPhase('form');
    } catch {
      Alert.alert('Bilgi', 'Bu aktivite zaten favorilerinde.');
    }
  }

  async function handleRecommend(retry = false) {
    setPhase('loading');
    try {
      const input = formToApiInput({ duration, energy, isHome, budget, isAlone, mood });
      const currentExcludes = retry && result ? [...excludeIds, result.selected.id] : [];

      if (retry && result) {
        setExcludeIds(currentExcludes);
      } else {
        setExcludeIds([]);
      }

      const [rec] = await Promise.all([
        getRecommendation({ ...input, excludeIds: currentExcludes.length > 0 ? currentExcludes : undefined }),
        updatePreferences(input),
      ]);

      setResult(rec);
      setPhase('result');
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Öneri alınamadı. Lütfen tekrar dene.');
      setPhase('form');
    }
  }

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
          onBack={() => { setPhase('form'); setExcludeIds([]); }}
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
          onPress={handleRecommend}
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
