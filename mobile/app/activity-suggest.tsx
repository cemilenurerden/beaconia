import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const ENERGY_OPTIONS = ['Düşük', 'Orta', 'Yüksek'] as const;

const BUDGET_OPTIONS = [
  { label: '₺0', sub: 'BEDAVA' },
  { label: '₺', sub: 'EKONOMİK' },
  { label: '₺₺', sub: 'LÜKS' },
] as const;

const MOOD_OPTIONS = ['😊', '🔥', '🤩', '😢'] as const;

export default function ActivitySuggestScreen() {
  const router = useRouter();

  const [duration, setDuration] = useState(45);
  const [energy, setEnergy] = useState<string>('Orta');
  const [isHome, setIsHome] = useState(true);
  const [budget, setBudget] = useState<string>('EKONOMİK');
  const [isAlone, setIsAlone] = useState(false);
  const [mood, setMood] = useState<string>('🔥');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Geri butonu */}
        <Pressable onPress={() => router.back()} className="mt-4 mb-2">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>

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
              <Pressable
                key={opt}
                onPress={() => setEnergy(opt)}
                className={`flex-1 items-center py-3 rounded-xl ${
                  energy === opt ? 'bg-white shadow-sm' : ''
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    energy === opt ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {opt}
                </Text>
              </Pressable>
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
            {BUDGET_OPTIONS.map((opt) => (
              <Pressable
                key={opt.sub}
                onPress={() => setBudget(opt.sub)}
                className={`flex-1 items-center py-4 rounded-2xl border ${
                  budget === opt.sub
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-lg font-bold mb-1 ${
                    budget === opt.sub ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {opt.label}
                </Text>
                <Text
                  className={`text-xs font-semibold ${
                    budget === opt.sub ? 'text-blue-200' : 'text-gray-400'
                  }`}
                >
                  {opt.sub}
                </Text>
              </Pressable>
            ))}
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
              <Pressable
                key={emoji}
                onPress={() => setMood(emoji)}
                className={`w-14 h-14 rounded-2xl items-center justify-center ${
                  mood === emoji ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-100'
                }`}
              >
                <Text className="text-2xl">{emoji}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Alt boşluk (buton için) */}
        <View className="h-24" />
      </ScrollView>

      {/* Öneri Getir butonu */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gray-50">
        <Pressable className="flex-row items-center justify-center rounded-2xl bg-blue-500 py-5">
          <Text className="text-lg font-bold text-white mr-2">Öneri Getir</Text>
          <Text className="text-lg">🚀</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
