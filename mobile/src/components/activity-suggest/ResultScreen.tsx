import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORY_ICONS } from '../../constants/activity-suggest';
import type { RecommendResult } from '../../types';

interface ResultScreenProps {
  result: RecommendResult;
  onRetry: () => void;
  onBack: () => void;
  onFavorite: () => void;
}

export default function ResultScreen({ result, onRetry, onBack, onFavorite }: ResultScreenProps) {
  const [showPlanB, setShowPlanB] = useState(false);
  const { selected, reason, firstStep, planB } = result;
  const icon = CATEGORY_ICONS[selected.category] || '✨';
  const durationMid = Math.round((selected.durationMin + selected.durationMax) / 2);

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F4FF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Senin İçin Seçtik</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="share-outline" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Activity Card */}
        <View style={{ alignItems: 'center', marginTop: 28, marginBottom: 28 }}>
          <Text style={{ fontSize: 64 }}>{icon}</Text>
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#111827', marginTop: 16, textAlign: 'center' }}>
            {selected.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, marginTop: 14 }}>
            <Ionicons name="time-outline" size={16} color="#059669" />
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#059669', marginLeft: 6 }}>
              Toplam {durationMid} Dakika
            </Text>
          </View>
        </View>

        {/* Reason Card */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Ionicons name="sparkles" size={20} color="#7C3AED" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginLeft: 8 }}>Neden bu?</Text>
          </View>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 18, padding: 22, minHeight: 100, borderWidth: 1, borderColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 16, color: '#374151', lineHeight: 26 }}>{reason}</Text>
          </View>
        </View>

        {/* First Step Card */}
        <View style={{ backgroundColor: '#059669', borderRadius: 18, padding: 22, minHeight: 90, marginBottom: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#A7F3D0', letterSpacing: 1, marginBottom: 10 }}>
            ŞİMDİ HEMEN BAŞLA
          </Text>
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF', lineHeight: 26 }}>
            İlk Adım: {firstStep}
          </Text>
        </View>

        {/* Plan B */}
        {planB && (
          <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setShowPlanB(!showPlanB)}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18 }}>🔀</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginLeft: 8 }}>
                  Başka bir şey mi lazım? (Plan B)
                </Text>
              </View>
              <Ionicons name={showPlanB ? 'chevron-up' : 'chevron-down'} size={22} color="#6B7280" />
            </TouchableOpacity>
            {showPlanB && (
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E5E7EB' }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                  {CATEGORY_ICONS[planB.category] || '✨'} {planB.title}
                </Text>
                <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 6 }}>
                  {Math.round((planB.durationMin + planB.durationMax) / 2)} dakika
                  {planB.location === 'home' ? ' · Evde' : planB.location === 'outdoor' ? ' · Dışarıda' : ''}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', backgroundColor: '#FFFFFF',
        paddingVertical: 14, paddingHorizontal: 20,
        borderTopWidth: 1, borderTopColor: '#F3F4F6',
        justifyContent: 'space-around',
      }}>
        <TouchableOpacity onPress={onFavorite} activeOpacity={0.7} style={{ alignItems: 'center' }}>
          <Ionicons name="thumbs-up" size={24} color="#059669" />
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#059669', marginTop: 4 }}>HARİKA</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onRetry} activeOpacity={0.7} style={{ alignItems: 'center' }}>
          <Ionicons name="refresh" size={24} color="#F59E0B" />
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#F59E0B', marginTop: 4 }}>YENİLE</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={{ alignItems: 'center' }}>
          <Ionicons name="hand-left" size={24} color="#EF4444" />
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#EF4444', marginTop: 4 }}>KALSIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
