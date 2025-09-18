import DashboardClient from './DashboardClient';

// Server Component - Handles data fetching
const Dashboard = () => {
  // Server-side analytics data (could come from database/API)
  const analytics = {
    overview: {
      totalRevenue: { value: 124500, change: 12.5, trend: 'up' },
      totalOrders: { value: 1250, change: 8.3, trend: 'up' },
      totalCustomers: { value: 845, change: -2.1, trend: 'down' },
      averageOrder: { value: 99.6, change: 15.2, trend: 'up' }
    },
    recentSales: [
      { id: '#3210', customer: 'Sarah Johnson', amount: 156.90, status: 'completed', date: '2025-09-18' },
      { id: '#3209', customer: 'Michael Chen', amount: 89.50, status: 'processing', date: '2025-09-18' },
      { id: '#3208', customer: 'Emily Davis', amount: 234.80, status: 'completed', date: '2025-09-17' },
      { id: '#3207', customer: 'David Wilson', amount: 67.25, status: 'shipped', date: '2025-09-17' },
      { id: '#3206', customer: 'Lisa Brown', amount: 445.60, status: 'completed', date: '2025-09-16' }
    ],
    topProducts: [
      { name: 'Premium Cotton T-Shirt', sales: 145, revenue: 7250, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop' },
      { name: 'Designer Jeans', sales: 98, revenue: 9800, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop' },
      { name: 'Casual Sneakers', sales: 87, revenue: 8700, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop' },
      { name: 'Summer Dress', sales: 76, revenue: 6080, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100&h=100&fit=crop' },
      { name: 'Leather Jacket', sales: 45, revenue: 11250, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop' }
    ],
    monthlyData: [
      { month: 'Jan', revenue: 45000, orders: 450 },
      { month: 'Feb', revenue: 52000, orders: 520 },
      { month: 'Mar', revenue: 48000, orders: 480 },
      { month: 'Apr', revenue: 61000, orders: 610 },
      { month: 'May', revenue: 55000, orders: 550 },
      { month: 'Jun', revenue: 67000, orders: 670 }
    ]
  };

  // Pass data to client component
  return <DashboardClient analytics={analytics} />;
};

export default Dashboard;