'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Eye,
  Filter,
  User,
  MessageSquare,
  Calendar,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

const AllReviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  // Demo reviews data
  const [reviews] = useState([
    {
      id: 1,
      productName: 'Premium Cotton T-Shirt',
      customerName: 'Sarah Johnson',
      rating: 5,
      title: 'Amazing quality and comfort!',
      comment: 'This t-shirt exceeded my expectations. The fabric is soft, the fit is perfect, and it has maintained its shape after multiple washes.',
      date: '2025-09-15',
      verified: true,
      helpful: 12,
      status: 'approved'
    },
    {
      id: 2,
      productName: 'Designer Jeans',
      customerName: 'Michael Chen',
      rating: 4,
      title: 'Great fit, slightly expensive',
      comment: 'The jeans fit perfectly and look great. Quality is excellent but the price point is a bit high.',
      date: '2025-09-14',
      verified: true,
      helpful: 8,
      status: 'approved'
    },
    {
      id: 3,
      productName: 'Casual Sneakers',
      customerName: 'Emily Davis',
      rating: 5,
      title: 'Super comfortable for daily wear',
      comment: 'I wear these sneakers every day and they are incredibly comfortable. Great for walking and casual outings.',
      date: '2025-09-13',
      verified: false,
      helpful: 15,
      status: 'pending'
    },
    {
      id: 4,
      productName: 'Summer Dress',
      customerName: 'Lisa Brown',
      rating: 3,
      title: 'Nice design but sizing issue',
      comment: 'The dress looks beautiful but runs small. I had to return and get a larger size.',
      date: '2025-09-12',
      verified: true,
      helpful: 5,
      status: 'approved'
    },
    {
      id: 5,
      productName: 'Leather Jacket',
      customerName: 'David Wilson',
      rating: 1,
      title: 'Poor quality, not as advertised',
      comment: 'The leather quality is very poor and nothing like what was shown in the photos. Very disappointed.',
      date: '2025-09-11',
      verified: true,
      helpful: 3,
      status: 'flagged'
    }
  ]);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'flagged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === 'approved').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    flagged: reviews.filter(r => r.status === 'flagged').length,
    averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
    verified: reviews.filter(r => r.verified).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-600">Monitor and manage customer reviews</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <MessageSquare className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Total Reviews</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <ThumbsUp className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Approved</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Eye className="text-yellow-600" size={20} />
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <ThumbsDown className="text-red-600" size={20} />
            <span className="text-sm text-gray-600">Flagged</span>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.flagged}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Star className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Avg Rating</span>
          </div>
          <p className="text-2xl font-bold text-gray-600 mt-1">{stats.averageRating.toFixed(1)}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <User className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Verified</span>
          </div>
          <p className="text-2xl font-bold text-gray-600 mt-1">{stats.verified}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent w-full lg:w-64"
            />
          </div>
          
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{review.title}</h3>
                  {review.verified && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    {getRatingStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-600">by {review.customerName}</span>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">Product: <span className="font-medium">{review.productName}</span></p>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(review.status)}`}>
                  {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <ThumbsUp size={14} className="mr-1" />
                <span>{review.helpful} people found this helpful</span>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                  <Eye size={14} />
                  <span>View</span>
                </button>
                <button className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                  <ThumbsUp size={14} />
                  <span>Approve</span>
                </button>
                <button className="flex items-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default AllReviews;
