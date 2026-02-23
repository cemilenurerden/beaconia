import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Insight } from '../../types';

interface Props {
  insights: Insight[];
  isDark: boolean;
}

function InsightDetailModal({
  insight,
  isDark,
  onClose,
}: {
  insight: Insight;
  isDark: boolean;
  onClose: () => void;
}) {
  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View
            style={{
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 40,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: isDark ? '#475569' : '#E5E7EB',
                alignSelf: 'center',
                marginBottom: 20,
              }}
            />

            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: isDark ? '#334155' : insight.accentColor,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 32 }}>{insight.emoji}</Text>
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: isDark ? '#F1F5F9' : '#111827',
                marginBottom: 6,
              }}
            >
              {insight.title}
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: isDark ? '#94A3B8' : '#6B7280',
                marginBottom: 16,
              }}
            >
              {insight.subtitle}
            </Text>

            <View
              style={{
                height: 1,
                backgroundColor: isDark ? '#334155' : '#F3F4F6',
                marginBottom: 16,
              }}
            />

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 200 }}>
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 24,
                  color: isDark ? '#CBD5E1' : '#374151',
                }}
              >
                {insight.detail}
              </Text>
            </ScrollView>

            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              style={{
                marginTop: 24,
                backgroundColor: isDark ? '#312E81' : '#EEF2FF',
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: 'center',
              }}
            >
              <Text
                style={{ fontSize: 15, fontWeight: '600', color: isDark ? '#A5B4FC' : '#4F46E5' }}
              >
                Kapat
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function InsightCard({
  insight,
  isDark,
  onPress,
}: {
  insight: Insight;
  isDark: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flex: 1,
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: isDark ? '#334155' : insight.accentColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 22 }}>{insight.emoji}</Text>
      </View>

      <Text
        style={{
          fontSize: 14,
          fontWeight: '700',
          color: isDark ? '#F1F5F9' : '#111827',
          marginBottom: 4,
        }}
        numberOfLines={2}
      >
        {insight.title}
      </Text>

      <Text
        style={{
          fontSize: 12,
          color: isDark ? '#94A3B8' : '#6B7280',
          lineHeight: 17,
        }}
        numberOfLines={3}
      >
        {insight.subtitle}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <Ionicons name="chevron-forward" size={12} color={isDark ? '#6366F1' : '#4F46E5'} />
        <Text style={{ fontSize: 11, color: isDark ? '#6366F1' : '#4F46E5', marginLeft: 2 }}>
          Detay
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function KendiniTaniSection({ insights, isDark }: Props) {
  const [selected, setSelected] = useState<Insight | null>(null);

  if (insights.length === 0) return null;

  const rows: Insight[][] = [];
  for (let i = 0; i < insights.length; i += 2) {
    rows.push(insights.slice(i, i + 2));
  }

  return (
    <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <Text
          style={{ fontSize: 16, fontWeight: '700', color: isDark ? '#F1F5F9' : '#111827' }}
        >
          Kendini Tanı
        </Text>
        <View
          style={{
            backgroundColor: isDark ? '#312E81' : '#EEF2FF',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Text
            style={{ fontSize: 11, fontWeight: '600', color: isDark ? '#A5B4FC' : '#4F46E5' }}
          >
            Yapay Zeka
          </Text>
        </View>
      </View>

      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: 'row',
            gap: 12,
            marginBottom: rowIndex < rows.length - 1 ? 12 : 0,
          }}
        >
          {row.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              isDark={isDark}
              onPress={() => setSelected(insight)}
            />
          ))}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}

      {selected && (
        <InsightDetailModal
          insight={selected}
          isDark={isDark}
          onClose={() => setSelected(null)}
        />
      )}
    </View>
  );
}
