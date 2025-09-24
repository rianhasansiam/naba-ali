'use client';

import { useSession } from 'next-auth/react';
import { useGetData } from '@/lib/hooks/useGetData';
import { useMemo } from 'react';
import ProfilePageClient from './ProfilePageClient';

export default function ProfilePage() {
  const { data: session } = useSession();
  
  // ✅ Optimized: User-specific data with minimal cache
  const { data: orders = [] } = useGetData({ 
    name: 'orders', 
    api: '/api/orders',
    cacheType: 'USER_SPECIFIC' // Orders change frequently and are user-specific
  });
  
  // Only fetch user data if we have a session with user ID
  const { data: user } = useGetData({ 
    name: session?.user?.id ? `user-${session.user.id}` : 'no-user', 
    api: session?.user?.id ? `/api/users/${session.user.id}` : null,
    cacheType: 'USER_SPECIFIC', // User data is personal and should be fresh
    enabled: !!session?.user?.id // Only fetch when user ID is available
  });

  // Process profile data with real API data
  const profileData = useMemo(() => {
    // Return basic structure if no session
    if (!session) {
      return {
        user: null,
        navigation: [
          { id: "overview", label: "Overview", iconName: "User" },
          { id: "orders", label: "Order History", iconName: "Package" },
          { id: "addresses", label: "Addresses", iconName: "MapPin" },
          { id: "payments", label: "Payment Methods", iconName: "CreditCard" },
          { id: "settings", label: "Account Settings", iconName: "Settings" },
          { id: "notifications", label: "Notifications", iconName: "Bell" }
        ],
        orders: [],
        addresses: [],
        paymentMethods: [],
        preferences: {},
        profileStats: []
      };
    }

    // Filter orders for current user
    const userOrders = orders.filter(order => 
      order.userId === session.user.id || 
      order.userEmail === session.user.email
    );
    
    // Calculate user stats from real data
    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const memberSince = user?.createdAt 
      ? new Date(user.createdAt).toLocaleDateString() 
      : new Date().toLocaleDateString();

    // Build user profile from real session and database data
    const userProfile = {
      id: user?._id || session.user.id,
      firstName: user?.name?.split(' ')[0] || session.user.name?.split(' ')[0] || 'User',
      lastName: user?.name?.split(' ').slice(1).join(' ') || session.user.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || session.user.email,
      phone: user?.phone || '', // Phone might not be in your current schema
      avatar: user?.image || session.user.image || "https://images.unsplash.com/photo-1494790108755-2616b169ad4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      memberSince,
      totalOrders,
      totalSpent,
      loyaltyPoints: Math.floor(totalSpent / 10),
      membershipTier: totalSpent >= 1000 ? "Gold" : totalSpent >= 500 ? "Silver" : "Bronze",
      role: user?.role || 'user',
      subscribeNewsletter: user?.subscribeNewsletter !== false
    };

    // Process real orders data
    const processedOrders = userOrders.map(order => ({
      id: order._id,
      date: new Date(order.createdAt || order.date).toLocaleDateString(),
      status: order.status || 'pending',
      total: order.total || 0,
      items: order.items?.length || 0,
      trackingNumber: order.trackingNumber || `NA${order._id?.slice(-8) || Math.random().toString(36).slice(-8)}`,
      items_detail: order.items?.map(item => ({
        name: item.name || item.title || 'Product',
        image: item.image || item.images?.[0] || "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        price: item.price || 0,
        quantity: item.quantity || 1
      })) || []
    }));

    return {
      user: userProfile,
      navigation: [
        { id: "overview", label: "Overview", iconName: "User" },
        { id: "orders", label: "Order History", iconName: "Package" },
        { id: "addresses", label: "Addresses", iconName: "MapPin" },
        { id: "payments", label: "Payment Methods", iconName: "CreditCard" },
        { id: "settings", label: "Account Settings", iconName: "Settings" },
        { id: "notifications", label: "Notifications", iconName: "Bell" }
      ],
      orders: processedOrders,
      addresses: [
        {
          id: "addr_001",
          type: "home",
          name: "Primary Address",
          address: user?.address || "Address not provided",
          city: user?.city || "",
          state: user?.state || "",
          zipCode: user?.zipCode || "",
          country: user?.country || "Not specified",
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
        newsletter: user?.subscribeNewsletter !== false,
        sms: user?.smsNotifications !== false,
        orderUpdates: true,
        promotions: user?.promotions !== false,
        role: user?.role || 'user'
      },
      profileStats: [
        { label: "Total Orders", value: totalOrders.toString(), iconName: "Package" },
        { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, iconName: "DollarSign" },
        { label: "Loyalty Points", value: Math.floor(totalSpent / 10).toString(), iconName: "Star" },
        { label: "Member Since", value: memberSince, iconName: "Calendar" }
      ]
    };
  }, [session, user, orders]);

  return (
    <main className="min-h-screen bg-gray-50">
      <ProfilePageClient profileData={profileData} />
    </main>
  );
}