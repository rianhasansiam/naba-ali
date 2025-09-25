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

  // Data fetching hooks - must be called before any conditional returns
  const { data: orders = [], isLoading: ordersLoading } = useGetData({ 
    name: 'orders', 
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
    name: 'products', 
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

    // Filter orders for current user
    const userOrders = orders.filter(order => 
      order.userId === userProfile.id || 
      order.userEmail === userProfile.email
    );
    
    // Create products map for order details only if we have orders
    const productsMap = userOrders.length > 0 ? products.reduce((map, product) => {
      if (product && product._id) {
        map[product._id] = product;
      }
      return map;
    }, {}) : {};

    // Process orders with enhanced product details
    const processedOrders = userOrders.map(order => {
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

      return {
        id: order._id,
        date: order.createdAt || order.date,
        status: order.status || 'pending',
        total: order.total || 0,
        items: orderItems,
        items_detail: orderItems, // Add this for compatibility with ProfilePageClient
        itemCount: orderItems.length,
        trackingNumber: order.trackingNumber || `NA${order._id?.slice(-8)}`,
        shippingAddress: order.shippingAddress
      };
    });

    // Calculate real statistics
    const totalOrders = processedOrders.length;
    const totalSpent = processedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const memberSince = new Date(userProfile.joinDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });

    return {
      user: userProfile,
      tabs: [
        { id: "overview", label: "Overview", iconName: "User" },
        { id: "orders", label: "My Orders", iconName: "Package" },
        { id: "addresses", label: "Addresses", iconName: "MapPin" },
        { id: "payments", label: "Payment Methods", iconName: "CreditCard" },
        { id: "settings", label: "Settings", iconName: "Settings" }
      ],
      orders: processedOrders,
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
      paymentMethods: [
        {
          id: "card_001",
          type: "credit",
          cardType: "visa",
          lastFour: "4242",
          expiryDate: "12/26",
          isDefault: true,
          name: userProfile.firstName + " " + userProfile.lastName
        }
      ],
      preferences: {
        newsletter: apiUser?.subscribeNewsletter !== false,
        sms: apiUser?.smsNotifications !== false,
        orderUpdates: true,
        promotions: apiUser?.promotions !== false,
        role: userProfile.role
      },
      profileStats: [
        { label: "Total Orders", value: totalOrders.toString(), iconName: "Package" },
        { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, iconName: "DollarSign" },
     
        { label: "Member Since", value: memberSince, iconName: "Calendar" }
      ]
    };
  }, [session, user, orders, products]);  // Redirect to login if not authenticated
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