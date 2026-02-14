import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

interface EmptyStateProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
      <View style={{
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>
        <Ionicons name={icon} size={32} color="#9CA3AF" />
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
