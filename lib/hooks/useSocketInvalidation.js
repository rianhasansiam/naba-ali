/**
 * lib/hooks/useSocketInvalidation.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable hook that connects to the Socket.io server and invalidates the
 * React Query cache whenever the server broadcasts a data-change event.
 *
 * Mount once — in a layout or in any component that should stay live.
 * Already mounted in HomePageClient; import here for admin pages etc.
 *
 * Event → Query key mapping:
 *   products:changed   → ['products']
 *   categories:changed → ['categories']
 *   reviews:changed    → ['reviews']
 *   orders:changed     → ['orders']
 *   notification:new   → ['notifications']
 *
 * Usage:
 *   useSocketInvalidation()           // all events
 *   useSocketInvalidation(['products', 'orders'])  // specific events only
 */

'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const EVENT_MAP = {
  'products:changed':   [['products'], ['stats']],
  'categories:changed': [['categories'], ['stats']],
  'reviews:changed':    [['reviews'], ['stats']],
  'orders:changed':     [['orders'], ['stats']],
  'notification:new':   [['notifications']],
};

const ALL_QUERY_KEYS = Object.values(EVENT_MAP).flat();

export function useSocketInvalidation(enabledKeys = null) {
  const qc = useQueryClient();
  // Use a ref so enabledKeys does not cause the effect to re-run on every render
  const enabledKeysRef = useRef(enabledKeys);

  useEffect(() => {
    let socket = null;
    const keys = enabledKeysRef.current;

    const connect = async () => {
      try {
        const socketServer = process.env.NEXT_PUBLIC_SOCKET_URL;

        if (!socketServer) {
          console.warn('Realtime socket disabled: NEXT_PUBLIC_SOCKET_URL is not configured.');
          return;
        }

        const { io } = await import('socket.io-client');
        socket = io(socketServer, {
          transports: ['websocket', 'polling'],
          withCredentials: true,
        });

        Object.entries(EVENT_MAP).forEach(([event, queryKeys]) => {
          // If enabledKeys filter provided, skip unrelated events
          if (keys && !keys.some(k => event.startsWith(k))) return;

          socket.on(event, () => {
            queryKeys.forEach(qk => {
              qc.invalidateQueries({ queryKey: qk });
            });
          });
        });

        socket.on('connect_error', (err) => {
          console.warn('Socket.io connect error:', err.message);
        });
      } catch (err) {
        // socket.io-client not available in SSR/serverless environments
        console.warn('Realtime socket unavailable:', err.message);
      }
    };

    connect();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [qc]); // qc is stable; enabledKeys captured via ref

  useEffect(() => {
    let lastRefresh = 0;
    const keys = enabledKeysRef.current;

    const refreshQueries = () => {
      const now = Date.now();
      if (now - lastRefresh < 30000) return;
      lastRefresh = now;

      const queryKeys = keys
        ? Object.entries(EVENT_MAP)
            .filter(([event]) => keys.some(k => event.startsWith(k)))
            .flatMap(([, mappedKeys]) => mappedKeys)
        : ALL_QUERY_KEYS;

      queryKeys.forEach((queryKey) => {
        qc.invalidateQueries({ queryKey });
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshQueries();
      }
    };

    window.addEventListener('focus', refreshQueries);
    window.addEventListener('pageshow', refreshQueries);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', refreshQueries);
      window.removeEventListener('pageshow', refreshQueries);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [qc]);
}
