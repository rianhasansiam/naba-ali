
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function ReactQueryProvider({ children }) {
  // ✅ Optimized QueryClient with better defaults
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: 5 minutes
        staleTime: 1000 * 60 * 5,
        // Cache time: 10 minutes  
        cacheTime: 1000 * 60 * 10,
        // Retry failed requests once
        retry: 1,
        // Don't refetch on window focus
        refetchOnWindowFocus: false,
        // Don't refetch on reconnect unless data is stale
        refetchOnReconnect: 'always',
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}