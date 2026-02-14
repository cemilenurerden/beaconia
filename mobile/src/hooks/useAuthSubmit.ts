import { useState, useCallback } from 'react';
import { ApiError } from '../api/client';

export function useAuthSubmit<T = void>(
  action: () => Promise<T>,
  fallbackMessage = 'Bir hata oluştu. Tekrar deneyin.',
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      await action();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : fallbackMessage);
    } finally {
      setLoading(false);
    }
  }, [action, fallbackMessage]);

  return { loading, error, submit };
}
