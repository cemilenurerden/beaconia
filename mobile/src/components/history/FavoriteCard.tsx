import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORY_ICONS } from '../../constants/activity-suggest';
import { colors } from '../../constants/theme';
import BaseCard from './BaseCard';
import type { Activity } from '../../types';

interface FavoriteCardProps {
  activity: Activity;
  onRemove: (activityId: string) => void;
}

const LOCATION_LABELS: Record<string, string> = {
  home: 'Evde',
  outdoor: 'Dışarıda',
};

export default function FavoriteCard({ activity, onRemove }: FavoriteCardProps) {
  const icon = CATEGORY_ICONS[activity.category] || '✨';
  const durationMid = Math.round((activity.durationMin + activity.durationMax) / 2);
  const locationLabel = LOCATION_LABELS[activity.location] ?? 'Her yerde';

  return (
    <BaseCard
      icon={icon}
      title={activity.title}
      subtitle={`${durationMid} dk · ${locationLabel}`}
      right={
        <TouchableOpacity onPress={() => onRemove(activity.id)} activeOpacity={0.7}>
          <Ionicons name="heart" size={22} color={colors.red} />
        </TouchableOpacity>
      }
    />
  );
}
