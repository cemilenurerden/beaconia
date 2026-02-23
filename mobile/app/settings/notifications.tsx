import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../src/store/settings';

function SectionHeader({ title }: { title: string }) {
  const isDark = useSettingsStore((s) => s.darkModeEnabled);
  return (
    <Text className={`text-xs font-semibold ${isDark ? 'text-slate-500' : 'text-gray-400'} uppercase tracking-wider px-4 mb-2 mt-2`}>
      {title}
    </Text>
  );
}

function NotificationRow({
  icon,
  label,
  value,
  onToggle,
  disabled,
}: {
  icon: string;
  label: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  const isDark = useSettingsStore((s) => s.darkModeEnabled);
  return (
    <View
      className={`flex-row items-center px-4 py-3.5 border-b ${isDark ? 'border-slate-700' : 'border-gray-50'}`}
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      <Ionicons name={icon as any} size={20} color="#4F46E5" style={{ marginRight: 12 }} />
      <Text className={`flex-1 text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
        thumbColor="#ffffff"
      />
    </View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const isDark = useSettingsStore((s) => s.darkModeEnabled);

  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const notifyActivitySuggestions = useSettingsStore((s) => s.notifyActivitySuggestions);
  const notifyReminders = useSettingsStore((s) => s.notifyReminders);
  const notifyAppNews = useSettingsStore((s) => s.notifyAppNews);

  const toggleNotifications = useSettingsStore((s) => s.toggleNotifications);
  const toggleActivitySuggestions = useSettingsStore((s) => s.toggleActivitySuggestions);
  const toggleReminders = useSettingsStore((s) => s.toggleReminders);
  const toggleAppNews = useSettingsStore((s) => s.toggleAppNews);

  const categoriesDisabled = !notificationsEnabled;

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#F8FAFC' : '#111827'} />
        </Pressable>
        <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Bildirimler</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Genel */}
        <SectionHeader title="Genel" />
        <View
          className={`mx-4 mb-4 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl overflow-hidden`}
          style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
        >
          <NotificationRow
            icon="notifications-outline"
            label="Tüm Bildirimler"
            value={notificationsEnabled}
            onToggle={toggleNotifications}
          />
        </View>

        {/* Kategoriler */}
        <SectionHeader title="Kategoriler" />
        <View
          className={`mx-4 mb-4 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl overflow-hidden`}
          style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
        >
          <NotificationRow
            icon="fitness-outline"
            label="Aktivite Önerileri"
            value={notifyActivitySuggestions}
            onToggle={toggleActivitySuggestions}
            disabled={categoriesDisabled}
          />
          <NotificationRow
            icon="alarm-outline"
            label="Hatırlatıcılar"
            value={notifyReminders}
            onToggle={toggleReminders}
            disabled={categoriesDisabled}
          />
          <NotificationRow
            icon="megaphone-outline"
            label="Uygulama Haberleri"
            value={notifyAppNews}
            onToggle={toggleAppNews}
            disabled={categoriesDisabled}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
