import { useState } from 'react';
import { View, Text, TextInput, Pressable, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  error?: string;
}

export function AuthInput({ label, isPassword, error, ...rest }: AuthInputProps) {
  const [secure, setSecure] = useState(isPassword);

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <View
        className={`flex-row items-center rounded-xl border bg-white px-4 py-3.5 ${
          error ? 'border-red-400' : 'border-gray-200'
        }`}
      >
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secure}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword && (
          <Pressable onPress={() => setSecure((s) => !s)} hitSlop={8}>
            <Ionicons
              name={secure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#9CA3AF"
            />
          </Pressable>
        )}
      </View>
      {error && <Text className="text-xs text-red-500 mt-1 ml-1">{error}</Text>}
    </View>
  );
}
