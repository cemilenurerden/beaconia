import { View, Text } from 'react-native';
import type { Decision, Feedback } from '../../types';

const CATEGORY_ICONS: Record<string, string> = {
  fitness: '🏃', wellness: '🧘', entertainment: '🎬', education: '📚',
  social: '👥', cooking: '🍳', outdoor: '🌿', art: '🎨',
  music: '🎵', hobby: '🧩', 'self-care': '💆', productivity: '🧹',
  culture: '🏛️', sports: '⚽', adventure: '🧗', shopping: '🛍️', puzzle: '🧠',
};

const FEEDBACK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  up: { label: 'İYİ GELDİ', color: '#059669', bg: '#D1FAE5' },
  down: { label: 'SEVMEDİM', color: '#EF4444', bg: '#FEE2E2' },
  retry: { label: 'HARİKA', color: '#7C3AED', bg: '#EDE9FE' },
};

interface ActivityCardProps {
  decision: Decision;
}

export default function ActivityCard({ decision }: ActivityCardProps) {
  const { selectedActivity, feedback, createdAt } = decision;
  const icon = CATEGORY_ICONS[selectedActivity.category] || '✨';
  const time = new Date(createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const durationMid = Math.round((selectedActivity.durationMin + selectedActivity.durationMax) / 2);
  const feedbackInfo = feedback ? FEEDBACK_CONFIG[feedback] : null;

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 10,
    }}>
      {/* Icon */}
      <View style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{ fontSize: 22 }}>{icon}</Text>
      </View>

      {/* Info */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
          {durationMid} dk {selectedActivity.title.toLowerCase()}
        </Text>
        <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{time}</Text>
      </View>

      {/* Feedback badge */}
      {feedbackInfo ? (
        <View style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 8,
          backgroundColor: feedbackInfo.bg,
        }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: feedbackInfo.color }}>
            {feedbackInfo.label}
          </Text>
        </View>
      ) : (
        <View style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 8,
          backgroundColor: '#F3F4F6',
        }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF' }}>NÖTR</Text>
        </View>
      )}
    </View>
  );
}
