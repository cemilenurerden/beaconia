import { useState, useCallback } from 'react';
import { View, Text, SectionList, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getHistory } from '../../src/api/history';
import { getFavorites, removeFavorite } from '../../src/api/favorites';
import TabSwitcher from '../../src/components/history/TabSwitcher';
import ActivityCard from '../../src/components/history/ActivityCard';
import FavoriteCard from '../../src/components/history/FavoriteCard';
import WeeklySummary from '../../src/components/history/WeeklySummary';
import type { Decision, Activity } from '../../src/types';

const TABS = [
  { key: 'history', label: 'Geçmiş' },
  { key: 'favorites', label: 'Favoriler' },
];

interface Section {
  title: string;
  data: Decision[];
}

function groupByDate(decisions: Decision[]): Section[] {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(yesterday);

  const groups: Record<string, Decision[]> = {};

  for (const decision of decisions) {
    const dateStr = formatDate(new Date(decision.createdAt));
    let label: string;

    if (dateStr === todayStr) label = 'BUGÜN';
    else if (dateStr === yesterdayStr) label = 'DÜN';
    else label = new Date(decision.createdAt).toLocaleDateString('tr-TR', {
      day: 'numeric', month: 'long',
    }).toUpperCase();

    if (!groups[label]) groups[label] = [];
    groups[label].push(decision);
  }

  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState('history');
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [favorites, setFavorites] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([
        getHistory().then((r) => setDecisions(r.decisions ?? [])).catch(() => setDecisions([])),
        getFavorites().then(setFavorites).catch(() => setFavorites([])),
      ]).finally(() => setLoading(false));
    }, [])
  );

  async function handleRemoveFavorite(activityId: string) {
    try {
      await removeFavorite(activityId);
      setFavorites((prev) => prev.filter((a) => a.id !== activityId));
    } catch {
      Alert.alert('Hata', 'Favori kaldırılamadı.');
    }
  }

  const sections = groupByDate(decisions);

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

function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
      <View style={{
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>
        <Ionicons name={icon as any} size={32} color="#9CA3AF" />
      </View>
      <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center' }}>
        {subtitle}
      </Text>
    </View>
  );
}
