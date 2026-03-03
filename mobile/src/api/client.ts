import { API_URL } from '../constants';
import { useAuthStore } from '../store/auth';
import type { ApiErrorResponse } from '../types';

const REQUEST_TIMEOUT = 45_000;

class ApiClient {
  private baseURL: string;
  private refreshPromise: Promise<string | null> | null = null;

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

  // Eş zamanlı 401 isteklerinde sadece tek refresh çağrısı yapılır
  private tryRefresh(): Promise<string | null> {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = this.doRefresh().finally(() => {
      this.refreshPromise = null;
    });
    return this.refreshPromise;
  }

  private async doRefresh(): Promise<string | null> {
    const { refreshToken, setTokens, logout } = useAuthStore.getState();
    if (!refreshToken) return null;
    try {
      const res = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        await logout();
        return null;
      }
      const body = await res.json();
      const { accessToken, refreshToken: newRefreshToken } = body.data;
      setTokens(accessToken, newRefreshToken);
      return accessToken;
    } catch {
      await logout();
      return null;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const headers = this.getHeaders();
    if (options.body instanceof FormData) {
      delete headers['Content-Type']; // fetch otomatik multipart boundary koyar
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...headers,
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

    // 401 → token refresh dene, bir kez tekrar et (auth endpoint'lerinde atla)
    const isAuthEndpoint = endpoint.startsWith('/auth/');
    if (response.status === 401 && !isRetry && !isAuthEndpoint) {
      const newToken = await this.tryRefresh();
      if (newToken) {
        return this.request<T>(endpoint, options, true);
      }
      throw new ApiError('Oturum süresi doldu. Lütfen tekrar giriş yapın.', 'UNAUTHORIZED', 401);
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

  async uploadPhoto<T>(endpoint: string, uri: string, fieldName = 'photo'): Promise<T> {
    const filename = uri.split('/').pop() ?? 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append(fieldName, { uri, name: filename, type } as any);

    return this.request<T>(endpoint, { method: 'POST', body: formData as any });
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
