
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function ReactQueryProvider({ children }) {
  // ✅ Simplified QueryClient for debugging
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1 * 60 * 1000,  // 1 minute
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
    // Global error handler
    errorHandler: (error) => {
      console.error('Query error:', error);
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Enable React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}