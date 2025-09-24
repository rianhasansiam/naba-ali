// lib/queries/queryConfig.js
export const QUERY_KEYS = {
  // Core data that rarely changes
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  
  // User-specific data  
  USERS: 'users',
  ORDERS: 'orders',
  PROFILE: 'profile',
  
  // Dynamic data
  REVIEWS: 'reviews',
  CART: 'cart',
  COUPONS: 'coupons'
};

// Cache configuration based on data type
export const CACHE_CONFIG = {
  // Static data - cache for longer
  STATIC: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,    // 30 minutes (was cacheTime)
    refetchOnWindowFocus: false,
    retry: 2
  },
  
  // Dynamic data - shorter cache
  DYNAMIC: {
    staleTime: 2 * 60 * 1000,  // 2 minutes
    gcTime: 5 * 60 * 1000,     // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1
  },
  
  // User-specific data - minimal cache
  USER_SPECIFIC: {
    staleTime: 30 * 1000,      // 30 seconds
    gcTime: 2 * 60 * 1000,     // 2 minutes
    refetchOnWindowFocus: true,
    retry: 1
  }
};

// API endpoints configuration
export const API_ENDPOINTS = {
  products: '/api/products',
  users: '/api/users',
  categories: '/api/categories',
  reviews: '/api/reviews',
  orders: '/api/orders',
  coupons: '/api/coupons'
};