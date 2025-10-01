/**
 * Performance monitoring utility for production
 */

const isDev = process.env.NODE_ENV === 'development';
const SLOW_QUERY_THRESHOLD = 2000; // 2 seconds

export const measureApiPerformance = (queryKey, startTime) => {
  const duration = performance.now() - startTime;
  
  // Log slow queries in development only
  if (isDev && duration > SLOW_QUERY_THRESHOLD) {
    console.warn(`Slow query: ${queryKey} took ${duration.toFixed(2)}ms`);
  }
  
  return duration;
};

export const getPerformanceStats = () => {
  if (typeof window === 'undefined') return {};
  
  try {
    return JSON.parse(localStorage.getItem('query-performance') || '{}');
  } catch {
    return {};
  }
};

export const clearPerformanceData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('query-performance');
  }
};