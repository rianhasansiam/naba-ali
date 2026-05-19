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

    // Normalize orders to always be an array — handles null, undefined, or
    // paginated API responses shaped like { data: [...] } or { orders: [...] }
    const safeOrders = Array.isArray(orders)
      ? orders
      : Array.isArray(orders?.data)
      ? orders.data
      : Array.isArray(orders?.orders)
      ? orders.orders
      : [];

    // Enrich orders with user and product data
    const enrichedOrders = safeOrders.map(order => {
      // Extract customer info from multiple possible locations
      const customerInfo = order.customerInfo || order.customer || {};
      
      // Extract financial data from multiple possible locations
      const orderSummary = order.orderSummary || order.summary || {};
      const financials = orderSummary || order;
      
      // Map order items to products format
      const orderProducts = order.items?.map(item => ({
        name: item.productName || 'Unknown Product',
        quantity: item.quantity || 0,
        price: item.price || 0,
        size: item.size,
        color: item.color,
        subtotal: item.subtotal || (item.price * item.quantity)
      })) || [];


      const enrichedOrder = {
        id: order._id || order.id,
        orderId: order.orderId || order.id || `ORD-${order._id?.slice(-8) || 'N/A'}`, // Include the actual order ID
        customer: customerInfo.name || customerInfo.customer || 'Unknown Customer',
        email: customerInfo.email || '',
        phone: customerInfo.phone || customerInfo.contact || '',
        status: order.status || 'confirmed',
        paymentStatus: order.paymentStatus || 'completed',
        total: financials.total || order.total || order.totalAmount || 0,
        subtotal: financials.subtotal || order.subtotal || 0,
        shipping: financials.shipping || order.shipping || 0,
        tax: financials.tax || order.tax || 0,
        items: order.items?.length || 0,
        date: new Date(order.createdAt || order.orderDate || order.date).toLocaleDateString(),
        shippingAddress: customerInfo.address 
          ? `${customerInfo.address.street || customerInfo.address.address || ''}, ${customerInfo.address.city || ''}, ${customerInfo.address.zipCode || customerInfo.address.zip || ''}`.replace(/^,\s*|,\s*$/g, '') 
          : customerInfo.shippingAddress || 'No address provided',
        trackingNumber: order.trackingNumber || order.tracking || (order._id ? `TN${order._id.slice(-9)}` : `TN${Date.now().toString().slice(-9)}`),
        paymentMethod: order.paymentMethod || order.payment || { 
          name: order.paymentMethod?.name || order.payment?.name || order.paymentMethodName || order.paymentType || 'Unknown', 
          type: order.paymentMethod?.type || order.payment?.type || order.paymentMethodType || order.paymentType || 'unknown' 
        },
        products: orderProducts,
        customerInfo: customerInfo // Include full customer info for detailed view
      };
      
      return enrichedOrder;
    });

    // Calculate stats
    const totalOrders = safeOrders.length;
    const pendingOrders = safeOrders.filter(o => o.status === 'pending').length;
    const confirmedOrders = safeOrders.filter(o => o.status === 'confirmed').length;
    const processingOrders = safeOrders.filter(o => o.status === 'processing').length;
    const shippedOrders = safeOrders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = safeOrders.filter(o => o.status === 'delivered').length;
    const totalRevenue = safeOrders.reduce((sum, order) => {
      const orderSummary = order.orderSummary || order.summary || {};
      const financials = orderSummary || order;
      return sum + (financials.total || order.total || 0);
    }, 0);

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