import { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LOADING_MESSAGES } from '../../constants/activity-suggest';

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotating messages
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);

    // Dot animation
    const animateDots = () => {
      const createDotAnim = (dot: Animated.Value, delay: number) =>
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ]);

      Animated.loop(
        Animated.parallel([
          createDotAnim(dot1, 0),
          createDotAnim(dot2, 200),
          createDotAnim(dot3, 400),
        ]),
      ).start();
    };

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();

    animateDots();
    return () => clearInterval(msgTimer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF0FA', alignItems: 'center', justifyContent: 'center' }}>
      {/* Pulse halo */}
      <Animated.View
        style={{
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: '#DDD6FE',
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale: pulse }],
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Ionicons name="sparkles" size={36} color="#3B3FBF" />
        </View>
      </Animated.View>

      {/* Title */}
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginTop: 32 }}>
        Sana Özel Seçiliyor
      </Text>

      {/* Animated dots */}
      <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#3B3FBF',
              opacity: dot,
            }}
          />
        ))}
      </View>

      {/* Bottom message */}
      <Text style={{ position: 'absolute', bottom: 60, fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 40 }}>
        {LOADING_MESSAGES[msgIndex]}
      </Text>
    </View>
  );
}
