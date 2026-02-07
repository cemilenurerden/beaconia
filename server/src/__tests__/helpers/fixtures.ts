// Mock data fixtures for tests

export const mockUser = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'test@example.com',
  passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$hash',
  city: 'Istanbul',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const mockUser2 = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'other@example.com',
  passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$hash2',
  city: 'Ankara',
  createdAt: new Date('2024-01-02T00:00:00.000Z'),
};

export const mockActivity = {
  id: '660e8400-e29b-41d4-a716-446655440000',
  title: 'Yoga Yap',
  category: 'wellness',
  tags: ['relaxation', 'fitness'],
  durationMin: 15,
  durationMax: 45,
  energyLevel: 'low' as const,
  moodTags: ['stressed', 'anxious', 'tired'],
  location: 'home' as const,
  cost: 'free' as const,
  social: 'solo' as const,
  steps: ['Yoga matını ser', 'Nefes egzersizi yap', 'Basit pozlarla başla'],
  safetyNotes: null,
  url: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const mockActivity2 = {
  id: '660e8400-e29b-41d4-a716-446655440001',
  title: 'Parkta Koşu',
  category: 'fitness',
  tags: ['running', 'outdoor'],
  durationMin: 20,
  durationMax: 60,
  energyLevel: 'high' as const,
  moodTags: ['energetic', 'stressed', 'bored'],
  location: 'outdoor' as const,
  cost: 'free' as const,
  social: 'solo' as const,
  steps: ['Spor ayakkabılarını giy', 'Isınma hareketleri yap', 'Koşuya başla'],
  safetyNotes: 'Bol su iç',
  url: null,
  createdAt: new Date('2024-01-02T00:00:00.000Z'),
};

export const mockActivity3 = {
  id: '660e8400-e29b-41d4-a716-446655440002',
  title: 'Film İzle',
  category: 'entertainment',
  tags: ['movie', 'relaxation'],
  durationMin: 90,
  durationMax: 180,
  energyLevel: 'low' as const,
  moodTags: ['bored', 'tired', 'happy'],
  location: 'home' as const,
  cost: 'low' as const,
  social: 'both' as const,
  steps: ['Film seç', 'Atıştırmalık hazırla', 'Keyfini çıkar'],
  safetyNotes: null,
  url: null,
  createdAt: new Date('2024-01-03T00:00:00.000Z'),
};

export const mockDecision = {
  id: '770e8400-e29b-41d4-a716-446655440000',
  userId: mockUser.id,
  inputJson: {
    duration: 30,
    energy: 'low',
    location: 'home',
    cost: 'free',
    social: 'solo',
  },
  selectedActivityId: mockActivity.id,
  planBActivityId: mockActivity2.id,
  reason: 'Bu aktivite düşük enerji seviyenize uygun ve evde yapılabilir.',
  firstStep: 'Yoga matını ser',
  feedback: null,
  feedbackReason: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const mockFavorite = {
  id: '880e8400-e29b-41d4-a716-446655440000',
  userId: mockUser.id,
  activityId: mockActivity.id,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  activity: mockActivity,
};
