import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useSettingsStore } from '../../src/store/settings';

const LANGUAGES = [
  { code: 'tr' as const, label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en' as const, label: 'English', flag: '🇬🇧' },
];

export default function LanguageScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#F8FAFC' : '#111827'} />
        </Pressable>
        <Text className="text-lg font-bold text-gray-900 dark:text-white">Dil</Text>
        <View style={{ width: 24 }} />
      </View>

      <View
        className="mx-4 mt-4 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden"
        style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
      >
        {LANGUAGES.map((lang, index) => (
          <Pressable
            key={lang.code}
            onPress={() => setLanguage(lang.code)}
            android_ripple={{ color: '#f3f4f6' }}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className={`flex-row items-center px-4 py-3.5 ${index < LANGUAGES.length - 1 ? 'border-b border-gray-50 dark:border-slate-700' : ''}`}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>{lang.flag}</Text>
            <Text className="flex-1 text-sm font-medium text-gray-800 dark:text-slate-200">{lang.label}</Text>
            {language === lang.code && (
              <Ionicons name="checkmark" size={20} color="#4F46E5" />
            )}
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
