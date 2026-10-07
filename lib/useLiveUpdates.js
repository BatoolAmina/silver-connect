'use client';

import { useEffect } from 'react';

const UPDATE_INTERVAL_MS = 30_000;

export function useLiveUpdates(refresh, enabled) {
  useEffect(() => {
    if (!enabled) return undefined;

    let isRefreshing = false;
    const refreshIfVisible = async () => {
      if (document.visibilityState !== 'visible' || isRefreshing) return;

      isRefreshing = true;
      try {
        await refresh();
      } finally {
        isRefreshing = false;
      }
    };

    const intervalId = window.setInterval(refreshIfVisible, UPDATE_INTERVAL_MS);
    window.addEventListener('focus', refreshIfVisible);
    document.addEventListener('visibilitychange', refreshIfVisible);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshIfVisible);
      document.removeEventListener('visibilitychange', refreshIfVisible);
    };
  }, [refresh, enabled]);
}
