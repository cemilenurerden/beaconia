import { View, Text, Pressable, ScrollView, Switch, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useSettingsStore } from '../../src/store/settings';
import { useAuthStore } from '../../src/store/auth';
import { deleteAccount } from '../../src/api/user';

function SectionHeader({ title }: { title: string }) {
  const isDark = useSettingsStore((s) => s.darkModeEnabled);
  return (
    <Text className={`text-xs font-semibold ${isDark ? 'text-slate-500' : 'text-gray-400'} uppercase tracking-wider px-4 mb-2 mt-2`}>
      {title}
    </Text>
  );
}

function SettingsRow({
  icon,
  label,
  onPress,
  danger,
  rightElement,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
  danger?: boolean;
  rightElement?: React.ReactNode;
}) {
  const isDark = useSettingsStore((s) => s.darkModeEnabled);
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: '#f3f4f6' }}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      className={`flex-row items-center px-4 py-3.5 border-b ${isDark ? 'border-slate-700' : 'border-gray-50'}`}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={danger ? '#EF4444' : '#4F46E5'}
        style={{ marginRight: 12 }}
      />
      <Text
        className={`flex-1 text-sm font-medium ${danger ? 'text-red-500' : isDark ? 'text-slate-200' : 'text-gray-800'}`}
      >
        {label}
      </Text>
      {rightElement ?? (
        onPress ? <Ionicons name="chevron-forward" size={16} color="#9CA3AF" /> : null
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const darkModeEnabled = useSettingsStore((s) => s.darkModeEnabled);
  const toggleDarkMode = useSettingsStore((s) => s.toggleDarkMode);
  const isDark = darkModeEnabled;

  const logout = useAuthStore((s) => s.logout);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Tüm verileriniz kalıcı olarak silinecek. Bu işlem geri alınamaz.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              await logout();
              router.replace('/(auth)/login');
            } catch (err: any) {
              Alert.alert('Hata', err?.message ?? 'Hesap silinemedi.');
            }
          },
        },
      ],
    );
  };

  const handleAbout = () => {
    const version = Constants.expoConfig?.version ?? '1.0.0';
    Alert.alert('Beaconia', `Versiyon ${version}`);
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <Pressable onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#F8FAFC' : '#111827'} />
        </Pressable>
        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Ayarlar</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Premium */}
        <SectionHeader title="Üyelik" />
        <View
          className={`mx-4 mb-4 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl overflow-hidden`}
          style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
        >
          <SettingsRow
            icon="star-outline"
            label="Premium'a Geç"
            onPress={() => router.push('/premium')}
          />
        </View>

        {/* Profil Ayarları */}
        <SectionHeader title="Profil Ayarları" />
        <View
          className={`mx-4 mb-4 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl overflow-hidden`}
          style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
        >
          <SettingsRow
            icon="person-outline"
            label="Adı Değiştir"
            onPress={() => router.push('/settings/edit-name')}
          />
          <SettingsRow
            icon="location-outline"
            label="Şehir Değiştir"
            onPress={() => router.push('/settings/edit-city')}
          />
          <SettingsRow
            icon="lock-closed-outline"
            label="Şifre Değiştir"
            onPress={() => router.push('/settings/change-password')}
          />
          <SettingsRow
            icon="trash-outline"
            label="Hesabı Sil"
            onPress={handleDeleteAccount}
            danger
          />
        </View>

        {/* Uygulama Ayarları */}
        <SectionHeader title="Uygulama Ayarları" />
        <View
          className={`mx-4 mb-4 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl overflow-hidden`}
          style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
        >
          <SettingsRow
            icon="notifications-outline"
            label="Bildirimler"
            onPress={() => router.push('/settings/notifications')}
          />
          <SettingsRow
            icon="language-outline"
            label="Dil"
            onPress={() => router.push('/settings/language')}
          />
          <SettingsRow
            icon="moon-outline"
            label="Dark Mode"
            rightElement={
              <Switch
                value={darkModeEnabled}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
                thumbColor="#ffffff"
              />
            }
          />
          <SettingsRow
            icon="information-circle-outline"
            label="Hakkında"
            onPress={handleAbout}
          />
          <SettingsRow
            icon="document-text-outline"
            label="Gizlilik Politikası"
            onPress={() => Linking.openURL('https://beaconia.app/privacy')}
          />
          <SettingsRow
            icon="reader-outline"
            label="Kullanım Şartları"
            onPress={() => Linking.openURL('https://beaconia.app/terms')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
