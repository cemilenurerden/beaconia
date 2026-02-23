import { useState } from 'react';
import { View, Text, SectionList, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { useHistory } from '../../src/hooks/useHistory';
import TabSwitcher from '../../src/components/history/TabSwitcher';
import ActivityCard from '../../src/components/history/ActivityCard';
import FavoriteCard from '../../src/components/history/FavoriteCard';
import WeeklySummary from '../../src/components/history/WeeklySummary';
import EmptyState from '../../src/components/history/EmptyState';

const TABS = [
  { key: 'history', label: 'Geçmiş' },
  { key: 'favorites', label: 'Favoriler' },
];

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState('history');
  const { decisions, favorites, loading, sections, handleRemoveFavorite } = useHistory();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <View style={{ width: 22 }} />
        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Etkinliklerim</Text>
        <Ionicons name="calendar-outline" size={22} color="#9CA3AF" />
      </View>

      {/* Tab Switcher */}
      <View style={{ paddingHorizontal: 24, marginTop: 32, marginBottom: 16 }}>
        <TabSwitcher tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : activeTab === 'history' ? (
        decisions.length === 0 ? (
          <EmptyState icon="time-outline" title="Henüz geçmiş yok" subtitle={'Aktivitelerini tamamladıkça\nburada görünecek.'} />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            renderSectionHeader={({ section }) => (
              <Text style={{
                fontSize: 12, fontWeight: '700',
                color: colorScheme === 'dark' ? '#64748B' : '#9CA3AF',
                letterSpacing: 1, marginBottom: 10, marginTop: 8,
              }}>
                {section.title}
              </Text>
            )}
            renderItem={({ item }) => <ActivityCard decision={item} />}
            ListFooterComponent={<WeeklySummary totalActivities={decisions.length} />}
          />
        )
      ) : (
        favorites.length === 0 ? (
          <EmptyState icon="heart-outline" title="Henüz favori yok" subtitle={'Beğendiğin aktiviteler\nburada görünecek.'} />
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <FavoriteCard activity={item} onRemove={handleRemoveFavorite} />
            )}
          />
        )
      )}
    </SafeAreaView>
  );
}
