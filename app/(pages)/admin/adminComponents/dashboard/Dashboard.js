'use client';

import { useMemo } from 'react';
import DashboardClient from './DashboardClient';
import { PLACEHOLDER_IMAGES } from '@/lib/constants';

// Client Component - Handles real data processing from props
const Dashboard = ({ products = [], users = [], orders = [], reviews = [], isLoading }) => {

  // Calculate real analytics from database data
  const analytics = useMemo(() => {
    const allProducts = Array.isArray(products) ? products : [];
    const allUsers = Array.isArray(users) ? users : [];
    const allOrders = Array.isArray(orders) ? orders : [];
    const allReviews = Array.isArray(reviews) ? reviews : [];

    // Calculate total revenue from orders
    const totalRevenue = allOrders.reduce((sum, order) => {
      const orderTotal = order.orderSummary?.total || order.total || 0;
      return sum + parseFloat(orderTotal);
    }, 0);

    // Calculate average order value
    const averageOrder = allOrders.length > 0 ? totalRevenue / allOrders.length : 0;

    // Get recent orders (last 5)
    const recentSales = allOrders
      .sort((a, b) => new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate))
      .slice(0, 5)
      .map(order => ({
        id: order.orderId || order._id?.toString().substring(0, 8) || 'N/A',
        customer: order.customerInfo?.name || order.customer?.name || 'Anonymous',
        amount: parseFloat(order.orderSummary?.total || order.total || 0),
        status: order.status || 'pending',
        date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : 'N/A'
      }));

    // Calculate top products from orders
    const productSales = {};
    allOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const productId = item.productId || item.id;
          const productName = item.productName || item.name || 'Unknown Product';
          const quantity = item.quantity || 0;
          const price = item.price || 0;
          
          if (!productSales[productId]) {
            // Find product using normalized field names (id instead of _id)
            const product = allProducts.find(p => p.id === productId || p._id === productId);
            console.log('Debug - Product lookup for ID:', productId, 'Found product:', product);
            console.log('Debug - Product image fields:', {
              primaryImage: product?.primaryImage,
              image: product?.image,
              images: product?.images
            });
            
            productSales[productId] = {
              name: productName,
              sales: 0,
              revenue: 0,
              image: product?.primaryImage || 
                     product?.image || 
                     product?.images?.[0] ||
                     PLACEHOLDER_IMAGES.PRODUCT_SMALL
            };
          }
          productSales[productId].sales += quantity;
          productSales[productId].revenue += quantity * price;
        });
      }
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Calculate monthly data (simplified - using order creation dates)
    const monthlyData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthOrders = allOrders.filter(order => {
        const orderDate = new Date(order.createdAt || order.orderDate);
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      });
      
      const monthRevenue = monthOrders.reduce((sum, order) => 
        sum + parseFloat(order.orderSummary?.total || order.total || 0), 0);
      
      monthlyData.push({
        month: monthName,
        revenue: monthRevenue,
        orders: monthOrders.length
      });
    }

    return {
      overview: {
        totalRevenue: { 
          value: totalRevenue, 
          change: 0, // Could calculate from previous period if needed
          trend: 'up' 
        },
        totalOrders: { 
          value: allOrders.length, 
          change: 0,
          trend: 'up' 
        },
        totalCustomers: { 
          value: allUsers.length, 
          change: 0,
          trend: 'up' 
        },
        averageOrder: { 
          value: averageOrder, 
          change: 0,
          trend: 'up' 
        }
      },
      recentSales,
      topProducts,
      monthlyData
    };
  }, [products, users, orders, reviews]);

  // Pass real data to client component
  return <DashboardClient analytics={analytics} />;
};

export default Dashboard;