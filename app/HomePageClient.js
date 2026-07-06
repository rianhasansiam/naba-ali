'use client';
// app/HomePageClient.js
// ─────────────────────────────────────────────────────────────────────────────
// Client Component that:
//   1. Receives initialData from the Server Component (no loading spinner)
//   2. Hydrates React Query caches with that initialData
//   3. Uses individual useQuery hooks — each section renders independently
//   4. Invalidates queries when Socket.io signals a data change
//
// Architecture:
//   ✅ initialData comes from Server Component (SSR, zero loading spinner)
//   ✅ React Query stays fresh via invalidateQueries after socket events
//   ✅ Redux stores NOTHING from this data (no products/categories in Redux)

import { useEffect }       from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Hero             from './componets/hero/Hero';
import Category         from './componets/category/Category';
import FeaturedProducts from './componets/featuredProducts/FeaturedProducts';
import Review           from './componets/review/Review';

// ── Fetcher helpers (used by React Query for background refresh) ───────────────
const fetchJSON = (url) => fetch(url).then(r => r.json());
const HOME_QUERY_KEYS = [['products'], ['categories'], ['reviews'], ['orders'], ['stats']];
const INVALIDATION_EVENT_MAP = {
  'products:changed': [['products'], ['stats']],
  'categories:changed': [['categories'], ['stats']],
  'reviews:changed': [['reviews'], ['stats']],
  'orders:changed': [['orders'], ['stats']],
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function HomePageClient({ initialData }) {
  const queryClient = useQueryClient();

  // ── Hydrate React Query with server-rendered initialData ───────────────────
  // initialData = the object returned by getHomePageData() on the server.
  // staleTime: 0 means React Query will fetch fresh data in the background,
  // but the page renders instantly with the server data.

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn:  () => fetchJSON('/api/products'),
    initialData: initialData?.products ?? [],
    staleTime: 5 * 60 * 1000,   // 5 min before background refresh
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn:  () => fetchJSON('/api/categories'),
    initialData: initialData?.categories ?? [],
    staleTime: 5 * 60 * 1000,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews'],
    queryFn:  () => fetchJSON('/api/reviews'),
    initialData: initialData?.reviews ?? [],
    staleTime: 5 * 60 * 1000,
  });

  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn:  () => fetchJSON('/api/stats'),
    initialData: initialData?.stats ?? {},
    staleTime: 5 * 60 * 1000,
  });

  // ── Socket.io realtime cache invalidation ─────────────────────────────────
  useEffect(() => {
    let socket = null;

    const connectSocket = async () => {
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

        Object.entries(INVALIDATION_EVENT_MAP).forEach(([event, queryKeys]) => {
          socket.on(event, () => {
            queryKeys.forEach((queryKey) => {
              queryClient.invalidateQueries({ queryKey });
            });
          });
        });

        socket.on('connect_error', (err) => {
          console.warn('Realtime socket connect error:', err.message);
        });
      } catch (err) {
        console.warn('Realtime socket unavailable:', err.message);
      }
    };

    connectSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [queryClient]);

  useEffect(() => {
    let lastRefresh = 0;

    const refreshHomeQueries = () => {
      const now = Date.now();
      if (now - lastRefresh < 30000) return;
      lastRefresh = now;

      HOME_QUERY_KEYS.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshHomeQueries();
      }
    };

    window.addEventListener('focus', refreshHomeQueries);
    window.addEventListener('pageshow', refreshHomeQueries);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', refreshHomeQueries);
      window.removeEventListener('pageshow', refreshHomeQueries);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [queryClient]);

  // ── Render ─────────────────────────────────────────────────────────────────
  // No loading gates — data is ALWAYS available from initialData immediately.
  // Sections render independently; if a section needs loading UI, add it there.
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Hero
        productsData={productsData}
        statsData={statsData}
        reviewsData={reviewsData}
      />
      <Category categoriesData={categoriesData} />
      <FeaturedProducts productsData={productsData} />
      <Review reviewsData={reviewsData} />
    </div>
  );
}
