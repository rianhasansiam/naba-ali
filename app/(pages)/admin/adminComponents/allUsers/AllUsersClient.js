'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  ShoppingBag,
  DollarSign,
  Crown,
  Star,
  Eye,
  Filter
} from 'lucide-react';

const AllUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Demo users data
  const [users] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2024-01-15',
      lastLogin: '2025-09-18',
      status: 'vip',
      totalOrders: 8,
      totalSpent: 1245.60,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      joinDate: '2024-03-22',
      lastLogin: '2025-09-17',
      status: 'premium',
      totalOrders: 12,
      totalSpent: 2156.40,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 345-6789',
      joinDate: '2024-05-10',
      lastLogin: '2025-09-16',
      status: 'regular',
      totalOrders: 6,
      totalSpent: 789.45,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 456-7890',
      joinDate: '2024-07-08',
      lastLogin: '2025-09-10',
      status: 'regular',
      totalOrders: 3,
      totalSpent: 345.20,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      id: 5,
      name: 'Lisa Brown',
      email: 'lisa.brown@email.com',
      phone: '+1 (555) 567-8901',
      joinDate: '2024-02-28',
      lastLogin: '2025-09-15',
      status: 'premium',
      totalOrders: 9,
      totalSpent: 1567.80,
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getUserStatusIcon = (status) => {
    switch (status) {
      case 'vip':
        return <Crown className="text-gray-600" size={16} />;
      case 'premium':
        return <Star className="text-gray-600" size={16} />;
      default:
        return <Users className="text-gray-600" size={16} />;
    }
  };

  const getUserStatusColor = (status) => {
    switch (status) {
      case 'vip':
        return 'bg-gray-100 text-gray-800';
      case 'premium':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: users.length,
    vip: users.filter(u => u.status === 'vip').length,
    premium: users.filter(u => u.status === 'premium').length,
    regular: users.filter(u => u.status === 'regular').length,
    totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
    averageSpent: users.reduce((sum, u) => sum + u.totalSpent, 0) / users.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage your customer base and relationships</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            <Plus size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Users className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Total Users</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Crown className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">VIP</span>
          </div>
          <p className="text-2xl font-bold text-gray-600 mt-1">{stats.vip}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Star className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Premium</span>
          </div>
          <p className="text-2xl font-bold text-gray-600 mt-1">{stats.premium}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Users className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Regular</span>
          </div>
          <p className="text-2xl font-bold text-gray-600 mt-1">{stats.regular}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <DollarSign className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">${stats.totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <DollarSign className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Avg Spent</span>
          </div>
          <p className="text-2xl font-bold text-gray-600 mt-1">${stats.averageSpent.toFixed(0)}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent w-full lg:w-64"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="vip">VIP</option>
            <option value="premium">Premium</option>
            <option value="regular">Regular</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <div className="flex items-center space-x-1">
                      {getUserStatusIcon(user.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserStatusColor(user.status)}`}>
                        {user.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={14} className="mr-2" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone size={14} className="mr-2" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    <span>{user.joinDate}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Last login: {user.lastLogin}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Orders & Spending</p>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <ShoppingBag size={14} className="mr-2 text-gray-600" />
                      <span className="font-medium text-gray-600">{user.totalOrders} orders</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <DollarSign size={14} className="mr-2 text-green-600" />
                      <span className="font-medium text-green-600">${user.totalSpent.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    <Eye size={14} />
                    <span>View</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
