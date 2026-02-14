import { type ReactNode } from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../constants/theme';

interface BaseCardProps {
  icon: string;
  title: string;
  subtitle: string;
  right?: ReactNode;
}

export default function BaseCard({ icon, title, subtitle, right }: BaseCardProps) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 16,
      marginBottom: 10,
    }}>
      {/* Icon */}
      <View style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{ fontSize: 22 }}>{icon}</Text>
      </View>

      {/* Info */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.gray900 }}>
          {title}
        </Text>
        <Text style={{ fontSize: 12, color: colors.gray400, marginTop: 2 }}>
          {subtitle}
        </Text>
      </View>

      {/* Right slot */}
      {right}
    </View>
  );
}
