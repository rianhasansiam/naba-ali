'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Star, 
  Eye,
  MessageSquare,
  Calendar,
  ThumbsUp,
  User,
  Trash2
} from 'lucide-react';

const AllReviewsClient = ({reviewsData}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  if (!reviewsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading review data...</p>
      </div>
    );
  }

  const { reviews = [], stats = {} } = reviewsData;

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const {
    totalReviews = 0,
    averageRating = 0,
    pendingReviews = 0,
    approvedReviews = 0
  } = stats;

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
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalReviews}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <ThumbsUp className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Approved</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">{approvedReviews}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Eye className="text-yellow-600" size={20} />
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingReviews}</p>
        </div>
        

        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Star className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Avg Rating</span>
          </div>
          <p className="text-2xl font-bold text-gray-600 mt-1">{stats.averageRating.toFixed(1)}</p>
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

export default AllReviewsClient;
