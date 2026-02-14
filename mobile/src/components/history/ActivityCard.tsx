import { View, Text } from 'react-native';
import { CATEGORY_ICONS } from '../../constants/activity-suggest';
import { colors } from '../../constants/theme';
import BaseCard from './BaseCard';
import type { Decision } from '../../types';

const FEEDBACK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  up: { label: 'İYİ GELDİ', color: colors.green, bg: colors.greenLight },
  down: { label: 'SEVMEDİM', color: colors.red, bg: colors.redLight },
  retry: { label: 'HARİKA', color: colors.purple, bg: colors.purpleLight },
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
    <BaseCard
      icon={icon}
      title={`${durationMid} dk ${selectedActivity.title.toLowerCase()}`}
      subtitle={time}
      right={
        <View style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 8,
          backgroundColor: feedbackInfo?.bg ?? colors.gray100,
        }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: feedbackInfo?.color ?? colors.gray400 }}>
            {feedbackInfo?.label ?? 'NÖTR'}
          </Text>
        </View>
      }
    />
  );
}
