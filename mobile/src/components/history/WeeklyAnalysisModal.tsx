import { Modal, View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { moodToEmoji } from '../../utils/mappers';
import type { WeeklyAnalysis } from '../../hooks/useWeeklyAnalysis';

const BAR_MAX_HEIGHT = 72;

const CATEGORY_COLORS: Record<string, string> = {
  Fitness: '#4F46E5',
  Wellness: '#818CF8',
  Sosyal: '#059669',
  Yaratici: '#F97316',
  Egitim: '#F59E0B',
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? '#6B7280';
}

function motivationMessage(count: number): string {
  if (count === 0) return 'Bu hafta henüz başlamadın. Haydi, ilk adımı at!';
  if (count <= 2) return 'İyi bir başlangıç! Devam et, her gün biraz daha.';
  if (count <= 4) return 'Harika gidiyorsun! Haftanın geri kalanında da bu tempoyu koru.';
  if (count <= 6) return 'Müthiş bir hafta geçiriyorsun! 💪';
  return 'İnanılmaz! Bu hafta rekor kırıyorsun. Sen bir şampiyon! 🏆';
}

interface Props {
  visible: boolean;
  onClose: () => void;
  analysis: WeeklyAnalysis;
  isDark: boolean;
}

export default function WeeklyAnalysisModal({ visible, onClose, analysis, isDark }: Props) {
  const bg = isDark ? '#0F172A' : '#F8FAFC';
  const card = isDark ? '#1E293B' : '#FFFFFF';
  const text = isDark ? '#F1F5F9' : '#111827';
  const subtext = isDark ? '#94A3B8' : '#6B7280';
  const maxCount = Math.max(...analysis.dailyBars.map((b) => b.count), 1);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: bg }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: text }}>Haftalık Analiz</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Ionicons name="close-circle" size={28} color={subtext} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          {/* Günlük bar chart */}
          <View style={{ backgroundColor: card, borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: text, marginBottom: 16 }}>Günlük Dağılım</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              {analysis.dailyBars.map((bar) => (
                <View key={bar.label} style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 11, color: bar.count > 0 ? text : subtext, fontWeight: '600', marginBottom: 4 }}>
                    {bar.count > 0 ? bar.count : ''}
                  </Text>
                  <View style={{
                    width: 28,
                    height: Math.max(bar.count > 0 ? (bar.count / maxCount) * BAR_MAX_HEIGHT : 4, bar.count > 0 ? 12 : 4),
                    borderRadius: 6,
                    backgroundColor: bar.isToday
                      ? '#4F46E5'
                      : bar.count > 0
                        ? (isDark ? '#6366F1' : '#C7D2FE')
                        : (isDark ? '#334155' : '#F1F5F9'),
                  }} />
                  <Text style={{ fontSize: 11, color: bar.isToday ? '#4F46E5' : subtext, marginTop: 6, fontWeight: bar.isToday ? '700' : '400' }}>
                    {bar.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Kategori dağılımı */}
          {analysis.categoryStats.length > 0 && (
            <View style={{ backgroundColor: card, borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: text, marginBottom: 14 }}>Kategori Dağılımı</Text>
              {analysis.categoryStats.map((cat) => (
                <View key={cat.category} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: text }}>{cat.category}</Text>
                    <Text style={{ fontSize: 13, color: subtext }}>{cat.count} kez · %{cat.percentage}</Text>
                  </View>
                  <View style={{ height: 6, backgroundColor: isDark ? '#334155' : '#F1F5F9', borderRadius: 3 }}>
                    <View style={{
                      height: 6,
                      width: `${cat.percentage}%`,
                      backgroundColor: getCategoryColor(cat.category),
                      borderRadius: 3,
                    }} />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Geçen haftayla karşılaştırma */}
          <View style={{
            backgroundColor: card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
          }}>
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: analysis.trend === 'up' ? '#DCFCE7' : analysis.trend === 'down' ? '#FEE2E2' : '#F1F5F9',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons
                name={analysis.trend === 'up' ? 'trending-up' : analysis.trend === 'down' ? 'trending-down' : 'remove'}
                size={22}
                color={analysis.trend === 'up' ? '#16A34A' : analysis.trend === 'down' ? '#DC2626' : '#6B7280'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: text }}>
                {analysis.trend === 'up'
                  ? `Geçen haftadan %${analysis.trendPercent} daha fazla`
                  : analysis.trend === 'down'
                    ? `Geçen haftadan %${analysis.trendPercent} daha az`
                    : 'Geçen haftayla aynı tempo'}
              </Text>
              <Text style={{ fontSize: 12, color: subtext, marginTop: 2 }}>
                Geçen hafta: {analysis.lastWeekCount} aktivite
              </Text>
            </View>
          </View>

          {/* Motivasyon mesajı */}
          <View style={{ backgroundColor: '#4F46E5', borderRadius: 16, padding: 18 }}>
            <Text style={{ fontSize: 14, color: '#C4B5FD', fontWeight: '600', marginBottom: 6 }}>Bu Haftanın Özeti</Text>
            <Text style={{ fontSize: 15, color: '#FFFFFF', lineHeight: 22 }}>
              {motivationMessage(analysis.thisWeekCount)}
            </Text>
          </View>

        </ScrollView>
      </View>
    </Modal>
  );
}
