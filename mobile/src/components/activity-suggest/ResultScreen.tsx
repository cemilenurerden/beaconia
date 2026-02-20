import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORY_ICONS, PLAN_B_REASONS } from '../../constants/activity-suggest';
import type { RecommendResult } from '../../types';

const MAX_FREE_REFRESHES = 3;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ResultScreenProps {
  result: RecommendResult;
  onRetry: () => void;
  onBack: () => void;
  onFavorite: () => void;
  onSelectPlanB: (reason?: string) => void;
  refreshCount: number;
}

export default function ResultScreen({ result, onRetry, onBack, onFavorite, onSelectPlanB, refreshCount }: ResultScreenProps) {
  const [showPlanB, setShowPlanB] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const { selected, reason, firstStep, planB } = result;
  const icon = CATEGORY_ICONS[selected.category] || '✨';
  const durationMid = Math.round((selected.durationMin + selected.durationMax) / 2);
  const planBDuration = planB ? Math.round((planB.durationMin + planB.durationMax) / 2) : 0;

  function handleChoosePlanB() {
    setShowReasonModal(true);
  }

  function handleSaveReason() {
    onSelectPlanB(selectedReason ?? undefined);
    setShowReasonModal(false);
    setSelectedReason(null);
  }

  function handleSkipReason() {
    onSelectPlanB();
    setShowReasonModal(false);
    setSelectedReason(null);
  }

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
            <Ionicons name="sparkles" size={20} color="#4F46E5" />
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
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#E5E7EB' }}>
            {/* Plan B Header */}
            <TouchableOpacity
              onPress={() => setShowPlanB(!showPlanB)}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="swap-horizontal" size={20} color="#4F46E5" />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontSize: 17, fontWeight: '700', color: '#111827' }}>Plan B</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#4F46E5', letterSpacing: 0.5 }}>ALTERNATİF SEÇENEK</Text>
                </View>
              </View>
              <Ionicons name={showPlanB ? 'chevron-up' : 'chevron-down'} size={22} color="#6B7280" />
            </TouchableOpacity>

            {/* Plan B Content */}
            {showPlanB && (
              <View style={{ marginTop: 16 }}>
                <View style={{ backgroundColor: '#F8FAFC', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#4F46E5', marginBottom: 8 }}>
                    Enerjine daha uygun alternatif:
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', lineHeight: 26 }}>
                    {planBDuration} dk {planB.title}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                    <Ionicons name="bulb-outline" size={16} color="#9CA3AF" />
                    <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 6, flex: 1 }}>
                      {planB.location === 'home' ? 'Evde rahatça yapabileceğin bir alternatif.' : planB.location === 'outdoor' ? 'Dışarıda yapabileceğin bir alternatif.' : 'İstediğin yerde yapabileceğin bir alternatif.'}
                    </Text>
                  </View>
                </View>

                {/* Bunu Yapacağım Button */}
                <TouchableOpacity
                  onPress={handleChoosePlanB}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: '#4F46E5', borderRadius: 14, paddingVertical: 16,
                    alignItems: 'center', justifyContent: 'center', marginTop: 14,
                    flexDirection: 'row',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginRight: 8 }}>Bunu Yapacağım</Text>
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                </TouchableOpacity>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#F59E0B' }}>YENİLE</Text>
            <Text style={{ fontSize: 10, fontWeight: '600', color: '#9CA3AF', marginLeft: 4 }}>
              {MAX_FREE_REFRESHES - refreshCount}/{MAX_FREE_REFRESHES}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={{ alignItems: 'center' }}>
          <Ionicons name="hand-left" size={24} color="#EF4444" />
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#EF4444', marginTop: 4 }}>KALSIN</Text>
        </TouchableOpacity>
      </View>

      {/* Plan B Reason Modal */}
      <Modal visible={showReasonModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handleSkipReason} />
          <View style={{
            backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28,
            paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40,
            maxHeight: SCREEN_HEIGHT * 0.55,
          }}>
            {/* Handle */}
            <View style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', marginBottom: 20 }} />

            {/* Icon */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="bulb" size={24} color="#4F46E5" />
              </View>
            </View>

            {/* Title */}
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 8 }}>
              Neden Plan A yerine bunu seçtin?
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
              Tercihlerini öğrenerek sana daha iyi öneriler sunabiliriz.
            </Text>

            {/* Reason Chips */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
              {PLAN_B_REASONS.map((r) => {
                const isSelected = selectedReason === r;
                return (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setSelectedReason(isSelected ? null : r)}
                    activeOpacity={0.7}
                    style={{
                      paddingHorizontal: 18, paddingVertical: 12, borderRadius: 24,
                      borderWidth: 1.5,
                      backgroundColor: isSelected ? '#EDE9FE' : '#FFFFFF',
                      borderColor: isSelected ? '#4F46E5' : '#E5E7EB',
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: isSelected ? '#4F46E5' : '#374151' }}>
                      {r} {isSelected ? '✕' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSaveReason}
              activeOpacity={0.8}
              style={{
                backgroundColor: '#4F46E5', borderRadius: 16, paddingVertical: 18,
                alignItems: 'center', marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF' }}>Kaydet</Text>
            </TouchableOpacity>

            {/* Skip */}
            <TouchableOpacity onPress={handleSkipReason} activeOpacity={0.7} style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Text style={{ fontSize: 15, color: '#9CA3AF', fontWeight: '600' }}>Atla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
