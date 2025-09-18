'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  DollarSign,
  Package,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const OrderDetails = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Demo orders data
  const [orders] = useState([
    {
      id: '#3210',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@email.com',
      customerPhone: '+1 (555) 123-4567',
      shippingAddress: '123 Fashion St, New York, NY 10001',
      orderDate: '2025-09-18 10:30 AM',
      deliveryDate: '2025-09-20',
      status: 'processing',
      total: 229.97,
      items: [
        { name: 'Premium Cotton T-Shirt', quantity: 2, price: 49.99, sku: 'TCT001' },
        { name: 'Designer Jeans', quantity: 1, price: 129.99, sku: 'DJ002' }
      ],
      paymentMethod: 'Credit Card',
      trackingNumber: 'TRK123456789'
    },
    {
      id: '#3209',
      customerName: 'Michael Chen',
      customerEmail: 'michael.chen@email.com',
      customerPhone: '+1 (555) 234-5678',
      shippingAddress: '456 Style Ave, Los Angeles, CA 90210',
      orderDate: '2025-09-17 02:15 PM',
      deliveryDate: '2025-09-19',
      status: 'shipped',
      total: 349.98,
      items: [
        { name: 'Leather Jacket', quantity: 1, price: 249.99, sku: 'LJ003' },
        { name: 'Casual Sneakers', quantity: 1, price: 99.99, sku: 'CS004' }
      ],
      paymentMethod: 'PayPal',
      trackingNumber: 'TRK987654321'
    },
    {
      id: '#3208',
      customerName: 'Emily Davis',
      customerEmail: 'emily.davis@email.com',
      customerPhone: '+1 (555) 345-6789',
      shippingAddress: '789 Trend Blvd, Miami, FL 33101',
      orderDate: '2025-09-16 09:45 AM',
      deliveryDate: '2025-09-18',
      status: 'delivered',
      total: 139.98,
      items: [
        { name: 'Formal Shirt', quantity: 2, price: 69.99, sku: 'FS005' }
      ],
      paymentMethod: 'Credit Card',
      trackingNumber: 'TRK456789123'
    },
    {
      id: '#3207',
      customerName: 'David Wilson',
      customerEmail: 'david.wilson@email.com',
      customerPhone: '+1 (555) 456-7890',
      shippingAddress: '321 Fashion Way, Chicago, IL 60601',
      orderDate: '2025-09-15 04:20 PM',
      deliveryDate: '2025-09-17',
      status: 'cancelled',
      total: 89.99,
      items: [
        { name: 'Summer Dress', quantity: 1, price: 89.99, sku: 'SD006' }
      ],
      paymentMethod: 'Credit Card',
      trackingNumber: null
    }
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className="text-yellow-600" size={16} />;
      case 'shipped':
        return <Truck className="text-gray-600" size={16} />;
      case 'delivered':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'cancelled':
        return <XCircle className="text-red-600" size={16} />;
      default:
        return <AlertCircle className="text-gray-600" size={16} />;
    }
  };

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

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)
  };

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
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Clock className="text-yellow-600" size={20} />
            <span className="text-sm text-gray-600">Processing</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.processing}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Truck className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Shipped</span>
          </div>
          <p className="text-2xl font-bold text-gray-600 mt-1">{stats.shipped}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Delivered</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.delivered}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <XCircle className="text-red-600" size={20} />
            <span className="text-sm text-gray-600">Cancelled</span>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <DollarSign className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">${stats.revenue.toLocaleString()}</p>
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
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{order.id}</h3>
                <p className="text-gray-600">{order.customerName}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Customer Info</p>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Mail size={14} className="mr-2 text-gray-400" />
                    <span>{order.customerEmail}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone size={14} className="mr-2 text-gray-400" />
                    <span>{order.customerPhone}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Details</p>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    <span>{order.orderDate}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Truck size={14} className="mr-2 text-gray-400" />
                    <span>Delivery: {order.deliveryDate}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment & Total</p>
                <div className="space-y-1">
                  <p className="text-sm">{order.paymentMethod}</p>
                  <p className="text-lg font-bold text-green-600">${order.total}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Items ({order.items.length})</p>
              <div className="space-y-2">
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-600">${item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
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
                <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <Eye size={16} />
                  <span>View Details</span>
                </button>
                <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Edit size={16} />
                  <span>Update Status</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
