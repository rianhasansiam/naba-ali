'use client';

import { useMemo } from 'react';
import OrderDetailsClient from './OrderDetailsClient';

// Server Component - Handles data processing from props
const OrderDetails = ({ orders = [], users = [], products = [], isLoading = false }) => {

  // Process orders data to match expected format - must be called before early returns
  const ordersData = useMemo(() => {
    if (isLoading) {
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
      // Extract customer info from the order itself (not from separate user lookup)
      const customerInfo = order.customerInfo || {};
      
      // Map order items to products format
      const orderProducts = order.items?.map(item => ({
        name: item.productName || 'Unknown Product',
        quantity: item.quantity || 0,
        price: item.price || 0,
        size: item.size,
        color: item.color,
        subtotal: item.subtotal || (item.price * item.quantity)
      })) || [];

      return {
        id: order._id,
        orderId: order.orderId, // Include the actual order ID
        customer: customerInfo.name || 'Unknown Customer',
        email: customerInfo.email || '',
        phone: customerInfo.phone || '',
        status: order.status || 'confirmed',
        paymentStatus: order.paymentStatus || 'completed',
        total: order.orderSummary?.total || 0,
        subtotal: order.orderSummary?.subtotal || 0,
        shipping: order.orderSummary?.shipping || 0,
        tax: order.orderSummary?.tax || 0,
        items: order.items?.length || 0,
        date: new Date(order.createdAt || order.orderDate).toLocaleDateString(),
        shippingAddress: customerInfo.address 
          ? `${customerInfo.address.street || ''}, ${customerInfo.address.city || ''}, ${customerInfo.address.zipCode || ''}`.replace(/^,\s*|,\s*$/g, '') 
          : 'No address provided',
        trackingNumber: order.trackingNumber || `TN${order._id?.slice(-9) || 'N/A'}`,
        paymentMethod: order.paymentMethod || { name: 'Unknown', type: 'unknown' },
        products: orderProducts,
        customerInfo: customerInfo // Include full customer info for detailed view
      };
    });

    // Calculate stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.orderSummary?.total || 0), 0);

    return {
      orders: enrichedOrders,
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue
      }
    };
  }, [orders, isLoading]);

  // Show loading spinner at page level
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Pass data to client component
  return <OrderDetailsClient ordersData={ordersData} />;
};

export default OrderDetails;