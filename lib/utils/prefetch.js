// lib/utils/prefetch.js
import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CACHE_CONFIG } from '../queries/queryConfig';

// Utility to prefetch critical data
export const prefetchCriticalData = async (queryClient) => {
  // Prefetch products (most used data)
  await queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: () => axios.get('/api/products').then(res => res.data),
    ...CACHE_CONFIG.STATIC
  });

  // Prefetch categories
  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: () => axios.get('/api/categories').then(res => res.data),
    ...CACHE_CONFIG.STATIC
  });
};

// Hook to prefetch data on app initialization
export const usePrefetchData = () => {
  const queryClient = new QueryClient();
  
  const prefetch = async () => {
    try {
      await prefetchCriticalData(queryClient);
    } catch (error) {
      console.warn('Failed to prefetch data:', error);
    }
  };

  return { prefetch };
};