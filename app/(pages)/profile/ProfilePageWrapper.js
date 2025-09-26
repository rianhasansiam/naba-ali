'use client';

import { useSession, signIn } from 'next-auth/react';
import { useGetData } from '@/lib/hooks/useGetData';
import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import ProfilePageClient from './ProfilePageClient';
import LoadingSpinner from '@/app/componets/loading/LoadingSpinner';
import { normalizeProfileData } from '@/lib/utils/profileDataNormalizer';

export default function ProfilePageWrapper() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 🚀 OPTIMIZED: Use standardized query keys for data deduplication
  const { data: orders = [], isLoading: ordersLoading } = useGetData({ 
    name: 'orders', // Standardized query key 
    api: '/api/orders',
    cacheType: 'USER_SPECIFIC'
  });
  
  const { data: user, isLoading: userLoading, refetch: refetchUser } = useGetData({ 
    name: session?.user?.id ? `user-${session.user.id}` : 'no-user', 
    api: session?.user?.id ? `/api/users/${session.user.id}` : null,
    cacheType: 'USER_SPECIFIC',
    enabled: !!session?.user?.id
  });

  // Debug: Log the user ID being used for fetching
  console.log('=== USER FETCHING DEBUG ===');
  console.log('session?.user?.id:', session?.user?.id);
  console.log('Fetch API URL:', session?.user?.id ? `/api/users/${session.user.id}` : null);
  console.log('Query name:', session?.user?.id ? `user-${session.user.id}` : 'no-user');
  console.log('===========================');

  const { data: products = [], isLoading: productsLoading } = useGetData({ 
    name: 'products', // Standardized query key
    api: '/api/products',
    cacheType: 'STATIC'
  });

  // Process profile data with real API data - must be called before conditional returns
  const profileData = useMemo(() => {
    if (!session) return null;

    // Get user data - PREFER API data over session data for most up-to-date info
    const rawUserData = user?.user ? {
      ...session.user, // Start with session data as base
      ...user.user, // Override with API data (most up-to-date)
      id: user.user._id || user.user.id || session.user.id // Ensure ID is set
    } : session.user;
    
    // Debug: Log data sources to understand the issue
    console.log('=== USER DATA SOURCES DEBUG ===');
    console.log('user from API (user?.user):', user?.user);
    console.log('session.user:', session.user);
    console.log('rawUserData (final merged):', rawUserData);
    console.log('rawUserData.phone:', rawUserData.phone);
    console.log('================================');
    
    // Filter orders for current user - try multiple matching strategies
    const userOrders = orders.filter(order => {
      // Debug: Log each order to understand structure
      if (orders.length > 0 && orders.indexOf(order) === 0) {
        console.log('Sample Order Structure:', order);
      }
      
      const userId = rawUserData._id || rawUserData.id || session.user.id;
      const userEmail = rawUserData.email || session.user.email;
      
      return (
        order.userId === userId || 
        order.userEmail === userEmail ||
        order.customerInfo?.email === userEmail ||
        order.user?.email === userEmail ||
        order.email === userEmail
      );
    });
    
    // Debug: Log data to understand what's happening
    console.log('All Orders:', orders);
    console.log('Raw User Data:', rawUserData);
    console.log('Filtered User Orders:', userOrders);
    console.log('Orders Loading:', ordersLoading);
    
    // Create products map for order details only if we have orders
    const productsMap = userOrders.length > 0 ? products.reduce((map, product) => {
      if (product && product._id) {
        map[product._id] = product;
      }
      return map;
    }, {}) : {};

    // Process orders with enhanced product details
    const processedOrders = userOrders.map(order => {
      console.log('Processing order:', order); // Debug log
      const orderItems = (order.items || []).map(item => {
        const product = productsMap[item.productId] || {};
        return {
          id: item.productId,
          name: product.name || item.name || 'Product',
          image: product.images?.[0] || item.image || "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          price: item.price || product.price || 0,
          quantity: item.quantity || 1,
          category: product.category || 'Uncategorized'
        };
      });

      // Calculate total from items if order.total is not available
      const calculatedTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        id: order._id,
        date: order.createdAt || order.date,
        status: order.status || 'pending',
        total: order.total || calculatedTotal || 0,
        items: orderItems,
        items_detail: orderItems, // Add this for compatibility with ProfilePageClient
        itemCount: orderItems.length,
        trackingNumber: order.trackingNumber || `NA${order._id?.slice(-8)}`,
        shippingAddress: order.shippingAddress
      };
    });

    // Return basic profile structure - normalization will happen in ProfilePageClient
    return {
      user: rawUserData,
      orders: processedOrders,
      addresses: [] // Addresses functionality will be handled separately
    };
  }, [session, user, orders, products, ordersLoading]);

  // Enhanced update handler that invalidates cache properly
  const handleUpdateProfile = useCallback(async () => {
    try {
      console.log('=== PROFILE UPDATE STARTING ===');
      
      // Force refetch user data
      const refetchResult = await refetchUser();
      console.log('Refetch User Result:', refetchResult);
      
      // Also invalidate all related queries to ensure fresh data
      await queryClient.invalidateQueries({ 
        queryKey: [`user-${session?.user?.id}`] 
      });
      
      // Invalidate session data if needed
      await queryClient.invalidateQueries({ 
        queryKey: ['user-profile'] 
      });
      
      // Give a small delay to ensure data is refreshed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('=== PROFILE UPDATE COMPLETE ===');
    } catch (error) {
      console.error('Error refreshing profile data:', error);
    }
  }, [refetchUser, queryClient, session?.user?.id]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      signIn(); // Redirect to login
      return;
    }
  }, [session, status]);

  // Show loading while checking authentication or fetching data
  if (status === 'loading' || !session || ordersLoading || userLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <ProfilePageClient profileData={profileData} onUpdateProfile={handleUpdateProfile} />
    </main>
  );
}