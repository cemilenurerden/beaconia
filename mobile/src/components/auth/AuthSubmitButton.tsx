import { Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthSubmitButtonProps {
  label: string;
  loading: boolean;
  onPress: () => void;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  className?: string;
}

export function AuthSubmitButton({
  label,
  loading,
  onPress,
  disabled,
  icon = 'arrow-forward',
  className = 'mt-4 mb-6',
}: AuthSubmitButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center rounded-2xl bg-blue-500 py-4 ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <Text className="text-base font-semibold text-white mr-2">{label}</Text>
          <Ionicons name={icon} size={18} color="white" />
        </>
      )}
    </Pressable>
  );
}
