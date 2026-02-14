import { useState } from 'react';
import { View, Text, SectionList, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
      }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
          Etkinliklerim
        </Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View style={{ paddingHorizontal: 24, marginTop: 8, marginBottom: 16 }}>
        <TabSwitcher tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#7C3AED" />
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
                fontSize: 12, fontWeight: '700', color: '#9CA3AF',
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
