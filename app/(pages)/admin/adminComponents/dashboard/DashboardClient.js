'use client';

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

// StatCard Component
const StatCard = ({ title, value, change, trend, icon: Icon, color = "gray" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-${color}-100`}>
        <Icon className={`text-${color}-600`} size={24} />
      </div>
      <div className={`flex items-center text-sm font-medium ${
        trend === 'up' ? 'text-green-600' : 'text-red-600'
      }`}>
        {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span className="ml-1">{change}%</span>
      </div>
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">
      {typeof value === 'number' && title.includes('Revenue') ? `$${value.toLocaleString()}` : value}
    </p>
  </motion.div>
);

const DashboardClient = ({ analytics }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-800 to-black rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome to SkyZonee Admin Dashboard</h1>
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
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={analytics.overview.totalOrders.value}
          change={analytics.overview.totalOrders.change}
          trend={analytics.overview.totalOrders.trend}
          icon={ShoppingBag}
          color="gray"
        />
        <StatCard
          title="Total Customers"
          value={analytics.overview.totalCustomers.value}
          change={analytics.overview.totalCustomers.change}
          trend={analytics.overview.totalCustomers.trend}
          icon={Users}
          color="gray"
        />
        <StatCard
          title="Average Order"
          value={`$${analytics.overview.averageOrder.value}`}
          change={analytics.overview.averageOrder.change}
          trend={analytics.overview.averageOrder.trend}
          icon={Star}
          color="gray"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Revenue Overview</h3>
            <BarChart3 className="text-gray-700" size={24} />
          </div>
          <div className="space-y-4">
            {analytics.monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{data.month}</span>
                <div className="flex items-center space-x-4 flex-1 mx-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-t from-gray-700 to-gray-900 rounded-t-lg w-8 min-h-4"
                      style={{ width: `${(data.revenue / 70000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900">${(data.revenue / 1000).toFixed(0)}k</span>
                </div>
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
              <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized={product.image?.startsWith('data:')}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">${product.revenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Revenue</p>
                </div>
              </div>
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
                <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentSales.map((sale, index) => (
                <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{sale.id}</td>
                  <td className="py-3 px-4 text-gray-700">{sale.customer}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">${sale.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                      sale.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      sale.status === 'shipped' ? 'bg-gray-100 text-gray-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{sale.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <button className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white text-left hover:from-green-700 hover:to-green-800 transition-all">
          <Package className="mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Add New Product</h3>
          <p className="text-green-100 mb-4">Expand your inventory</p>
          <button className="bg-white text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
            Add Product
          </button>
        </button>
        
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

export default DashboardClient;