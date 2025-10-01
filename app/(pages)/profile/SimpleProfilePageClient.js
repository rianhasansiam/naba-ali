'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { 
  User, Package, Edit3, Save, X, Phone, Mail, Calendar,
  Truck, CheckCircle, Clock, AlertCircle, DollarSign, Star, Camera, Upload, MessageSquare, Plus, Send
} from 'lucide-react';
import Image from 'next/image';
import { uploadToImageBB } from '@/lib/imagebb';

const SimpleProfilePageClient = () => {
  const { data: session, status, update: updateSession } = useSession();
  
  // Default avatar URL that won't cause errors
  const DEFAULT_AVATAR = '/default-avatar.svg'; // Use custom SVG avatar as default
  
  // Single state for all data
  const [data, setData] = useState({
    user: null,
    orders: [],
    reviews: [],
    loading: true,
    error: null
  });
  
  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [orderFilter, setOrderFilter] = useState('all'); // all, pending, processing, shipped, delivered
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  
  // Review form states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    photo: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: ''
  });

  // Show toast notification
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: 'success', message: '' }), 3000);
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadToImageBB(file);
      
      // Update form data with new avatar URL
      setFormData(prev => ({ ...prev, avatar: imageUrl }));
      showToast('success', 'Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('error', error.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Fetch all user data in one go
  const fetchUserData = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Fetch user profile
      const userResponse = await fetch(`/api/users/${session.user.id}`);
      const userData = await userResponse.json();
      
      // Fetch user orders
      const ordersResponse = await fetch('/api/orders');
      const ordersData = await ordersResponse.json();
      
      // Filter orders for current user
      const userOrders = Array.isArray(ordersData) ? ordersData.filter(order => {
        return (
          order.customerInfo?.email === session.user.email ||
          order.userEmail === session.user.email ||
          order.user?.email === session.user.email ||
          order.email === session.user.email
        );
      }) : [];
      
      // Fetch user reviews
      const reviewsResponse = await fetch('/api/reviews');
      const reviewsData = await reviewsResponse.json();
      
      // Filter reviews for current user
      const userReviews = Array.isArray(reviewsData) ? reviewsData.filter(review => {
        return review.customerEmail === session.user.email;
      }) : [];
      
      // Set all data
      setData({
        user: userData.user || userData,
        orders: userOrders,
        reviews: userReviews,
        loading: false,
        error: null
      });
      
      // Initialize form data
      const user = userData.user || userData;
      const nameParts = (user.name || '').split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.image || user.avatar || DEFAULT_AVATAR
      });
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setData(prev => ({ ...prev, loading: false, error: error.message }));
    }
  }, [session?.user?.id, session?.user?.email]);

  // Load data on mount and when session changes
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserData();
    }
  }, [status, session?.user?.id, fetchUserData]);

  // Handle form submission
  const handleSave = async () => {
    if (!data.user?._id && !data.user?.id) return;
    
    setSaving(true);
    
    try {
      const userId = data.user._id || data.user.id;
      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone.trim() || null,
        image: formData.avatar // Include avatar in update
      };
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        showToast('success', 'Profile updated successfully!');
        setIsEditing(false);
        
        // Refresh data
        await fetchUserData();
        
        // Update session if needed
        if (updateSession) {
          await updateSession({
            ...session,
            user: {
              ...session.user,
              name: updateData.name,
              phone: updateData.phone
            }
          });
        }
      } else {
        showToast('error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('error', 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  // Handle review photo upload
  const handleReviewPhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadToImageBB(file);
      setReviewFormData(prev => ({ ...prev, photo: imageUrl }));
      showToast('success', 'Review photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading review photo:', error);
      showToast('error', error.message || 'Failed to upload photo');
    } finally {
      setUploadingImage(false);
    }
  };

  // Open review modal for specific product
  const openReviewModal = (order, product) => {
    setSelectedOrderForReview(order);
    setSelectedProductForReview(product);
    setReviewFormData({
      rating: 5,
      title: '',
      comment: '',
      photo: ''
    });
    setShowReviewModal(true);
  };

  // Close review modal
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedOrderForReview(null);
    setSelectedProductForReview(null);
    setReviewFormData({
      rating: 5,
      title: '',
      comment: '',
      photo: ''
    });
  };

  // Handle review submission
  const handleCreateReview = async () => {
    if (!selectedProductForReview || !reviewFormData.comment.trim()) {
      showToast('error', 'Please provide a rating and comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const now = new Date();
      const reviewData = {
        productId: selectedProductForReview.productId,
        productName: selectedProductForReview.productName,
        customerName: data.user?.name || `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: session.user.email,
        rating: reviewFormData.rating,
        comment: reviewFormData.comment.trim(),
        title: reviewFormData.title.trim() || `Review for ${selectedProductForReview.productName}`,
        photo: reviewFormData.photo,
        verified: true, // Since it's based on actual order
        status: 'pending', // Will be reviewed by admin
        date: now.toISOString().slice(0, 10), // YYYY-MM-DD
        helpful: 0,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      const result = await response.json();

      if (response.ok) {
        showToast('success', 'Review submitted successfully!');
        closeReviewModal();
        // Refresh reviews data
        await fetchUserData();
      } else {
        showToast('error', result.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      showToast('error', 'An error occurred while submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Check if user has already reviewed a product
  const hasReviewedProduct = (productId) => {
    return data.reviews.some(review => review.productId === productId);
  };

  // Get products from delivered orders that can be reviewed
  const getReviewableProducts = () => {
    const reviewableProducts = [];
    data.orders.forEach(order => {
      if (order.status === 'delivered' && order.items) {
        order.items.forEach(item => {
          if (!hasReviewedProduct(item.productId)) {
            reviewableProducts.push({
              ...item,
              orderId: order._id,
              orderDate: order.orderDate
            });
          }
        });
      }
    });
    return reviewableProducts;
  };

  // Filter orders based on selected filter
  const filteredOrders = data.orders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  // Calculate user statistics
  const userStats = {
    totalOrders: data.orders.length,
    totalReviews: data.reviews.length,
    totalSpent: data.orders.reduce((sum, order) => sum + (order.total || order.orderSummary?.total || 0), 0),
    avgOrderValue: data.orders.length > 0 ? 
      data.orders.reduce((sum, order) => sum + (order.total || order.orderSummary?.total || 0), 0) / data.orders.length : 0,
    avgRating: data.reviews.length > 0 ? 
      data.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / data.reviews.length : 0,
    memberSince: data.user?.createdAt ? 
      new Date(data.user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 
      'Recently'
  };

  // Loading state
  if (status === 'loading' || data.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (data.error || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Profile</h2>
          <p className="text-gray-600 mb-4">{data.error || 'Please sign in to view your profile'}</p>
          <button 
            onClick={fetchUserData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "reviews", label: "My Reviews", icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            className="lg:w-64 space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* User Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={data.user?.image || data.user?.avatar || DEFAULT_AVATAR}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {data.user?.name || `${formData.firstName} ${formData.lastName}`.trim() || 'User'}
                  </h3>
                  <p className="text-sm text-gray-600">{data.user?.role || 'Member'}</p>
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
                className="space-y-6"
              >
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <>
                      {/* Profile Header */}
                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                          {/* Profile Picture with Upload */}
                          <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden">
                              <Image
                                src={isEditing ? formData.avatar : (data.user?.image || data.user?.avatar || DEFAULT_AVATAR)}
                                alt="Profile"
                                width={96}
                                height={96}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.target.src = DEFAULT_AVATAR;
                                }}
                              />
                            </div>
                            
                            {isEditing && (
                              <>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                  id="avatar-upload"
                                  disabled={uploadingImage}
                                />
                                <label
                                  htmlFor="avatar-upload"
                                  className={`absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer ${
                                    uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                >
                                  {uploadingImage ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Camera size={16} />
                                  )}
                                </label>
                              </>
                            )}
                          </div>                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                  </label>
                                  <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                  </label>
                                  <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="Enter your phone number"
                                  />
                                </div>
                              </div>
                              
                              {/* Upload Instructions */}
                              {(!formData.avatar || formData.avatar === DEFAULT_AVATAR) && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <div className="flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-blue-600" />
                                    <p className="text-sm text-blue-800">
                                      Click the camera icon to upload your profile picture
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex gap-3">
                                <button
                                  onClick={handleSave}
                                  disabled={saving || uploadingImage}
                                  className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                  {(saving || uploadingImage) ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Save size={16} />
                                  )}
                                  {uploadingImage ? 'Uploading...' : saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                  onClick={() => setIsEditing(false)}
                                  disabled={saving || uploadingImage}
                                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900">
                                    {data.user?.name || 'User'}
                                  </h3>
                                  <p className="text-gray-600">{data.user?.email}</p>
                                  <p className="text-gray-600">{data.user?.phone || 'Phone not provided'}</p>
                                </div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                  <Star className="w-4 h-4 mr-1" />
                                  {data.user?.role || 'Member'}
                                </div>
                              </div>
                              
                              <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
                            <p className="text-2xl font-bold text-gray-900">৳{userStats.totalSpent.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <MessageSquare className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Reviews</p>
                            <p className="text-2xl font-bold text-gray-900">{userStats.totalReviews}</p>
                            {userStats.avgRating > 0 && (
                              <div className="flex items-center mt-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                <span className="text-xs text-gray-500">{userStats.avgRating.toFixed(1)} avg</span>
                              </div>
                            )}
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
                              <p className="font-medium">{data.user?.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-5 h-5 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">{data.user?.phone || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-600">
                            <User className="w-5 h-5 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Account Type</p>
                              <p className="font-medium capitalize">{data.user?.provider || 'Standard'}</p>
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
                  </>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">My Orders</h3>
                      
                      {/* Order Filter */}
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Filter:</label>
                        <select
                          value={orderFilter}
                          onChange={(e) => setOrderFilter(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        >
                          <option value="all">All Orders</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    
                    {filteredOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">
                          {orderFilter === 'all' ? 'No orders found' : `No ${orderFilter} orders found`}
                        </p>
                        {orderFilter !== 'all' && (
                          <button
                            onClick={() => setOrderFilter('all')}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                          >
                            View all orders
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600 mb-4">
                          Showing {filteredOrders.length} of {data.orders.length} orders
                          {orderFilter !== 'all' && (
                            <span className="ml-1 text-blue-600 font-medium">({orderFilter} orders)</span>
                          )}
                        </div>
                        {filteredOrders.map((order, index) => {
                          const statusIcons = {
                            confirmed: CheckCircle,
                            delivered: CheckCircle,
                            shipped: Truck,
                            processing: Clock,
                            pending: AlertCircle,
                            cancelled: X
                          };
                          const StatusIcon = statusIcons[order.status] || AlertCircle;
                          
                          return (
                            <div key={order._id || index} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <StatusIcon className="w-5 h-5 text-blue-600" />
                                  <span className="font-medium">Order #{order.orderId || order._id?.slice(-8)}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Date unknown'}
                                </div>
                              </div>
                              
                              {/* Order Summary */}
                              <div className="flex justify-between items-center mb-3">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    {order.items?.length || 0} item(s) • ৳{(order.total || order.orderSummary?.total || 0).toFixed(2)}
                                  </p>
                                  <p className="text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                      order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* Order Items - Show for delivered orders */}
                              {order.status === 'delivered' && order.items && order.items.length > 0 && (
                                <div className="space-y-2 pt-3 border-t border-gray-100">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Items in this order:</p>
                                  {order.items.map((item, itemIndex) => {
                                    const hasReview = hasReviewedProduct(item.productId);
                                    return (
                                      <div key={itemIndex} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-900 text-sm">{item.productName}</p>
                                          <p className="text-xs text-gray-600">
                                            Size: {item.size || 'N/A'} • Color: {item.color || 'Default'} • 
                                            Qty: {item.quantity || 1} • ৳{(item.price || 0).toFixed(2)}
                                          </p>
                                        </div>
                                        <div className="ml-3">
                                          {hasReview ? (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                              ✓ Reviewed
                                            </span>
                                          ) : (
                                            <button
                                              onClick={() => openReviewModal(order, item)}
                                              className="flex items-center gap-1 text-xs bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                              <Star size={12} />
                                              Write Review
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">My Reviews</h3>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">
                          {data.reviews.length} review{data.reviews.length !== 1 ? 's' : ''}
                        </div>
                        {getReviewableProducts().length > 0 && (
                          <div className="relative group">
                            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                              <Plus size={16} />
                              Write Review
                            </button>
                            
                            {/* Dropdown for reviewable products */}
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              <div className="p-3">
                                <p className="text-sm font-medium text-gray-700 mb-3">Select a product to review:</p>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {getReviewableProducts().map((product, index) => (
                                    <button
                                      key={index}
                                      onClick={() => {
                                        const mockOrder = {
                                          _id: product.orderId,
                                          orderDate: product.orderDate
                                        };
                                        openReviewModal(mockOrder, product);
                                      }}
                                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors"
                                    >
                                      <p className="font-medium text-gray-900 text-sm">{product.productName}</p>
                                      <p className="text-xs text-gray-600">
                                        Size: {product.size || 'N/A'} • Color: {product.color || 'Default'}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Purchased: {product.orderDate ? new Date(product.orderDate).toLocaleDateString() : 'Unknown'}
                                      </p>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Show message if no reviewable products */}
                    {getReviewableProducts().length === 0 && data.reviews.length === 0 && (
                      <div className="text-center py-8">
                        <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 mb-2">No reviews yet</p>
                        <p className="text-sm text-gray-400 mb-4">You can write reviews for delivered orders</p>
                        <p className="text-xs text-gray-400">Complete your first order to start writing reviews!</p>
                      </div>
                    )}

                    {/* Show reviews if any exist */}
                    {data.reviews.length > 0 && (
                      <div className="space-y-4">
                        {data.reviews.map((review, index) => (
                          <div key={review._id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            {/* Review Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-gray-900 truncate">{review.productName}</h4>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    review.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {review.status?.charAt(0).toUpperCase() + review.status?.slice(1) || 'Pending'}
                                  </span>
                                </div>
                                
                                {/* Rating Stars */}
                                <div className="flex items-center gap-1 mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= (review.rating || 0)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-600 ml-1">
                                    ({review.rating || 0}/5)
                                  </span>
                                </div>
                              </div>
                              
                              <div className="text-sm text-gray-500">
                                {review.date ? new Date(review.date).toLocaleDateString() : 
                                 review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Date unknown'}
                              </div>
                            </div>
                            
                            {/* Review Title */}
                            {review.title && (
                              <h5 className="font-medium text-gray-800 mb-2">{review.title}</h5>
                            )}
                            
                            {/* Review Comment */}
                            <p className="text-gray-700 text-sm leading-relaxed mb-3">
                              {review.comment || 'No comment provided'}
                            </p>
                            
                            {/* Review Photo */}
                            {review.photo && (
                              <div className="mb-3">
                                <Image
                                  src={review.photo}
                                  alt="Review photo"
                                  width={120}
                                  height={120}
                                  className="rounded-lg object-cover border border-gray-200"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            
                            {/* Review Stats */}
                            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-4">
                                {review.verified && (
                                  <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-3 h-3" />
                                    Verified Purchase
                                  </span>
                                )}
                                {review.helpful > 0 && (
                                  <span>{review.helpful} found this helpful</span>
                                )}
                              </div>
                              <span>Review #{review._id?.slice(-8) || index + 1}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Show message when user has reviews but no reviewable products */}
                    {data.reviews.length > 0 && getReviewableProducts().length === 0 && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-600">
                          ✓ You&apos;ve reviewed all your purchased items!
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Review Creation Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeReviewModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Write a Review</h2>
                  <button
                    onClick={closeReviewModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Product Info */}
                {selectedProductForReview && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {selectedProductForReview.productName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Purchased on {selectedOrderForReview?.orderDate ? 
                        new Date(selectedOrderForReview.orderDate).toLocaleDateString() : 'Unknown date'}
                    </p>
                    <div className="mt-2 text-sm text-gray-600">
                      Size: {selectedProductForReview.size || 'N/A'} • 
                      Color: {selectedProductForReview.color || 'Default'} • 
                      Quantity: {selectedProductForReview.quantity || 1}
                    </div>
                  </div>
                )}

                {/* Rating Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewFormData(prev => ({ ...prev, rating: star }))}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= reviewFormData.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({reviewFormData.rating}/5)
                    </span>
                  </div>
                </div>

                {/* Review Title */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={reviewFormData.title}
                    onChange={(e) => setReviewFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Summarize your experience..."
                    maxLength={100}
                  />
                </div>

                {/* Review Comment */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={reviewFormData.comment}
                    onChange={(e) => setReviewFormData(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Share your thoughts about this product..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {reviewFormData.comment.length}/500 characters
                  </p>
                </div>

                {/* Photo Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Photo (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReviewPhotoUpload}
                      className="hidden"
                      id="review-photo-upload"
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="review-photo-upload"
                      className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                        uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploadingImage ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera size={16} />
                      )}
                      {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                    </label>
                    
                    {reviewFormData.photo && (
                      <div className="relative">
                        <Image
                          src={reviewFormData.photo}
                          alt="Review photo"
                          width={60}
                          height={60}
                          className="rounded-lg object-cover border"
                        />
                        <button
                          onClick={() => setReviewFormData(prev => ({ ...prev, photo: '' }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeReviewModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateReview}
                    disabled={submittingReview || !reviewFormData.comment.trim()}
                    className={`flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors ${
                      submittingReview || !reviewFormData.comment.trim() 
                        ? 'opacity-50 cursor-not-allowed' 
                        : ''
                    }`}
                  >
                    {submittingReview ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send size={16} />
                    )}
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
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
            } text-white rounded-xl shadow-2xl p-4 min-w-[300px]`}>
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

export default SimpleProfilePageClient;