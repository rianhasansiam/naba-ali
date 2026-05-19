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

export function useSocketInvalidation(enabledKeys = null) {
  const qc = useQueryClient();
  // Use a ref so enabledKeys does not cause the effect to re-run on every render
  const enabledKeysRef = useRef(enabledKeys);

  useEffect(() => {
    let socket = null;
    const keys = enabledKeysRef.current;

    const connect = async () => {
      try {
        const { io } = await import('socket.io-client');
        socket = io({ path: '/socket.io', transports: ['websocket', 'polling'] });

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
        console.warn('Socket.io unavailable:', err.message);
      }
    };

    connect();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [qc]); // qc is stable; enabledKeys captured via ref
}
