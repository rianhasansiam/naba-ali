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

// Normalize API URLs to the same query keys invalidated by mutation hooks.
const apiToKeyMap = {
  '/api/products': 'products',
  '/api/categories': 'categories',
  '/api/users': 'users',
  '/api/reviews': 'reviews',
  '/api/orders': 'orders',
  '/api/coupons': 'coupons',
  '/api/contacts': 'contacts',
  '/api/shipping-tax-settings': 'shipping-tax-settings'
};

const getApiPath = (api) => {
  if (!api) return '';
  return api.split('?')[0].replace(/\/+$/, '');
};

const normalizeQueryKey = (api, fallbackName) => {
  const apiPath = getApiPath(api);
  if (!apiPath) return fallbackName || api;

  if (apiToKeyMap[apiPath]) {
    return apiToKeyMap[apiPath];
  }

  const baseApi = apiPath.split('/').slice(0, 3).join('/');
  if (apiToKeyMap[baseApi]) {
    return apiPath === baseApi ? apiToKeyMap[baseApi] : apiPath;
  }

  return fallbackName || apiPath || api;
};

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

const unwrapApiPayload = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return data;
  }

  if (hasOwn(data, 'data') && (hasOwn(data, 'success') || hasOwn(data, 'pagination'))) {
    return data.data;
  }

  return data;
};

// Data normalization based on API endpoint
const normalizeResponseData = (data, api) => {
  if (!data) return data;
  
  const endpoint = normalizeQueryKey(api);
  const payload = unwrapApiPayload(data);
  
  try {
    switch (endpoint) {
      case 'products':
        return Array.isArray(payload) ? normalizeProducts(payload) : normalizeProduct(payload);
      case 'orders':
        return Array.isArray(payload) ? normalizeOrders(payload) : normalizeOrder(payload);
      case 'reviews':
        return Array.isArray(payload) ? normalizeReviews(payload) : normalizeReview(payload);
      case 'coupons':
        return Array.isArray(payload) ? normalizeCoupons(payload) : normalizeCoupon(payload);
      case 'categories':
        return Array.isArray(payload) ? normalizeCategories(payload) : normalizeCategory(payload);
      case 'users':
        return Array.isArray(payload) ? normalizeUsers(payload) : normalizeUser(payload);
      default:
        return payload;
    }
  } catch (error) {
    console.warn(`Data normalization failed for ${endpoint}:`, error);
    return payload; // Return usable API payload if normalization fails
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
  
  const queryKey = [normalizeQueryKey(api, name)];

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
