import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Activity } from '../../types';

const CATEGORY_ICONS: Record<string, string> = {
  fitness: '🏃', wellness: '🧘', entertainment: '🎬', education: '📚',
  social: '👥', cooking: '🍳', outdoor: '🌿', art: '🎨',
  music: '🎵', hobby: '🧩', 'self-care': '💆', productivity: '🧹',
  culture: '🏛️', sports: '⚽', adventure: '🧗', shopping: '🛍️', puzzle: '🧠',
};

interface FavoriteCardProps {
  activity: Activity;
  onRemove: (activityId: string) => void;
}

export default function FavoriteCard({ activity, onRemove }: FavoriteCardProps) {
  const icon = CATEGORY_ICONS[activity.category] || '✨';
  const durationMid = Math.round((activity.durationMin + activity.durationMax) / 2);

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
          {activity.title}
        </Text>
        <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
          {durationMid} dk · {activity.location === 'home' ? 'Evde' : activity.location === 'outdoor' ? 'Dışarıda' : 'Her yerde'}
        </Text>
      </View>

      {/* Remove button */}
      <TouchableOpacity onPress={() => onRemove(activity.id)} activeOpacity={0.7}>
        <Ionicons name="heart" size={22} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
}
