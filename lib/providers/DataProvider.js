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
  // Cache stats logging removed for production

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