/**
 * Data prefetching utility for critical resources
 */
import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CACHE_CONFIG } from '../queries/queryConfig';

const isDev = process.env.NODE_ENV === 'development';

export const prefetchCriticalData = async (queryClient) => {
  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['products'],
        queryFn: () => axios.get('/api/products').then(res => res.data),
        ...CACHE_CONFIG.STATIC
      }),
      queryClient.prefetchQuery({
        queryKey: ['categories'],
        queryFn: () => axios.get('/api/categories').then(res => res.data),
        ...CACHE_CONFIG.STATIC
      })
    ]);
  } catch (error) {
    if (isDev) console.warn('Failed to prefetch data:', error);
  }
};

export const usePrefetchData = () => {
  const queryClient = new QueryClient();
  
  return { 
    prefetch: () => prefetchCriticalData(queryClient)
  };
};