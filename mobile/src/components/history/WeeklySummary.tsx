import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/theme';

interface WeeklySummaryProps {
  totalActivities: number;
  onPress?: () => void;
}

export default function WeeklySummary({ totalActivities, onPress }: WeeklySummaryProps) {
  return (
    <View style={{
      borderRadius: 20,
      backgroundColor: colors.purple,
      padding: 22,
      marginTop: 8,
    }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.white, marginBottom: 6 }}>
        Haftalık Özet
      </Text>
      <Text style={{ fontSize: 14, color: colors.purplePale, lineHeight: 20, marginBottom: 14 }}>
        Bu hafta {totalActivities} farklı etkinlik tamamladın. Harika gidiyorsun!
      </Text>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{
          alignSelf: 'flex-start',
          backgroundColor: colors.white,
          paddingHorizontal: 18,
          paddingVertical: 10,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.purple }}>Analizi Gör</Text>
      </TouchableOpacity>
    </View>
  );
}
