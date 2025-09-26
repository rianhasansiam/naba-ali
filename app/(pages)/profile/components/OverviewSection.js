'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { 
  User, Package, DollarSign, Calendar, Star, Mail, Phone, 
  MapPin, Edit3, Camera, TrendingUp
} from 'lucide-react';
import Image from 'next/image';

const OverviewSection = ({ 
  normalizedProfile, 
  processedOrders,
  isEditing, 
  setIsEditing,
  saving,
  handleSave,
  handleCancel,
  firstNameRef,
  lastNameRef,
  phoneRef,
  showToast
}) => {
  // Calculate user statistics from orders
  const userStats = useMemo(() => {
    const userEmail = normalizedProfile.user.email;
    
    // Filter orders by user email
    const userOrders = processedOrders.filter(order => {
      return (
        order.userEmail === userEmail ||
        order.customerInfo?.email === userEmail ||
        order.user?.email === userEmail ||
        order.email === userEmail
      );
    });

    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Calculate member since date
    const memberSince = new Date(normalizedProfile.user.createdAt || Date.now()).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });

    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    return {
      totalOrders,
      totalSpent,
      memberSince,
      avgOrderValue,
      userOrders
    };
  }, [processedOrders, normalizedProfile.user.email, normalizedProfile.user.createdAt]);


  console.log(normalizedProfile.user)

  // Render user statistics
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={normalizedProfile.user.avatar}
                alt="Profile"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          
          {/* User Details */}
          <div className="flex-1 space-y-4">
            
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    ref={firstNameRef}
                    type="text"
                    defaultValue={normalizedProfile.user.firstName}
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
                    defaultValue={normalizedProfile.user.lastName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={normalizedProfile.user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    ref={phoneRef}
                    type="tel"
                    defaultValue={normalizedProfile.user.phone || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="md:col-span-2 flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Package size={16} />
                    )}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {normalizedProfile.user.firstName} {normalizedProfile.user.lastName}
                    </h3>
                    <p className="text-gray-600">{normalizedProfile.user.email}</p>
                    {normalizedProfile.user.phone && (
                      <p className="text-gray-600">{normalizedProfile.user.phone}</p>
                    )}
                    {!normalizedProfile.user.phone && (
                      <p className="text-gray-400 italic">Phone not provided</p>
                    )}
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <Star className="w-4 h-4 mr-1" />
                    {normalizedProfile?.user?.role || 'User'}
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit3 size={16} className="mr-2" />
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${userStats.totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Order</p>
              <p className="text-2xl font-bold text-gray-900">${userStats.avgOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.memberSince}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Mail className="w-5 h-5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{normalizedProfile.user.email}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="w-5 h-5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{normalizedProfile.user.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <User className="w-5 h-5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium capitalize">{normalizedProfile.user.provider || 'Standard'}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Join Date</p>
                <p className="font-medium">{userStats.memberSince}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewSection;