import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export interface OnboardingItem {
  id: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
  buttonText: string;
  gradient: [string, string];
  iconColor: string;
}

export const onboardingPages: OnboardingItem[] = [
  {
    id: '1',
    icon: 'cloud',
    title: 'Karar Vermek Artık\nÇok Kolay',
    description:
      'Hayatındaki ikilemleri topluluğumuza paylaş, en doğru kararı saniyeler içinde ver.',
    buttonText: 'Başlamak için kaydır',
    gradient: ['#60A5FA', '#3B82F6'],
    iconColor: '#DBEAFE',
  },
  {
    id: '2',
    icon: 'flash',
    title: 'Sadece Tek Bir Öneri',
    description:
      'Kafa karışıklığına yer yok. Sana özel net bir öneri sunuyoruz.',
    buttonText: 'Devam et',
    gradient: ['#60A5FA', '#3B82F6'],
    iconColor: '#DBEAFE',
  },
  {
    id: '3',
    icon: 'sync',
    title: 'Harekete Geçmeye\nHazır mısın?',
    description:
      'Zamanını, bütçeni ve enerjini belirle, gerisini bize bırak. İlk adımı beraber atalım.',
    buttonText: 'Hadi Başlayalım',
    gradient: ['#60A5FA', '#3B82F6'],
    iconColor: '#DBEAFE',
  },
];
