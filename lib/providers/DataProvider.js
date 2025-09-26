'use client';

import { createContext, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetData } from '../hooks/useGetData';

// Create context for centralized data management
const DataContext = createContext({});

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

// 🚀 PERFORMANCE OPTIMIZATION: Centralized data provider
export const DataProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // 🚀 Global data fetching with shared cache
  const products = useGetData({
    name: 'products',
    api: '/api/products',
    cacheType: 'STATIC'
  });

  const categories = useGetData({
    name: 'categories',
    api: '/api/categories',
    cacheType: 'STATIC'
  });

  const reviews = useGetData({
    name: 'reviews',
    api: '/api/reviews',
    cacheType: 'DYNAMIC'
  });

  const users = useGetData({
    name: 'users',
    api: '/api/users',
    cacheType: 'DYNAMIC'
  });

  const orders = useGetData({
    name: 'orders',
    api: '/api/orders',
    cacheType: 'USER_SPECIFIC'
  });

  const coupons = useGetData({
    name: 'coupons',
    api: '/api/coupons',
    cacheType: 'DYNAMIC'
  });

  // Performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const logStats = () => {
        const cache = queryClient.getQueryCache();
        console.log('🚀 Query Cache Stats:', {
          totalQueries: cache.getAll().length,
          activeQueries: cache.getAll().filter(q => q.state.status === 'success').length,
          loadingQueries: cache.getAll().filter(q => q.state.status === 'loading').length,
        });
      };

      // Log stats every 30 seconds in development
      const interval = setInterval(logStats, 30000);
      return () => clearInterval(interval);
    }
  }, [queryClient]);

  const contextValue = {
    products,
    categories,
    reviews,
    users,
    orders,
    coupons,
    
    // Helper methods
    refetchAll: () => {
      queryClient.invalidateQueries();
    },
    
    refetchProducts: products.refetch,
    refetchCategories: categories.refetch,
    refetchReviews: reviews.refetch,
    refetchUsers: users.refetch,
    refetchOrders: orders.refetch,
    refetchCoupons: coupons.refetch
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};