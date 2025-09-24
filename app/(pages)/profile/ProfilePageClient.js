'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, MapPin, CreditCard, Settings, Bell, 
  Edit3, Save, X, Plus, DollarSign, Star, Calendar,
  Truck, CheckCircle, Clock, ShoppingBag, Camera,
  Eye, Download, MoreVertical
} from 'lucide-react';
import Image from 'next/image';

const ProfilePageClient = ({ profileData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: profileData?.user?.firstName || '',
    lastName: profileData?.user?.lastName || '',
    email: profileData?.user?.email || '',
    phone: profileData?.user?.phone || ''
  });

  // Show login prompt if no user data
  if (!profileData?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <User className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Icon mapping function
  const getIcon = (iconName) => {
    const icons = {
      User, Package, MapPin, CreditCard, Settings, Bell,
      DollarSign, Star, Calendar, Truck, CheckCircle, Clock
    };
    return icons[iconName] || User;
  };

  // Order status styling
  const getStatusBadge = (status) => {
    const styles = {
      delivered: 'bg-green-100 text-green-800 border-green-200',
      shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return styles[status] || styles.processing;
  };

  const getStatusIcon = (status) => {
    const icons = {
      delivered: CheckCircle,
      shipped: Truck,
      processing: Clock,
      cancelled: X
    };
    return icons[status] || Clock;
  };

  // Handle form submission
  const handleSave = () => {
    // Simulate API call
    console.log('Saving user data:', editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      firstName: profileData?.user?.firstName || '',
      lastName: profileData?.user?.lastName || '',
      email: profileData?.user?.email || '',
      phone: profileData?.user?.phone || ''
    });
    setIsEditing(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Overview Section
  const OverviewSection = () => (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* User Info Card */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8"
        variants={itemVariants}
      >
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
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
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2 flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
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
                  {profileData.user.membershipTier} Member
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {(profileData.profileStats || []).map((stat, index) => {
          const IconComponent = getIcon(stat.iconName);
          return (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
              variants={itemVariants}
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

  // Orders Section
  const OrdersSection = () => (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
        <div className="text-sm text-gray-600">
          {(profileData.orders || []).length} total orders
        </div>
      </div>

      <div className="space-y-4">
        {(profileData.orders || []).map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          return (
            <motion.div
              key={order.id}
              className="bg-white rounded-xl shadow-lg p-6"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order {order.id}
                  </h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(order.status)}`}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">${order.total}</p>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {order.items_detail.slice(0, 3).map((item, index) => (
                      <div key={index} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                    {order.items > 3 && (
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                        +{order.items - 3}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.items} items</p>
                    {order.trackingNumber && (
                      <p className="text-xs text-gray-600">Tracking: {order.trackingNumber}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  {order.status === 'delivered' && (
                    <button className="flex items-center space-x-1 px-3 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
                      <Download className="w-4 h-4" />
                      <span>Invoice</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  // Addresses Section
  const AddressesSection = () => (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
          <Plus className="w-4 h-4" />
          <span>Add Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(profileData.addresses || []).map((address) => (
          <motion.div
            key={address.id}
            className="bg-white rounded-xl shadow-lg p-6 relative"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            {address.isDefault && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Default
                </span>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{address.label}</h3>
                  <p className="text-sm text-gray-600">{address.type}</p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">{address.name}</p>
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200">
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200">
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Payment Methods Section
  const PaymentMethodsSection = () => (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
          <Plus className="w-4 h-4" />
          <span>Add Card</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(profileData.paymentMethods || []).map((payment) => (
          <motion.div
            key={payment.id}
            className="bg-white rounded-xl shadow-lg p-6 relative"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            {payment.isDefault && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Default
                </span>
              </div>
            )}

            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{payment.brand}</h3>
                <p className="text-sm text-gray-600">•••• •••• •••• {payment.last4}</p>
              </div>
            </div>

            <div className="text-sm text-gray-700 mb-4">
              <p>Expires {String(payment.expiryMonth).padStart(2, '0')}/{payment.expiryYear}</p>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200">
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200">
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Settings Section
  const SettingsSection = () => (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>

      <div className="space-y-6">
        {/* Security Settings */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-sm text-gray-600">Last updated 30 days ago</p>
              </div>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                Change
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
                Enable
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-4">
            {Object.entries(profileData.preferences).slice(0, 5).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {key === 'newsletter' && 'Weekly fashion updates and trends'}
                    {key === 'orderUpdates' && 'Status updates for your orders'}
                    {key === 'promotions' && 'Special offers and discounts'}
                    {key === 'newArrivals' && 'Latest collection notifications'}
                    {key === 'styleRecommendations' && 'Personalized style suggestions'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    className="sr-only peer"
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  // Render active section
  const renderActiveSection = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection />;
      case 'orders':
        return <OrdersSection />;
      case 'addresses':
        return <AddressesSection />;
      case 'payments':
        return <PaymentMethodsSection />;
      case 'settings':
      case 'notifications':
        return <SettingsSection />;
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
                  <p className="text-sm text-gray-600">{profileData.user.membershipTier} Member</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {profileData.navigation.map((item) => {
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

export default ProfilePageClient;