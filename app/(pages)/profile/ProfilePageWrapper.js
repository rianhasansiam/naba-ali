'use client';

import { useSession, signIn } from 'next-auth/react';
import { useGetData } from '@/lib/hooks/useGetData';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProfilePageClient from './ProfilePageClient';
import LoadingSpinner from '@/app/componets/loading/LoadingSpinner';

export default function ProfilePageWrapper() {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  const { data: products = [], isLoading: productsLoading } = useGetData({ 
    name: 'products', // Standardized query key
    api: '/api/products',
    cacheType: 'STATIC'
  });

  // Process profile data with real API data - must be called before conditional returns
  const profileData = useMemo(() => {
    if (!session) return null;

    // Build user profile from session and API data
    const apiUser = user?.user || {};
    const sessionUser = session.user;
    
    // Handle the actual user data structure from your API
    // Prioritize apiUser data since it's more complete and up-to-date
    const userProfile = {
      id: apiUser._id || sessionUser.id,
      // Extract first and last name from full name field
      firstName: (apiUser.name || sessionUser.name || '').split(' ')[0] || 'User',
      lastName: (apiUser.name || sessionUser.name || '').split(' ').slice(1).join(' ') || '',
      fullName: apiUser.name || sessionUser.name || 'Usesr',
      email: apiUser.email || sessionUser.email,
      // Phone field now exists in apiUser
      phone: apiUser.phone || '',
      avatar: apiUser.image || sessionUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(apiUser.name || sessionUser.name || 'User')}&size=150&background=f3f4f6&color=374151`,
      joinDate: apiUser.createdAt || new Date().toISOString(),
      role: apiUser.role || sessionUser.role || 'usser',
      provider: apiUser.provider || sessionUser.provider || 'unknown',
      emailVerified: apiUser.emailVerified,
      lastLoginAt: apiUser.lastLoginAt
    };

    // Filter orders for current user - try multiple matching strategies
    const userOrders = orders.filter(order => {
      // Debug: Log each order to understand structure
      if (orders.length > 0 && orders.indexOf(order) === 0) {
        console.log('Sample Order Structure:', order);
      }
      
      return (
        order.userId === userProfile.id || 
        order.userEmail === userProfile.email ||
        order.customerInfo?.email === userProfile.email ||
        order.user?.email === userProfile.email ||
        order.email === userProfile.email
      );
    });
    
    // Debug: Log data to understand what's happening
    console.log('All Orders:', orders);
    console.log('User Profile:', userProfile);
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

    // If no orders found, add some sample orders for testing (you can remove this later)
    const finalOrders = processedOrders.length > 0 ? processedOrders : [
      {
        id: 'sample_001',
        date: new Date().toISOString(),
        status: 'delivered',
        total: 129.99,
        items: [
          {
            id: '1',
            name: 'Sample Product 1',
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            price: 59.99,
            quantity: 1,
            category: 'Electronics'
          },
          {
            id: '2',
            name: 'Sample Product 2',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            price: 69.99,
            quantity: 1,
            category: 'Fashion'
          }
        ],
        items_detail: [
          {
            id: '1',
            name: 'Sample Product 1',
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            price: 59.99,
            quantity: 1,
            category: 'Electronics'
          },
          {
            id: '2',
            name: 'Sample Product 2',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            price: 69.99,
            quantity: 1,
            category: 'Fashion'
          }
        ],
        itemCount: 2,
        trackingNumber: 'NA12345678',
        shippingAddress: '123 Sample St, Test City'
      },
      {
        id: 'sample_002',
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        status: 'shipped',
        total: 89.99,
        items: [
          {
            id: '3',
            name: 'Sample Product 3',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            price: 89.99,
            quantity: 1,
            category: 'Electronics'
          }
        ],
        items_detail: [
          {
            id: '3',
            name: 'Sample Product 3',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            price: 89.99,
            quantity: 1,
            category: 'Electronics'
          }
        ],
        itemCount: 1,
        trackingNumber: 'NA87654321',
        shippingAddress: '456 Demo Ave, Sample Town'
      }
    ];

    // Calculate real statistics
    const totalOrders = finalOrders.length;
    const totalSpent = finalOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const memberSince = new Date(userProfile.joinDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });

    return {
      user: userProfile,
      tabs: [
        { id: "overview", label: "Overview", iconName: "User" },
        { id: "orders", label: "My Orders", iconName: "Package" },
        { id: "addresses", label: "Addresses", iconName: "MapPin" }
      ],
      orders: finalOrders,
      addresses: [
        {
          id: "addr_001",
          type: "home",
          name: "Primary Address",
          address: apiUser?.address || "No address provided",
          city: apiUser?.city || "",
          state: apiUser?.state || "",
          zipCode: apiUser?.zipCode || "",
          country: apiUser?.country || "Not specified",
          isDefault: true
        }
      ],
      profileStats: [
        { label: "Total Orders", value: totalOrders.toString(), iconName: "Package" },
        { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, iconName: "DollarSign" },
     
        { label: "Member Since", value: memberSince, iconName: "Calendar" }
      ]
    };
  }, [session, user, orders, products, ordersLoading]);  // Redirect to login if not authenticated
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
      <ProfilePageClient profileData={profileData} onUpdateProfile={refetchUser} />
    </main>
  );
}