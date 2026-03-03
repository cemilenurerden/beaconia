import { useRef, useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const refs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => refs.current[0]?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/\D/g, '');

    // Paste: birden fazla karakter
    if (digit.length > 1) {
      const pasted = digit.slice(0, 6);
      onChange(pasted);
      refs.current[Math.min(pasted.length - 1, 5)]?.focus();
      return;
    }

    const chars = Array.from({ length: 6 }, (_, i) => value[i] ?? '');
    chars[index] = digit;
    onChange(chars.join(''));

    if (digit && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      const chars = Array.from({ length: 6 }, (_, i) => value[i] ?? '');
      chars[index - 1] = '';
      onChange(chars.join(''));
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-center gap-3 my-6">
      {Array.from({ length: 6 }, (_, i) => {
        const digit = value[i] ?? '';
        const isFilled = digit !== '';
        const isFocused = focusedIndex === i;

        return (
          <TextInput
            key={i}
            ref={(r) => { refs.current[i] = r; }}
            value={digit}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
            onFocus={() => setFocusedIndex(i)}
            onBlur={() => setFocusedIndex(null)}
            keyboardType="number-pad"
            maxLength={6}
            editable={!disabled}
            selectTextOnFocus
            className="text-center font-bold text-xl text-gray-900 dark:text-white"
            style={{
              width: 44,
              height: 52,
              borderWidth: isFocused ? 2 : 1.5,
              borderRadius: 10,
              borderColor: isFocused ? '#4F46E5' : isFilled ? '#6366F1' : '#D1D5DB',
              backgroundColor: isFilled ? '#EEF2FF' : '#F9FAFB',
            }}
          />
        );
      })}
    </View>
  );
}
