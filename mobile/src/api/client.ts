import { API_URL } from '../constants';
import { useAuthStore } from '../store/auth';
import type { ApiErrorResponse } from '../types';

const REQUEST_TIMEOUT = 15_000;

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = useAuthStore.getState().token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') {
        throw new ApiError('İstek zaman aşımına uğradı.', 'TIMEOUT', 0);
      }
      throw new ApiError('Sunucuya bağlanılamadı.', 'NETWORK_ERROR', 0);
    } finally {
      clearTimeout(timeout);
    }

    let body: any;
    try {
      body = await response.json();
    } catch {
      throw new ApiError('Sunucudan geçersiz yanıt alındı.', 'PARSE_ERROR', response.status);
    }

    if (!response.ok) {
      const error = body as ApiErrorResponse;
      throw new ApiError(
        error?.error?.message ?? 'Bir hata oluştu.',
        error?.error?.code ?? 'UNKNOWN',
        response.status,
        error?.error?.details ?? [],
      );
    }

    return body.data as T;
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details: string[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = new ApiClient(API_URL);
