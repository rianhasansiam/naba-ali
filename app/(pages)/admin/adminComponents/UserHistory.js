'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  ShoppingBag,
  User, 
  Mail, 
  Phone, 
  MapPin,
  Eye,
  Download,
  Star,
  Package,
  Clock,
  TrendingUp,
  Users,
  Heart,
  CreditCard
} from 'lucide-react';

const UserHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');

  // Demo customer data with purchase history
  const [customers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Fashion St, New York, NY 10001',
      joinDate: '2024-01-15',
      totalOrders: 8,
      totalSpent: 1245.60,
      averageOrder: 155.70,
      lastOrder: '2025-09-15',
      status: 'vip',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=100&h=100&fit=crop',
      orders: [
        {
          id: '#3210',
          date: '2025-09-15',
          items: [
            { name: 'Premium Cotton T-Shirt', quantity: 2, price: 49.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=50&h=50&fit=crop' },
            { name: 'Designer Jeans', quantity: 1, price: 129.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=50&h=50&fit=crop' }
          ],
          total: 229.97,
          status: 'delivered'
        },
        {
          id: '#3145',
          date: '2025-08-28',
          items: [
            { name: 'Summer Dress', quantity: 1, price: 79.99, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=50&h=50&fit=crop' }
          ],
          total: 79.99,
          status: 'delivered'
        }
      ],
      wishlist: ['Leather Jacket', 'Casual Sneakers', 'Formal Shirt'],
      preferences: {
        categories: ['T-Shirts', 'Jeans', 'Dresses'],
        priceRange: '$50-150',
        size: 'M',
        notifications: true
      }
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      address: '456 Style Ave, Los Angeles, CA 90210',
      joinDate: '2024-03-22',
      totalOrders: 12,
      totalSpent: 2156.40,
      averageOrder: 179.70,
      lastOrder: '2025-09-12',
      status: 'premium',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      orders: [
        {
          id: '#3198',
          date: '2025-09-12',
          items: [
            { name: 'Leather Jacket', quantity: 1, price: 249.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=50&h=50&fit=crop' },
            { name: 'Casual Sneakers', quantity: 1, price: 99.99, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=50&h=50&fit=crop' }
          ],
          total: 349.98,
          status: 'shipped'
        }
      ],
      wishlist: ['Premium Cotton T-Shirt', 'Formal Shirt'],
      preferences: {
        categories: ['Jackets', 'Shoes', 'Shirts'],
        priceRange: '$100-300',
        size: 'L',
        notifications: false
      }
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 345-6789',
      address: '789 Trend Blvd, Miami, FL 33101',
      joinDate: '2024-05-10',
      totalOrders: 6,
      totalSpent: 789.45,
      averageOrder: 131.58,
      lastOrder: '2025-09-08',
      status: 'regular',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      orders: [
        {
          id: '#3167',
          date: '2025-09-08',
          items: [
            { name: 'Formal Shirt', quantity: 2, price: 69.99, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=50&h=50&fit=crop' }
          ],
          total: 139.98,
          status: 'processing'
        }
      ],
      wishlist: ['Designer Jeans', 'Summer Dress'],
      preferences: {
        categories: ['Shirts', 'Dresses', 'T-Shirts'],
        priceRange: '$30-100',
        size: 'S',
        notifications: true
      }
    }
  ]);

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const CustomerCard = ({ customer }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
    >
      <div className="flex items-start space-x-4">
        <Image
          src={customer.avatar}
          alt={customer.name}
          width={60}
          height={60}
          className="w-15 h-15 rounded-full object-cover"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              customer.status === 'vip' ? 'bg-gray-200 text-gray-800' :
              customer.status === 'premium' ? 'bg-gray-100 text-gray-700' :
              'bg-gray-100 text-gray-800'
            }`}>
              {customer.status.toUpperCase()}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Mail size={14} className="mr-2" />
                <span className="text-sm">{customer.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone size={14} className="mr-2" />
                <span className="text-sm">{customer.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={14} className="mr-2" />
                <span className="text-sm">{customer.address}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Calendar size={14} className="mr-2" />
                <span className="text-sm">Joined: {customer.joinDate}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={14} className="mr-2" />
                <span className="text-sm">Last order: {customer.lastOrder}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-100 rounded-xl">
              <ShoppingBag className="text-gray-700 mx-auto mb-1" size={20} />
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-lg font-bold text-gray-800">{customer.totalOrders}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <DollarSign className="text-green-600 mx-auto mb-1" size={20} />
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-lg font-bold text-green-600">${customer.totalSpent.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 bg-gray-100 rounded-xl">
              <TrendingUp className="text-gray-700 mx-auto mb-1" size={20} />
              <p className="text-sm text-gray-600">Avg Order</p>
              <p className="text-lg font-bold text-gray-800">${customer.averageOrder}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Heart size={14} className="text-red-500" />
                <span className="text-sm text-gray-600">{customer.wishlist.length} wishlist items</span>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedUser(customer)}
              className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
            >
              <Eye size={16} />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const UserDetailModal = ({ user, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src={user.avatar}
                alt={user.name}
                width={60}
                height={60}
                className="w-15 h-15 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Order History */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order History</h3>
            <div className="space-y-4">
              {user.orders.map((order, index) => (
                <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Order {order.id}</h4>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${order.total}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Wishlist */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Wishlist</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user.wishlist.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                  <Heart className="text-red-500 mx-auto mb-2" size={20} />
                  <p className="font-medium text-gray-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Preferences */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Preferred Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {user.preferences.categories.map((category, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Price Range</h4>
                  <p className="text-gray-600">{user.preferences.priceRange}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Size</h4>
                  <p className="text-gray-600">{user.preferences.size}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Notifications</h4>
                  <p className={user.preferences.notifications ? 'text-green-600' : 'text-red-600'}>
                    {user.preferences.notifications ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const stats = {
    totalCustomers: customers.length,
    vipCustomers: customers.filter(c => c.status === 'vip').length,
    premiumCustomers: customers.filter(c => c.status === 'premium').length,
    averageSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    averageOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer History</h1>
          <p className="text-gray-600">View customer purchase history and analytics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Download size={16} />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Users className="text-blue-600" size={20} />
            <span className="text-sm text-gray-600">Total Customers</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCustomers}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Star className="text-purple-600" size={20} />
            <span className="text-sm text-gray-600">VIP</span>
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-1">{stats.vipCustomers}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <CreditCard className="text-blue-600" size={20} />
            <span className="text-sm text-gray-600">Premium</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.premiumCustomers}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <DollarSign className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Avg Spent</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">${stats.averageSpent.toFixed(0)}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-indigo-600" size={20} />
            <span className="text-sm text-gray-600">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-indigo-600 mt-1">${stats.totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="text-orange-600" size={20} />
            <span className="text-sm text-gray-600">Avg Orders</span>
          </div>
          <p className="text-2xl font-bold text-orange-600 mt-1">{stats.averageOrders.toFixed(1)}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full lg:w-64"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="vip">VIP</option>
              <option value="premium">Premium</option>
              <option value="regular">Regular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="space-y-6">
        {filteredCustomers.map(customer => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>

      {/* No Results */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default UserHistory;
