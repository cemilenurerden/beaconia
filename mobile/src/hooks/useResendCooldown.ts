import { useState, useEffect, useCallback } from 'react';

const COOLDOWN_SECONDS = 60;

export function useResendCooldown() {
  const [seconds, setSeconds] = useState(COOLDOWN_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const reset = useCallback(() => setSeconds(COOLDOWN_SECONDS), []);

  return { seconds, canResend: seconds <= 0, reset };
}
