'use client';

import { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetData } from '@/lib/hooks/useGetData';
import { useSession } from 'next-auth/react';
import { 
  User, Package, MapPin, Edit3, Save, X, Plus, DollarSign, Star, Calendar,
  Truck, CheckCircle, Clock, ShoppingBag, Camera,
  Eye, Download, MoreVertical, AlertCircle, Package2, XCircle
} from 'lucide-react';
import Image from 'next/image';

const ProfilePageClient = ({ profileData, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Get session for user authentication
  const { data: session } = useSession();
  
  // Since we already get processed data from ProfilePageWrapper, we don't need to fetch again
  // This improves performance and reduces redundant API calls
  const userOrders = useMemo(() => profileData?.orders || [], [profileData?.orders]);
  
  // Memoize debug logging to prevent re-renders
  useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Profile Data:', profileData);
      console.log('User Orders:', userOrders);
      console.log('Orders Length:', userOrders.length);
      
      // Add detailed logging for each order
      userOrders.forEach((order, index) => {
        console.log(`Order ${index}:`, {
          id: order.id,
          total: order.total,
          calculatedTotal: order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          items: order.items?.map(item => ({ price: item.price, quantity: item.quantity }))
        });
      });
    }
  }, [profileData, userOrders]);
  
  // Refs for form inputs to avoid controlled component re-renders
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const phoneRef = useRef(null);

  // Memoize animation variants to prevent recreation on every render
  const animationVariants = useMemo(() => ({
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.6,
          staggerChildren: 0.1
        }
      }
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
      }
    }
  }), []);

  // Memoize callback functions to prevent re-renders
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setMessage({ text: '', type: '' });
  }, []);

  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing(true);
      // No need to initialize edit data - we'll use input refs
    }
  }, [isEditing, handleCancel]);

  // Helper functions - moved to top to avoid hoisting issues
  const getIcon = useCallback((iconName) => {
    const icons = {
      User, Package, MapPin, 
      DollarSign, Star, Calendar, Truck, CheckCircle, Clock
    };
    return icons[iconName] || User;
  }, []);

  const getStatusBadge = useCallback((status) => {
    const styles = {
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-orange-100 text-orange-800 border-orange-200',
      processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return styles[status] || styles.confirmed;
  }, []);

  const getStatusIcon = useCallback((status) => {
    const icons = {
      confirmed: CheckCircle,
      pending: AlertCircle,
      processing: Clock,
      shipped: Truck,
      delivered: Package2,
      cancelled: X
    };
    return icons[status] || CheckCircle;
  }, []);

  const getStatusDescription = useCallback((status) => {
    const descriptions = {
      confirmed: 'Your order has been confirmed and is being prepared',
      pending: 'Order is pending confirmation',
      processing: 'Your order is being processed',
      shipped: 'Your order is on its way',
      delivered: 'Order has been delivered successfully',
      cancelled: 'This order has been cancelled'
    };
    return descriptions[status] || 'Order status unknown';
  }, []);

  // Memoize processed orders to prevent recalculation on every render
  const processedOrders = useMemo(() => {
    return userOrders.map((order, index) => {
      const StatusIcon = getStatusIcon(order.status);
      const orderDate = new Date(order.date || order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const orderTime = new Date(order.date || order.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Calculate total once here instead of in render
      const displayTotal = order.total || 
        (order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0)) || 
        0;

      return {
        ...order,
        StatusIcon,
        orderDate,
        orderTime,
        displayTotal,
        orderNumber: order.id?.slice(-8) || (index + 1).toString().padStart(8, '0')
      };
    });
  }, [userOrders, getStatusIcon]);

  // Remove all useEffect dependencies that could cause re-renders
  // Edit data is now managed manually and only when needed

  // Safety check for profileData
  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Authentication is handled at the page level, so we can assume user is logged in

   console.log(profileData.user);
  // Handle form submission with current edit data
  const handleSave = async () => {
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    // Get values directly from input refs (no re-render needed)
    const currentEditData = {
      firstName: firstNameRef.current?.value || '',
      lastName: lastNameRef.current?.value || '',
      email: profileData.user.email, // Email is readonly
      phone: phoneRef.current?.value || ''
    };
 
    try {
      // Validate required fields
      if (!currentEditData.firstName.trim()) {
        setMessage({ text: 'First name is required', type: 'error' });
        setSaving(false);
        return;
      }

      // Prepare update data
      const updateData = {
        name: `${currentEditData.firstName} ${currentEditData.lastName}`.trim(),
        phone: currentEditData.phone || null,
      };

      console.log('Saving user data:', updateData);
      
      // Make API call to update user
      const response = await fetch(`/api/users/${profileData.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        setIsEditing(false);
        
        // Refetch user data to update the UI
        if (onUpdateProfile) {
          await onUpdateProfile();
        }
        
        // Clear the success message after a few seconds
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 3000);
      } else {
        setMessage({ text: result.error || 'Failed to update profile', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      setMessage({ text: 'An error occurred while saving. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Overview Section
  const OverviewSection = () => (
    <motion.div
      className="space-y-6"
      variants={animationVariants.container}
      initial="hidden"
      animate="visible"
    >
      {/* User Info Card */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8"
        variants={animationVariants.item}
      >
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
          <button
            onClick={handleEditToggle}
            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={profileData.user.avatar}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <button className="absolute bottom-2 right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-200">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-4">
            {/* Message Display */}
            {message.text && (
              <div className={`p-3 rounded-lg border ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}
            
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    ref={firstNameRef}
                    type="text"
                    defaultValue={profileData.user.firstName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    ref={lastNameRef}
                    type="text"
                    defaultValue={profileData.user.lastName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.user.email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed from this form</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    ref={phoneRef}
                    type="tel"
                    placeholder="Enter your phone number"
                    defaultValue={profileData.user.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2 flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
                      saving 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {profileData.user.firstName} {profileData.user.lastName}
                  </h3>
                  <p className="text-gray-600">{profileData.user.email}</p>
                  {profileData.user.phone && (
                    <p className="text-gray-600">{profileData.user.phone}</p>
                  )}
                  {!profileData.user.phone && (
                    <p className="text-gray-400 italic">Phone not provided</p>
                  )}  
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <Star className="w-4 h-4 mr-1" />
                  {profileData?.user?.role || 'User'}
                </div>
              </div>
            )}
          </div>


        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={animationVariants.container}
      >
        {(profileData.profileStats || []).map((stat, index) => {
          const IconComponent = getIcon(stat.iconName);
          return (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
              variants={animationVariants.item}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );

  // Orders Section - Redesigned with real data
  const OrdersSection = () => (
    <motion.div
      className="space-y-6"
      variants={animationVariants.container}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
          <p className="text-gray-600 mt-1">Track and manage your order history</p>
        </div>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
          {userOrders.length} total orders
        </div>
      </div>

      {/* Empty State */}
      {userOrders.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">You haven&apos;t placed any orders. Start shopping to see your orders here!</p>
          <button className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Start Shopping
          </button>
        </div>
      )}

      {/* Orders List */}
      {processedOrders.length > 0 && (
        <div className="space-y-4">
          {processedOrders.map((order, index) => {

            return (
              <motion.div
                key={order._id || order.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                variants={animationVariants.item}
                whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                {/* Order Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {order.orderDate} at {order.orderTime}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(order.status)}`}>
                        <order.StatusIcon className="w-4 h-4 mr-1" />
                        {(order.status || 'confirmed').charAt(0).toUpperCase() + (order.status || 'confirmed').slice(1)}
                      </span>
                    </div>
                   
                  </div>
                </div>

                {/* Order Status Description */}
                <div className="px-6 py-3 bg-blue-50">
                  <p className="text-sm text-blue-800">
                    <order.StatusIcon className="w-4 h-4 inline mr-2" />
                    {getStatusDescription(order.status)}
                  </p>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.items?.slice(0, 3).map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name || 'Product'}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name || 'Unknown Product'}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>Qty: {item.quantity}</span>
                            <span>${item.price}</span>
                            <span>Category: {item.category || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="text-center py-2">
                        <p className="text-sm text-gray-600">
                          And {order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="font-medium">${order.displayTotal}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Items</p>
                      <p className="font-medium">{order.itemCount || order.items?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tracking</p>
                      <p className="font-medium">{order.trackingNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="px-6 py-4 bg-white border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {order.shippingAddress && (
                        <p>
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Delivery to: {order.shippingAddress}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                     
                      {order.status === 'delivered' && (
                        <button className="flex items-center space-x-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Download Invoice</span>
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button className="flex items-center space-x-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                          <Star className="w-4 h-4" />
                          <span>Leave Review</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );

  // Addresses Section - Enhanced
  const AddressesSection = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const addresses = profileData?.addresses || [];

    return (
      <motion.div
        className="space-y-6"
        variants={animationVariants.container}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
            <p className="text-gray-600 mt-1">Manage your delivery and billing addresses</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Address</span>
          </button>
        </div>

        {/* Add Address Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Label</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Home, Work, Office"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Recipient's full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input 
                    type="text" 
                    placeholder="Enter street address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input 
                    type="text" 
                    placeholder="City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                  <input 
                    type="text" 
                    placeholder="State or Province"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input 
                    type="text" 
                    placeholder="ZIP Code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="BD">Bangladesh</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <input 
                  type="checkbox" 
                  id="isDefault"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
              <div className="flex items-center space-x-3 mt-6">
                <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Save Address
                </button>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {addresses.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-gray-600 mb-6">Add your first address to make checkout faster</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Address
            </button>
          </div>
        )}

        {/* Addresses Grid */}
        {addresses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <motion.div
                key={address.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                variants={animationVariants.item}
                whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                {/* Address Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{address.name || address.type || 'Address'}</h3>
                        <p className="text-sm text-gray-600 capitalize">{address.type || 'Delivery Address'}</p>
                      </div>
                    </div>
                    {address.isDefault && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                {/* Address Details */}
                <div className="px-6 py-4">
                  <div className="text-sm text-gray-700 space-y-2">
                    {address.address && (
                      <p className="font-medium text-gray-900">{address.address}</p>
                    )}
                    {address.city && address.state && (
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                    )}
                    {address.country && (
                      <p className="text-gray-600">{address.country}</p>
                    )}
                  </div>
                </div>

                {/* Address Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-2 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      {!address.isDefault && (
                        <button className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <X className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    {!address.isDefault && (
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  // Render active section
  const renderActiveSection = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection />;
      case 'orders':
        return <OrdersSection />;
      case 'addresses':
        return <AddressesSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            className="lg:w-64 space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={profileData.user.avatar}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {profileData.user.firstName} {profileData.user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{profileData?.user?.role || 'User'}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {profileData.tabs?.map((item) => {
                const IconComponent = getIcon(item.iconName);
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                      activeTab === item.id
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderActiveSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
const MemoizedProfilePageClient = memo(ProfilePageClient, (prevProps, nextProps) => {
  // Custom comparison function to prevent re-renders when profileData hasn't meaningfully changed
  if (!prevProps.profileData && !nextProps.profileData) return true;
  if (!prevProps.profileData || !nextProps.profileData) return false;
  
  // Compare user data specifically
  const prevUser = prevProps.profileData.user;
  const nextUser = nextProps.profileData.user;
  
  if (!prevUser && !nextUser) return true;
  if (!prevUser || !nextUser) return false;
  
  // Compare the fields that matter for editing
  const userFieldsMatch = (
    prevUser.id === nextUser.id &&
    prevUser.firstName === nextUser.firstName &&
    prevUser.lastName === nextUser.lastName &&
    prevUser.email === nextUser.email &&
    prevUser.phone === nextUser.phone
  );
  
  // Compare orders array length and first few orders
  const prevOrders = prevProps.profileData.orders || [];
  const nextOrders = nextProps.profileData.orders || [];
  const ordersMatch = (
    prevOrders.length === nextOrders.length &&
    JSON.stringify(prevOrders.slice(0, 3)) === JSON.stringify(nextOrders.slice(0, 3))
  );
  
  // If user data and recent orders are the same, don't re-render
  return userFieldsMatch && ordersMatch;
});

MemoizedProfilePageClient.displayName = 'ProfilePageClient';

export default MemoizedProfilePageClient;