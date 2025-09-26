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
  COUPONS: 'coupons',
  CONTACTS: 'contacts'
};

// Cache configuration based on data type - optimized for performance
export const CACHE_CONFIG = {
  // Static data - cache for longer (products, categories don't change often)
  STATIC: {
    staleTime: 30 * 60 * 1000, // 30 minutes - increased for better caching
    gcTime: 60 * 60 * 1000,    // 1 hour - longer garbage collection
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true
  },
  
  // Dynamic data - moderate cache (reviews, available stock)
  DYNAMIC: {
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 15 * 60 * 1000,    // 15 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    refetchOnReconnect: true
  },
  
  // User-specific data - short cache (cart, orders, profile)
  USER_SPECIFIC: {
    staleTime: 1 * 60 * 1000,      // 1 minute
    gcTime: 5 * 60 * 1000,         // 5 minutes
    refetchOnWindowFocus: true,
    retry: 1,
    refetchOnReconnect: true
  },
  
  // No cache for real-time data
  NO_CACHE: {
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    retry: 0
  }
};

// API endpoints configuration
export const API_ENDPOINTS = {
  products: '/api/products',
  users: '/api/users',
  categories: '/api/categories',
  reviews: '/api/reviews',
  orders: '/api/orders',
  coupons: '/api/coupons',
  contacts: '/api/contacts',
  shippingTax: '/api/shipping-tax-settings'
};