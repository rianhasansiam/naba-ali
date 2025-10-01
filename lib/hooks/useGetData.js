import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, CACHE_CONFIG, API_ENDPOINTS } from "../queries/queryConfig";
import { 
  normalizeProducts, 
  normalizeOrders, 
  normalizeReviews, 
  normalizeCoupons, 
  normalizeCategories, 
  normalizeUsers,
  normalizeProduct,
  normalizeOrder,
  normalizeReview,
  normalizeCoupon,
  normalizeCategory,
  normalizeUser
} from "../data/dataSchemas";

// Normalize API URL to standard query key for deduplication
const normalizeQueryKey = (api) => {
  // Map API endpoints to standardized query keys to eliminate duplication
  const apiToKeyMap = {
    '/api/products': 'products',
    '/api/categories': 'categories', 
    '/api/users': 'users',
    '/api/reviews': 'reviews',
    '/api/orders': 'orders',
    '/api/coupons': 'coupons',
    '/api/contacts': 'contacts'
  };
  
  // Handle dynamic routes like /api/users/:id
  const baseApi = api?.split('/').slice(0, 3).join('/');
  return apiToKeyMap[baseApi] || api;
};

// Data normalization based on API endpoint
const normalizeResponseData = (data, api) => {
  if (!data) return data;
  
  const endpoint = normalizeQueryKey(api);
  
  try {
    switch (endpoint) {
      case 'products':
        return Array.isArray(data) ? normalizeProducts(data) : normalizeProduct(data);
      case 'orders':
        return Array.isArray(data) ? normalizeOrders(data) : normalizeOrder(data);
      case 'reviews':
        return Array.isArray(data) ? normalizeReviews(data) : normalizeReview(data);
      case 'coupons':
        return Array.isArray(data) ? normalizeCoupons(data) : normalizeCoupon(data);
      case 'categories':
        return Array.isArray(data) ? normalizeCategories(data) : normalizeCategory(data);
      case 'users':
        return Array.isArray(data) ? normalizeUsers(data) : normalizeUser(data);
      default:
        return data;
    }
  } catch (error) {
    console.warn(`Data normalization failed for ${endpoint}:`, error);
    return data; // Return original data if normalization fails
  }
};

// Enhanced hook with intelligent caching, deduplication, and data normalization
export const useGetData = ({ 
  name, 
  api, 
  cacheType = 'STATIC', // STATIC, DYNAMIC, or USER_SPECIFIC
  enabled = true,
  customConfig = {},
  normalize = true // Option to disable normalization if needed
}) => { 
  // Get cache configuration based on data type
  const getCacheConfig = () => {
    switch(cacheType) {
      case 'STATIC':
        return CACHE_CONFIG.STATIC;
      case 'DYNAMIC':
        return CACHE_CONFIG.DYNAMIC;
      case 'USER_SPECIFIC':
        return CACHE_CONFIG.USER_SPECIFIC;
      case 'NO_CACHE':
        return CACHE_CONFIG.NO_CACHE;
      default:
        return CACHE_CONFIG.STATIC;
    }
  };

  const cacheConfig = getCacheConfig();
  
  // Use normalized query key for deduplication while preserving individual IDs for specific resources
  const queryKey = api?.includes('/:') || api?.match(/\/[^\/]+$/) && api !== normalizeQueryKey(api) 
    ? [api] // Keep full path for specific resources like /api/users/123
    : [normalizeQueryKey(api)]; // Use normalized key for list endpoints

  // 🚀 Optimized query with proper caching and data normalization
  const { data, isLoading, error, refetch, isFetching, isStale } = useQuery({
    queryKey,
    queryFn: async () => {

      const startTime = performance.now();
      
      const response = await axios.get(api);
      const rawData = response.data;
      
      // Normalize data based on API endpoint
      const normalizedData = normalize ? normalizeResponseData(rawData, api) : rawData;
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Performance logging removed for production
      
      // Log slow queries (> 2 seconds)
      if (duration > 2000) {
        console.warn(`🐌 Slow query detected: ${queryKey[0]} took ${duration.toFixed(2)}ms`);
      }
      
      return normalizedData;
    },
    enabled: !!api && enabled,
    staleTime: cacheConfig.staleTime,
    gcTime: cacheConfig.gcTime,
    refetchOnWindowFocus: cacheConfig.refetchOnWindowFocus,
    retry: cacheConfig.retry,
    refetchOnReconnect: cacheConfig.refetchOnReconnect,
    ...customConfig
  });

  return { 
    data, 
    isLoading,
    error, 
    refetch, 
    isFetching, 
    isStale,
    // Additional helper properties
    isEmpty: data ? (Array.isArray(data) ? data.length === 0 : false) : true,
    count: data ? (Array.isArray(data) ? data.length : 1) : 0,
    hasData: Boolean(data)
  };
};

// Usage example:
// const { data, isLoading, error } = useGetData({
//   name: 'products', 
//   api: '/api/products'
// });