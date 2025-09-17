'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Star,
  Package,
  ShoppingCart,
  Eye,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  // Demo analytics data
  const [analytics] = useState({
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
      { month: 'Jun', revenue: 67000, orders: 670 },
      { month: 'Jul', revenue: 72000, orders: 720 },
      { month: 'Aug', revenue: 69000, orders: 690 },
      { month: 'Sep', revenue: 78000, orders: 780 }
    ]
  });

  const StatCard = ({ title, value, change, trend, icon: Icon, prefix = '', suffix = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          <div className={`flex items-center mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="ml-1 text-sm font-medium">
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="ml-1 text-gray-500 text-sm">vs last month</span>
          </div>
        </div>
        <div className={`p-4 rounded-2xl ${trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
          <Icon className={`${trend === 'up' ? 'text-green-600' : 'text-red-600'}`} size={24} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-800 to-black rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome to NABA ALI Admin Dashboard</h1>
        <p className="text-gray-300 text-lg">Here&apos;s what&apos;s happening with your fashion business today.</p>
        <div className="flex items-center mt-4 space-x-4">
          <div className="flex items-center text-gray-300">
            <Calendar className="mr-2" size={18} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Activity className="mr-2" size={18} />
            <span>All systems operational</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={analytics.overview.totalRevenue.value}
          change={analytics.overview.totalRevenue.change}
          trend={analytics.overview.totalRevenue.trend}
          icon={DollarSign}
          prefix="$"
        />
        <StatCard
          title="Total Orders"
          value={analytics.overview.totalOrders.value}
          change={analytics.overview.totalOrders.change}
          trend={analytics.overview.totalOrders.trend}
          icon={ShoppingBag}
        />
        <StatCard
          title="Total Customers"
          value={analytics.overview.totalCustomers.value}
          change={analytics.overview.totalCustomers.change}
          trend={analytics.overview.totalCustomers.trend}
          icon={Users}
        />
        <StatCard
          title="Average Order"
          value={analytics.overview.averageOrder.value}
          change={analytics.overview.averageOrder.change}
          trend={analytics.overview.averageOrder.trend}
          icon={Star}
          prefix="$"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Monthly Revenue</h3>
            <BarChart3 className="text-gray-700" size={24} />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.monthlyData.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.revenue / 80000) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-gradient-to-t from-gray-700 to-gray-900 rounded-t-lg w-8 min-h-4"
                />
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Top Products</h3>
            <Package className="text-gray-700" size={24} />
          </div>
          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${product.revenue.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Sales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Sales</h3>
          <ShoppingCart className="text-gray-700" size={24} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-gray-600 font-medium py-3">Order ID</th>
                <th className="text-left text-gray-600 font-medium py-3">Customer</th>
                <th className="text-left text-gray-600 font-medium py-3">Amount</th>
                <th className="text-left text-gray-600 font-medium py-3">Status</th>
                <th className="text-left text-gray-600 font-medium py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentSales.map((sale, index) => (
                <motion.tr
                  key={sale.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 font-medium text-gray-900">{sale.id}</td>
                  <td className="py-4 text-gray-700">{sale.customer}</td>
                  <td className="py-4 font-bold text-green-600">${sale.amount}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                      sale.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      sale.status === 'shipped' ? 'bg-gray-100 text-gray-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-600">{sale.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <Package className="mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Add New Product</h3>
          <p className="text-green-100 mb-4">Create a new product listing</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
            Add Product
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl p-6 text-white">
          <ShoppingCart className="mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">View Orders</h3>
          <p className="text-gray-300 mb-4">Manage pending orders</p>
          <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            View Orders
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl p-6 text-white">
          <Users className="mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Customer Analytics</h3>
          <p className="text-gray-300 mb-4">View customer insights</p>
          <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            View Analytics
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
