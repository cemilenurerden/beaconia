import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export interface OnboardingItem {
  id: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
  buttonText: string;
}

export const onboardingPages: OnboardingItem[] = [
  {
    id: '1',
    icon: 'cloud-outline',
    title: 'Karar Vermek Artık\nÇok Kolay',
    description:
      'Hayatındaki ikilemleri topluluğumuza paylaş, en doğru kararı saniyeler içinde ver.',
    buttonText: 'Başlamak için kaydır',
  },
  {
    id: '2',
    icon: 'flash-outline',
    title: 'Sadece Tek Bir Öneri',
    description:
      'Kafa karışıklığına yer yok. Sana özel net bir öneri sunuyoruz.',
    buttonText: 'Devam et',
  },
  {
    id: '3',
    icon: 'sync-outline',
    title: 'Harekete Geçmeye\nHazır mısın?',
    description:
      'Zamanını, bütçeni ve enerjini belirle, gerisini bize bırak. İlk adımı beraber atalım.',
    buttonText: 'Hadi Başlayalım',
  },
  {
    id: '4',
    icon: 'compass-outline',
    title: 'Net Kararlar.',
    description:
      'Hayatınızı sadeleştirin, kararlarınızı renklerle netleştirin.',
    buttonText: 'Başla',
  },
];
