import { View, Text, TouchableOpacity } from 'react-native';

interface WeeklySummaryProps {
  totalActivities: number;
  onPress?: () => void;
}

export default function WeeklySummary({ totalActivities, onPress }: WeeklySummaryProps) {
  return (
    <View style={{
      borderRadius: 20,
      backgroundColor: '#7C3AED',
      padding: 22,
      marginTop: 8,
    }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 }}>
        Haftalık Özet
      </Text>
      <Text style={{ fontSize: 14, color: '#DDD6FE', lineHeight: 20, marginBottom: 14 }}>
        Bu hafta {totalActivities} farklı etkinlik tamamladın. Harika gidiyorsun!
      </Text>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{
          alignSelf: 'flex-start',
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 18,
          paddingVertical: 10,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#7C3AED' }}>Analizi Gör</Text>
      </TouchableOpacity>
    </View>
  );
}
