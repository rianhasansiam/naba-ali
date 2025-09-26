'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { 
  Package, Clock, CheckCircle, Truck, XCircle, Eye, Download,
  MoreVertical, Search, Filter, Calendar, DollarSign
} from 'lucide-react';
import Image from 'next/image';

const OrdersSection = ({ normalizedProfile, processedOrders, getStatusIcon, getStatusBadge }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Filter and sort orders for the current user
  const filteredOrders = useMemo(() => {
    const userEmail = normalizedProfile.user.email;
    
    // Filter orders by user email first
    let userOrders = processedOrders.filter(order => {
      return (
        order.userEmail === userEmail ||
        order.customerInfo?.email === userEmail ||
        order.user?.email === userEmail ||
        order.email === userEmail
      );
    });

    // Apply search filter
    if (searchTerm) {
      userOrders = userOrders.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item => 
          item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      userOrders = userOrders.filter(order => order.status === statusFilter);
    }

    // Apply sorting
    userOrders.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
        case 'date-asc':
          return new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt);
        case 'amount-desc':
          return (b.total || 0) - (a.total || 0);
        case 'amount-asc':
          return (a.total || 0) - (b.total || 0);
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        default:
          return 0;
      }
    });

    return userOrders;
  }, [processedOrders, normalizedProfile.user.email, searchTerm, statusFilter, sortBy]);

  // Get unique statuses for filter dropdown
  const availableStatuses = useMemo(() => {
    const statuses = [...new Set(processedOrders.map(order => order.status))];
    return statuses.filter(status => status);
  }, [processedOrders]);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Orders Header with Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Orders ({filteredOrders.length})</h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              {availableStatuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t placed any orders yet. Start shopping to see your orders here!'
              }
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderNumber || order.id?.slice(-8) || 'N/A'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {order.orderDate || new Date(order.date || order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${(order.total || 0).toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {order.itemCount || order.items?.length || 0} items
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge && getStatusBadge(order.status)}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download size={18} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details (Expandable) */}
              <AnimatePresence>
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-6">
                      {/* Order Items */}
                      <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                      <div className="space-y-3 mb-6">
                        {(order.items_detail || order.items || []).map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {item.image && (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-900 truncate">{item.name}</h5>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity || 1}
                              </p>
                              {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                              {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">${(item.price || 0).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Order Status</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon && getStatusIcon(order.status)}
                              <span className="text-gray-900">{order.status_detail || 'Status updated'}</span>
                            </div>
                            {order.trackingNumber && (
                              <p className="text-sm text-gray-600">
                                Tracking: <span className="font-mono">{order.trackingNumber}</span>
                              </p>
                            )}
                            {order.estimatedDelivery && (
                              <p className="text-sm text-gray-600">
                                Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                          <p className="text-gray-600 text-sm">
                            {order.shippingAddress || 'Address not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default OrdersSection;