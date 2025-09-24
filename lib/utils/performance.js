// lib/utils/performance.js

// Performance monitoring for data fetching
export const measureApiPerformance = (queryKey, startTime) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Log slow queries (> 2 seconds)
  if (duration > 2000) {
    console.warn(`Slow query detected: ${queryKey} took ${duration.toFixed(2)}ms`);
  }
  
  // Store performance data
  if (typeof window !== 'undefined') {
    const perfData = JSON.parse(localStorage.getItem('query-performance') || '{}');
    perfData[queryKey] = {
      duration: duration.toFixed(2),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('query-performance', JSON.stringify(perfData));
  }
  
  return duration;
};

// Get performance statistics
export const getPerformanceStats = () => {
  if (typeof window === 'undefined') return {};
  
  try {
    return JSON.parse(localStorage.getItem('query-performance') || '{}');
  } catch {
    return {};
  }
};

// Clear performance data
export const clearPerformanceData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('query-performance');
  }
};