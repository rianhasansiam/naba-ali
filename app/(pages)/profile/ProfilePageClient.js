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
import { normalizeProfileData, prepareUserDataForUpdate } from '@/lib/utils/profileDataNormalizer';

// Import separate components
import OverviewSection from './components/OverviewSection';
import OrdersSection from './components/OrdersSection';
import AddressSection from './components/AddressSection';

const ProfilePageClient = ({ profileData, onUpdateProfile }) => {
  // Normalize profile data to handle different user data structures
  const normalizedProfile = useMemo(() => normalizeProfileData(profileData), [profileData]);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  // Get session for user authentication
  const { data: session } = useSession();

  // Add global error handler for media/audio errors
  useEffect(() => {
    const handleError = (event) => {
      // Suppress audio/media CSP errors
      if (event.message && event.message.includes('data:audio')) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Show toast notification
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: 'success', message: '' });
    }, 3000);
  };

  // Since we already get processed data from ProfilePageWrapper, we don't need to fetch again
  // This improves performance and reduces redundant API calls
  const userOrders = useMemo(() => normalizedProfile?.orders || [], [normalizedProfile?.orders]);
  
  // Memoize debug logging to prevent re-renders
  useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Original Profile Data:', profileData);
      console.log('Normalized Profile Data:', normalizedProfile);
      console.log('User Orders:', userOrders);
      console.log('Orders Length:', userOrders.length);
      
      // Add detailed logging for each order
      userOrders.forEach((order, index) => {
        console.log(`Order ${index}:`, {
          id: order.id,
          status: order.status,
          total: order.total,
          items: order.items?.length || 0,
          date: order.date
        });
      });
    }
  }, [profileData, normalizedProfile, userOrders]);

  // Create memoized refs for form inputs
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const phoneRef = useRef(null);

  // Animation variants
  const animationVariants = useMemo(() => ({
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          delayChildren: 0.1,
          staggerChildren: 0.1
        }
      }
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100
        }
      }
    }
  }), []);

  // Handle functions
  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleEditToggle = useCallback(() => {
    if (!isEditing) {
      setIsEditing(true);
    }
  }, [isEditing]);

  // Helper functions
  const getIcon = useCallback((iconName) => {
    const icons = {
      User, Package, MapPin, 
      DollarSign, Star, Calendar, Truck, CheckCircle, Clock
    };
    return icons[iconName] || User;
  }, []);

  const getStatusBadge = useCallback((status) => {
    const badgeClasses = {
      delivered: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClasses[status] || badgeClasses.pending}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
      </span>
    );
  }, []);

  const getStatusIcon = useCallback((status) => {
    const iconMap = {
      delivered: CheckCircle,
      shipped: Truck,
      processing: Clock,
      pending: AlertCircle,
    };
    return iconMap[status] || Package2;
  }, []);

  const getStatusDescription = useCallback((status) => {
    const descriptions = {
      delivered: 'Your order has been delivered',
      shipped: 'Your order is on the way',
      processing: 'Your order is being prepared',
      pending: 'Your order is being processed',
      cancelled: 'Your order has been cancelled'
    };
    return descriptions[status] || 'Status unknown';
  }, []);

  // Process orders with enhanced data
  const processedOrders = useMemo(() => {
    return userOrders.map((order, index) => {
      const StatusIcon = getStatusIcon(order.status);
      const orderDate = order.date ? new Date(order.date).toLocaleDateString() : 'Unknown';
      const orderTime = order.date ? new Date(order.date).toLocaleTimeString() : '';
      const displayTotal = `$${(order.total || 0).toFixed(2)}`;

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

  // Safety check for profileData and normalized profile
  if (!profileData || !normalizedProfile || !normalizedProfile.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <User size={64} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load profile data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }



  // Handle form submission with current edit data
  const handleSave = async () => {
    setSaving(true);
    
    // Get values directly from input refs (no re-render needed)
    const currentEditData = {
      firstName: firstNameRef.current?.value?.trim() || '',
      lastName: lastNameRef.current?.value?.trim() || '',
      email: normalizedProfile.user.email, // Email is readonly
      phone: phoneRef.current?.value?.trim() || ''
    };
 
    try {
      // Validate required fields
      if (!currentEditData.firstName.trim()) {
        showToast('error', 'First name is required');
        setSaving(false);
        return;
      }

      // Prepare update data using the utility function
      const updateData = prepareUserDataForUpdate(currentEditData, normalizedProfile.user);

      console.log('Current Edit Data:', currentEditData);
      console.log('Original User Data:', normalizedProfile.user);
      console.log('Prepared Update Data:', updateData);
      console.log('User ID for API call:', normalizedProfile.user.id);
      console.log('API URL:', `/api/users/${normalizedProfile.user.id}`);
      
      // Make API call to update user
      const response = await fetch(`/api/users/${normalizedProfile.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      console.log('API Response:', result);
      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);

      if (response.ok && result.success) {
        showToast('success', 'Profile updated successfully!');
        setIsEditing(false);
        
        // Refetch user data to update the UI
        if (onUpdateProfile) {
          await onUpdateProfile();
        }
      } else {
        showToast('error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      showToast('error', 'An error occurred while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Tab configuration
  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin }
  ];

  // Render active section
  const renderActiveSection = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewSection 
            normalizedProfile={normalizedProfile}
            processedOrders={processedOrders}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            saving={saving}
            handleSave={handleSave}
            handleCancel={handleCancel}
            firstNameRef={firstNameRef}
            lastNameRef={lastNameRef}
            phoneRef={phoneRef}
            showToast={showToast}
          />
        );
      case 'orders':
        return (
          <OrdersSection 
            normalizedProfile={normalizedProfile}
            processedOrders={processedOrders}
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
          />
        );
      case 'addresses':
        return (
          <AddressSection 
            normalizedProfile={normalizedProfile}
            showToast={showToast}
          />
        );
      default:
        return (
          <OverviewSection 
            normalizedProfile={normalizedProfile}
            processedOrders={processedOrders}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            saving={saving}
            handleSave={handleSave}
            handleCancel={handleCancel}
            firstNameRef={firstNameRef}
            lastNameRef={lastNameRef}
            phoneRef={phoneRef}
            showToast={showToast}
          />
        );
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
                    src={normalizedProfile.user.avatar}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {normalizedProfile.user.firstName} {normalizedProfile.user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{normalizedProfile?.user?.role || 'User'}</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-lg p-2">
              {tabs.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderActiveSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.95 }}
            className="fixed top-4 right-4 z-[60]"
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
    prevUser.firstName === nextUser.firstName &&
    prevUser.lastName === nextUser.lastName &&
    prevUser.email === nextUser.email &&
    prevUser.phone === nextUser.phone &&
    prevUser.avatar === nextUser.avatar
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