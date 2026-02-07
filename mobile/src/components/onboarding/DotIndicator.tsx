import { View } from 'react-native';

interface DotIndicatorProps {
  total: number;
  activeIndex: number;
}

export function DotIndicator({ total, activeIndex }: DotIndicatorProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          className={`h-2.5 rounded-full ${
            i === activeIndex ? 'w-8 bg-blue-500' : 'w-2.5 bg-gray-300'
          }`}
        />
      ))}
    </View>
  );
}
