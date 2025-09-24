'use client';

import { useMemo } from 'react';
import OrderDetailsClient from './OrderDetailsClient';
import { useGetData } from '@/lib/hooks/useGetData';

// Server Component - Handles data fetching
const OrderDetails = () => {
  // Fetch real data from APIs
  const { data: orders = [], isLoading, error } = useGetData({ 
    name: 'orders', 
    api: '/api/orders' 
  });
  const { data: users = [] } = useGetData({ 
    name: 'users', 
    api: '/api/users' 
  });
  const { data: products = [] } = useGetData({ 
    name: 'products', 
    api: '/api/products' 
  });

  // Process orders data to match expected format
  const ordersData = useMemo(() => {
    if (isLoading || error) {
      return {
        orders: [],
        stats: {
          totalOrders: 0,
          pendingOrders: 0,
          processingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          totalRevenue: 0
        }
      };
    }

    // Enrich orders with user and product data
    const enrichedOrders = orders.map(order => {
      const user = users.find(u => u._id === order.userId);
      const orderProducts = order.items?.map(item => {
        const product = products.find(p => p._id === item.productId);
        return {
          name: product ? product.title : 'Unknown Product',
          quantity: item.quantity,
          price: item.price || (product ? product.price : 0)
        };
      }) || [];

      return {
        id: order._id,
        customer: user ? user.name : 'Unknown Customer',
        email: user ? user.email : '',
        phone: user ? user.phone : '',
        status: order.status || 'pending',
        paymentStatus: order.paymentStatus || 'pending',
        total: order.total || 0,
        items: order.items?.length || 0,
        date: new Date(order.createdAt).toLocaleDateString(),
        shippingAddress: order.shippingAddress || '',
        trackingNumber: order.trackingNumber || `TN${order._id.slice(-9)}`,
        paymentMethod: order.paymentMethod || 'Unknown',
        products: orderProducts
      };
    });

    // Calculate stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    return {
      orders: enrichedOrders,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue
      }
    };
  }, [orders, users, products, isLoading, error]);

  // Pass data to client component
  return <OrderDetailsClient ordersData={ordersData} isLoading={isLoading} error={error} />;
};

export default OrderDetails;