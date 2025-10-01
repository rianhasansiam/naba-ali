'use client';

import { useState } from 'react';
import { X, Upload, Star, Camera } from 'lucide-react';
import Image from 'next/image';

const AddReviewModal = ({ isOpen, onClose, products, onSubmitReview }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewerPhoto, setReviewerPhoto] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  const resetForm = () => {
    setSelectedProductId('');
    setReviewText('');
    setRating(0);
    setReviewerPhoto('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProductId || !reviewText || rating === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reviewData = {
        productId: selectedProductId,
        review: {
          description: reviewText,
          stars: rating,
          photo: reviewerPhoto || ''
        }
      };


      await onSubmitReview(reviewData);
      handleClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(`Failed to submit review: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic file validation
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setIsUploading(true);

    try {
      // For demo purposes, we'll use FileReader to create a data URL
      // In production, you would upload to a real image hosting service
      const reader = new FileReader();
      
      reader.onload = (e) => {
        // Use the data URL as the image source
        // In production, replace this with actual cloud storage URL
        setReviewerPhoto(e.target.result);
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        throw new Error('Failed to read image file');
      };
      
      // Read the file as data URL
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add Product Review</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Product *
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {

                setSelectedProductId(e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a product to review...</option>
              {products?.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} - ৳{product.price}
                </option>
              ))}
            </select>
            {!products || products.length === 0 && (
              <p className="text-sm text-red-500 mt-1">No products available. Please add products first.</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      star <= rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600">
                {rating > 0 ? `${rating}/5 stars` : 'Click to rate'}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review *
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value.slice(0, 500))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Share your experience with this product..."
              maxLength={500}
              required
            />
            <p className={`text-sm mt-1 ${reviewText.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
              {reviewText.length}/500 characters {reviewText.length > 450 && '(approaching limit)'}
            </p>
          </div>

          {/* Reviewer Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reviewer Photo (Optional)
            </label>
            <div className="flex items-center space-x-4">
              {reviewerPhoto ? (
                <div className="relative">
                  <Image
                    src={reviewerPhoto}
                    alt="Reviewer"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    unoptimized={true}
                  />
                  <button
                    type="button"
                    onClick={() => setReviewerPhoto('')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                  <Camera className="text-gray-400" size={24} />
                </div>
              )}
              
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="reviewer-photo"
                  disabled={isUploading}
                />
                <label
                  htmlFor="reviewer-photo"
                  className={`inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload size={16} />
                  <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Max 5MB, JPG/PNG only
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedProductId || !reviewText || rating === 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isSubmitting || !selectedProductId || !reviewText || rating === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;