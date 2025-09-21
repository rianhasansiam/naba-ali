'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar,
  DollarSign,
  Package,
  Clock,
  Mail,
  MapPin,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const OrderDetails = ({ ordersData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Add null check for ordersData
  if (!ordersData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading order data...</p>
      </div>
    );
  }

  const { orders = [], stats: serverStats = {} } = ordersData;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) || '';
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-gray-100 text-gray-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const {
    totalOrders = 0,
    pendingOrders = 0,
    processingOrders = 0,
    shippedOrders = 0,
    deliveredOrders = 0,
  
  } = serverStats || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Package className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Total Orders</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-600 mt-1">{pendingOrders}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Clock className="text-yellow-600" size={20} />
            <span className="text-sm text-gray-600">Processing</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{processingOrders}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Truck className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Shipped</span>
          </div>
          <p className="text-2xl font-bold text-gray-600 mt-1">{shippedOrders}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Delivered</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">{deliveredOrders}</p>
        </div>

      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search orders..."
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
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {!filteredOrders?.length ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">Order {order.id}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-2" />
                    <span>{order.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Payment & Total</p>
                  <div className="space-y-1">
                    <p className="text-sm">{order.paymentMethod}</p>
                    <p className="text-lg font-bold text-green-600">${order.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Customer Details</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">{order.customer}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={14} className="mr-2" />
                    <span>{order.email}</span>
                  </div>
                </div>
              </div>
              
              {order.items && order.items.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Items ({order.items.length})</p>
                  <div className="space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {order.trackingNumber && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">
                    Tracking Number: {order.trackingNumber}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={14} className="mr-2" />
                  <span>{order.shippingAddress}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <span>View Details</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <span>Update Status</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderDetails;