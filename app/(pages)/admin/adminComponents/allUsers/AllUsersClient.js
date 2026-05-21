'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import defaultAvatar from '../../../../../public/logo.png';
import { 
  Search, 
  Trash2, 
  Users, 
  Mail, 
  Calendar,
  ShoppingBag,
  Crown,
  Star,
  Eye,
  X,
  Package,
  Clock,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useDeleteData } from '@/lib/hooks/useDeleteData';

const normalizeText = (value) => (value || '').toString().trim().toLowerCase();
const getUserId = (user) => user?._id || user?.id;
const FALLBACK_AVATAR_SRC = defaultAvatar?.src || '/logo.png';

const resolveAvatarSrc = (image) => {
  if (typeof image === 'string' && image.trim()) return image;
  if (image && typeof image === 'object' && typeof image.src === 'string') return image.src;
  return FALLBACK_AVATAR_SRC;
};

const extractUsersList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (payload?.user) return [payload.user];

  const hasUserFields = payload && (payload.email || payload.name || payload._id || payload.id);
  return hasUserFields ? [payload] : [];
};

const extractOrdersList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.orders)) return payload.orders;
  return [];
};

const orderBelongsToUser = (order, user) => {
  if (!order || !user) return false;

  const orderEmail = normalizeText(
    order.userEmail ||
    order.customerInfo?.email ||
    order.customer?.email ||
    order.email
  );
  const orderUserId = order.userId || order.customerInfo?.userId || order.customer?.userId || order.user?.id;
  const orderName = normalizeText(
    order.userName ||
    order.customerInfo?.name ||
    order.customer?.name ||
    order.user?.name
  );

  const userEmail = normalizeText(user.email);
  const userId = getUserId(user);
  const normalizedOrderUserId = orderUserId?.toString?.() || '';
  const normalizedUserId = userId?.toString?.() || '';
  const userName = normalizeText(user.name);

  if (orderEmail && userEmail && orderEmail === userEmail) return true;
  if (normalizedOrderUserId && normalizedUserId && normalizedOrderUserId === normalizedUserId) return true;
  if (!orderEmail && orderName && userName && orderName === userName) return true;

  return false;
};

const formatDate = (value) => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'N/A' : parsed.toLocaleDateString();
};

const AllUsersClient = ({ users: userData = [], orders: ordersDataProp = [], isLoading: isLoadingProp = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userView, setUserView] = useState('authentic');
  const [allUsers, setAllUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  const { deleteData, isLoading: isDeleting } = useDeleteData({ name: 'users', api: '/api/users' });

  useEffect(() => {
    setAllUsers(extractUsersList(userData));
  }, [userData]);

  const allOrders = useMemo(() => extractOrdersList(ordersDataProp), [ordersDataProp]);

  const orderedUsers = useMemo(() => {
    if (!allUsers.length || !allOrders.length) return [];
    return allUsers.filter((user) => allOrders.some((order) => orderBelongsToUser(order, user)));
  }, [allUsers, allOrders]);

  const usersByView = userView === 'ordered' ? orderedUsers : allUsers;

  // Search filter — guard against null/undefined name or email
  const filteredUsers = usersByView.filter((user) =>
    normalizeText(user?.name).includes(normalizeText(searchTerm)) ||
    normalizeText(user?.email).includes(normalizeText(searchTerm))
  );

  const getUserStatusIcon = (status) => {
    switch ((status || 'regular').toLowerCase()) {
      case 'vip':
        return <Crown className="text-gray-600" size={16} />;
      case 'premium':
        return <Star className="text-gray-600" size={16} />;
      default:
        return <Users className="text-gray-600" size={16} />;
    }
  };

  const getUserStatusColor = (status) => {
    switch ((status || 'regular').toLowerCase()) {
      case 'vip':
        return 'bg-yellow-100 text-yellow-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handler functions
  const handleViewOrders = (user) => {
    // Check if orders data is still loading
    if (isLoadingProp) {
      return;
    }

    setSelectedUser(user);
    const userOrderHistory = allOrders.filter((order) => orderBelongsToUser(order, user));
    setUserOrders(userOrderHistory);
    setShowOrderModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    if (selectedUser) {
      // Get the correct user ID (handle both _id and id fields)
      const userId = getUserId(selectedUser);
      if (!userId) {
        console.error('User ID not found:', selectedUser);
        setToast({
          show: true,
          type: 'error',
          message: 'User ID not found. Cannot delete user.'
        });
        return;
      }

      setDeletingUserId(userId);
      try {
        await deleteData(userId);
        setShowDeleteModal(false);
        setSelectedUser(null);
        setToast({
          show: true,
          type: 'success',
          message: `User "${selectedUser.name}" deleted successfully!`
        });
        // Update local state - filter by the same ID field that was used
        setAllUsers((prev) => prev.filter((user) => getUserId(user) !== userId));
      } catch (error) {
        console.error('Delete failed:', error);
        setToast({
          show: true,
          type: 'error',
          message: 'Failed to delete user. Please try again.'
        });
      } finally {
        setDeletingUserId(null);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage authentic users and users who placed orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Authentic Users</p>
          <p className="text-2xl font-bold text-gray-900">{allUsers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Order Users</p>
          <p className="text-2xl font-bold text-gray-900">{orderedUsers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Orders Loaded</p>
          <p className="text-2xl font-bold text-gray-900">{allOrders.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent w-full lg:w-72"
          />
        </div>
        <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            type="button"
            onClick={() => setUserView('authentic')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              userView === 'authentic' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Authentic Users ({allUsers.length})
          </button>
          <button
            type="button"
            onClick={() => setUserView('ordered')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              userView === 'ordered' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Order Users ({orderedUsers.length})
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={getUserId(user) || `user-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={resolveAvatarSrc(user?.image)}
                  alt={user?.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  unoptimized={true}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.dataset.fallbackApplied === 'true') return;
                    img.dataset.fallbackApplied = 'true';
                    img.src = FALLBACK_AVATAR_SRC;
                  }}
                />
              </div>
              
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <div className="flex items-center space-x-1">
                      {getUserStatusIcon(user.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserStatusColor(user.status)}`}>
                        {(user.role || 'User').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={14} className="mr-2" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>
                
               
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewOrders(user)}
                    disabled={isLoadingProp}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingProp ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                    <span>Orders</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user)}
                    disabled={deletingUserId === getUserId(user)}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {deletingUserId === getUserId(user) ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Trash2 size={14} />
                    )}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {userView === 'ordered' ? 'No order users found' : 'No authentic users found'}
          </h3>
          <p className="text-gray-600">
            {userView === 'ordered'
              ? 'No users with orders matched your current search.'
              : 'Try adjusting your search criteria.'}
          </p>
        </div>
      )}

      {/* Order History Modal */}
      <AnimatePresence>
        {showOrderModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-700 to-black p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Order History</h2>
                      <p className="text-gray-200">{selectedUser?.name}&apos;s previous orders</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Orders Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {userOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
                    <p className="text-gray-600">This user hasn&apos;t placed any orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order, index) => (
                      <motion.div
                        key={order._id || order.id || `order-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-700 rounded-lg text-white">
                              <Package size={16} />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Order #{order.orderId || order._id?.toString?.().slice(-8) || order.id?.toString?.().slice(-8) || 'Unknown'}</h4>
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock size={12} className="mr-1" />
                                {formatDate(order.orderDate || order.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              ${order.summary?.total || order.orderSummary?.total || order.total || order.totalAmount || order.totalPrice || 0}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {(order.status || 'pending').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Order Items */}
                        {order.items && order.items.length > 0 && (
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Items ({order.items.length})</p>
                            <div className="space-y-2">
                              {order.items.slice(0, 3).map((item, itemIndex) => (
                                <div key={`item-${itemIndex}-${item.productId || item.id || item.name}`} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">{item.name || item.productName}</span>
                                  <span className="text-gray-900">
                                    {item.quantity}x ৳{item.price}
                                  </span>
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <p className="text-sm text-gray-500 italic">
                                  +{order.items.length - 3} more items
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Delete User</h2>
                      <p className="text-red-100">This action cannot be undone</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseDeleteModal}
                    disabled={isDeleting}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Trash2 className="text-red-600" size={32} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Delete User &quot;{selectedUser?.name}&quot;?
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Are you sure you want to delete this user? This will permanently remove 
                    the user account and all associated data. Their order history will be preserved 
                    but disconnected from the user profile.
                  </p>
                </div>

                {/* Warning Box */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="text-red-800 text-sm font-medium mb-1">
                        Warning: This action is irreversible
                      </p>
                      <ul className="text-red-700 text-xs space-y-1">
                        <li>• The user account will be permanently deleted</li>
                        <li>• User profile data will be lost</li>
                        <li>• Login access will be revoked</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseDeleteModal}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        <span>Delete User</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.95 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            } text-white rounded-xl shadow-2xl p-4 min-w-[300px] max-w-md`}>
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{toast.message}</p>
                <button
                  onClick={() => setToast({ ...toast, show: false })}
                  className="ml-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllUsersClient;
