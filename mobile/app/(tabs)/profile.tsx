import { View, Text, Pressable, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../src/store/auth';
import { useProfile } from '../../src/hooks/useProfile';
import { useKendiniTani } from '../../src/hooks/useKendiniTani';
import { useSettingsStore } from '../../src/store/settings';
import { api } from '../../src/api/client';
import { KendiniTaniSection } from '../../src/components/profile/KendiniTaniSection';
import { moodToEmoji } from '../../src/utils/mappers';

import type { MoodEntry } from '../../src/types';

function formatMoodDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function MoodHistory({ moods, isDark }: { moods: (MoodEntry | string)[]; isDark: boolean }) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Eski format (string[]) veya yeni format (MoodEntry[]) her ikisini de destekle
  const normalized: MoodEntry[] = moods.map((m) =>
    typeof m === 'string' ? { mood: m, dates: [] } : m
  );

  const handlePress = (mood: string) => {
    setSelectedMood((prev) => (prev === mood ? null : mood));
  };

  if (normalized.length === 0) {
    return (
      <View className={`mx-4 mb-4 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4`} style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
        <Text className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Mod Geçmişi</Text>
        <Text className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'} text-center py-2`}>Henüz mod verisi yok</Text>
      </View>
    );
  }

  const selected = normalized.find((m) => m.mood === selectedMood);
  const selectedDates = selected?.dates ?? [];

  return (
    <View className={`mx-4 mb-4 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4`} style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
      <Text className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>Mod Geçmişi</Text>
      <Text className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'} mb-3`}>Eskiden yeniye · Modlara bas tarihleri gör</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 4 }}>
        {normalized.map((item, i) => {
          const isSelected = selectedMood === item.mood;
          const dates = item.dates ?? [];
          return (
            <Pressable
              key={`${item.mood}-${i}`}
              onPress={() => handlePress(item.mood)}
              style={{ alignItems: 'center', width: 52 }}
            >
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected ? '#4F46E5' : (isDark ? '#1E293B' : '#EEF2FF'),
                borderWidth: isSelected ? 2 : 0,
                borderColor: '#818CF8',
              }}>
                <Text style={{ fontSize: 22 }}>{moodToEmoji(item.mood)}</Text>
              </View>
              {dates.length > 0 && (
                <Text style={{ fontSize: 10, color: isDark ? '#64748B' : '#9CA3AF', marginTop: 4 }}>
                  {dates.length}x
                </Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      {selected && selectedDates.length > 0 && (
        <View style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 12,
          backgroundColor: isDark ? '#1E293B' : '#EEF2FF',
        }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: isDark ? '#C7D2FE' : '#4F46E5', marginBottom: 6 }}>
            {moodToEmoji(selected.mood)} seçildiği tarihler ({selectedDates.length}x)
          </Text>
          {selectedDates.map((date, i) => (
            <Text key={i} style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#6B7280', lineHeight: 20 }}>
              · {formatMoodDate(date)}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  Fitness: '#4F46E5',
  Wellness: '#818CF8',
  Sosyal: '#059669',
  Yaratici: '#F97316',
  Egitim: '#F59E0B',
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? '#4F46E5';
}

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { analysis, loading } = useProfile();
  const { insights } = useKendiniTani();
  const profilePhoto = useSettingsStore((s) => s.profilePhoto);
  const setProfilePhoto = useSettingsStore((s) => s.setProfilePhoto);
  const setUserProfilePhoto = useAuthStore((s) => s.setUserProfilePhoto);
  const isDark = useSettingsStore((s) => s.darkModeEnabled);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setProfilePhoto(localUri); // hemen göster
      try {
        const data = await api.uploadPhoto<{ profilePhoto: string }>(
          '/user/profile-photo',
          localUri
        );
        setProfilePhoto(data.profilePhoto);
        setUserProfilePhoto(data.profilePhoto);
      } catch (err: any) {
        Alert.alert('Hata', err?.message ?? 'Fotoğraf yüklenemedi. Tekrar deneyin.');
        setProfilePhoto(null);
      }
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
          <View style={{ width: 22 }} />
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Profil</Text>
          <Pressable onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={22} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Avatar + User Info */}
        <View className="items-center mt-4 mb-6">
          <Pressable onPress={handlePickPhoto} style={{ position: 'relative' }}>
            <View style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              borderWidth: 3,
              borderColor: '#4F46E5',
              padding: 3,
            }}>
              {profilePhoto ? (
                <Image
                  source={{ uri: profilePhoto }}
                  style={{ width: '100%', height: '100%', borderRadius: 40 }}
                />
              ) : (
                <View style={{
                  flex: 1,
                  borderRadius: 40,
                  backgroundColor: '#4F46E5',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 28 }}>
                    {user?.name?.charAt(0).toUpperCase() ?? 'K'}
                  </Text>
                </View>
              )}
            </View>
            <View style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: '#4F46E5',
              borderWidth: 2,
              borderColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="camera" size={13} color="#fff" />
            </View>
          </Pressable>
          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-3`}>
            {user?.name ?? 'Kullanici'}
          </Text>
          {user?.isPremium ? (
            <View className="flex-row items-center bg-indigo-100 px-3 py-1 rounded-full mt-1">
              <Text className="text-indigo-600 font-semibold text-xs">Premium</Text>
              <Text className="ml-1">&#10024;</Text>
            </View>
          ) : (
            <View className={`flex-row items-center ${isDark ? 'bg-slate-700' : 'bg-gray-100'} px-3 py-1 rounded-full mt-1`}>
              <Text className={`${isDark ? 'text-slate-400' : 'text-gray-500'} font-semibold text-xs`}>Ucretsiz</Text>
            </View>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4F46E5" className="mt-8" />
        ) : (
          <>
            {/* Aktivite DNA Karti */}
            <View className={`mx-4 mb-4 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4`} style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <View className="flex-row items-center mb-4">
                <Ionicons name="analytics-outline" size={20} color="#4F46E5" />
                <Text className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'} ml-2`}>Senin Aktivite DNA'n</Text>
              </View>

              {analysis.categoryDistribution.length > 0 ? (
                analysis.categoryDistribution.slice(0, 5).map((cat) => (
                  <View key={cat.category} className="mb-3">
                    <View className="flex-row justify-between mb-1">
                      <Text className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{cat.category}</Text>
                      <Text className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>%{cat.percentage}</Text>
                    </View>
                    <View className={`h-2 ${isDark ? 'bg-slate-700' : 'bg-gray-100'} rounded-full overflow-hidden`}>
                      <View
                        className="h-2 rounded-full"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: getCategoryColor(cat.category),
                        }}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <Text className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'} text-center py-2`}>Henuz aktivite verisi yok</Text>
              )}

              {/* Tercih Bilgileri */}
              <View className={`flex-row justify-between mt-4 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                <View className="items-center flex-1">
                  <Text className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'} mb-1`}>ENERJI</Text>
                  <Text className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{analysis.topEnergy}</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'} mb-1`}>MEKAN</Text>
                  <Text className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{analysis.topLocation}</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'} mb-1`}>SOSYAL</Text>
                  <Text className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{analysis.topSocial}</Text>
                </View>
              </View>
            </View>

            {/* Kendini Tani */}
            <KendiniTaniSection insights={insights} isDark={isDark} />

            {/* Mod Gecmisi */}
            <MoodHistory moods={analysis.topMoods} isDark={isDark} />

            {/* Istatistik Kartlari - 2x2 Grid */}
            <View className="mx-4 mb-4">
              <View className="flex-row gap-3 mb-3">
                <View className={`flex-1 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4`} style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                  <Ionicons name="checkmark-circle-outline" size={22} color="#4F46E5" />
                  <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-2`}>{analysis.totalActivities}</Text>
                  <Text className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'} mt-1`}>Toplam Aktivite</Text>
                </View>
                <View className={`flex-1 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4`} style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                  <Ionicons name="flame-outline" size={22} color="#F97316" />
                  <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-2`}>{analysis.longestStreak}</Text>
                  <Text className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'} mt-1`}>En Uzun Seri (Gun)</Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className={`flex-1 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4`} style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                  <Ionicons name="heart-outline" size={22} color="#EF4444" />
                  <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-2`}>
                    {analysis.favoriteActivity || '-'}
                  </Text>
                  <Text className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'} mt-1`}>Favori</Text>
                </View>
                <View className={`flex-1 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4`} style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                  <Ionicons name="time-outline" size={22} color="#4F46E5" />
                  <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-2`}>{analysis.weeklyHours}</Text>
                  <Text className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'} mt-1`}>Bu Hafta (Saat)</Text>
                </View>
              </View>
            </View>

            {/* Cikis Butonu */}
            <View className="mx-4 mb-8" style={{ borderRadius: 16, overflow: 'hidden' }}>
              <Pressable
                onPress={handleLogout}
                android_ripple={{ color: '#dc2626' }}
                style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              >
                <View style={{ backgroundColor: '#F87171', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="log-out-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>Çıkış Yap</Text>
                </View>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
