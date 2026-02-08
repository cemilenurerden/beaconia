// ---- User ----
export interface User {
  id: string;
  name: string;
  email: string;
  city: string | null;
  createdAt: string;
}

// ---- Auth ----
export interface AuthResult {
  accessToken: string;
  user: User;
}

// ---- Activity ----
export type EnergyLevel = 'low' | 'medium' | 'high';
export type Location = 'home' | 'outdoor' | 'any';
export type Cost = 'free' | 'low' | 'medium';
export type Social = 'solo' | 'friends' | 'both';
export type Feedback = 'up' | 'down' | 'retry';

export interface Activity {
  id: string;
  title: string;
  category: string;
  tags: string[];
  durationMin: number;
  durationMax: number;
  energyLevel: EnergyLevel;
  moodTags: string[];
  location: Location;
  cost: Cost;
  social: Social;
  steps: string[];
  safetyNotes: string | null;
  url: string | null;
  createdAt: string;
}

// ---- Recommend ----
export interface RecommendInput {
  duration: number;
  energy: EnergyLevel;
  location: Location;
  cost: Cost;
  social: Social;
  mood?: string;
}

export interface RecommendResult {
  decisionId: string | null;
  selected: Activity;
  reason: string;
  firstStep: string;
  planB: Activity | null;
}

// ---- Decision History ----
export interface Decision {
  id: string;
  inputJson: RecommendInput;
  selectedActivity: Activity;
  planBActivity: Activity | null;
  reason: string;
  firstStep: string;
  feedback: Feedback | null;
  feedbackReason: string | null;
  createdAt: string;
}

// ---- API Response ----
export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details: string[];
  };
}

// ---- Pagination ----
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}
