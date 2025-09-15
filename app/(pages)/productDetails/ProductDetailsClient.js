'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHeart, 
  FiShoppingCart, 
  FiStar, 
  FiShare2,
  FiZoomIn,
  FiMinus,
  FiPlus,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiAward,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
  FiInfo,
  FiUser,
  FiCalendar,
  FiThumbsUp
} from 'react-icons/fi';

export default function ProductDetailsClient({ productData }) {
  const { product, reviews, relatedProducts, sizeGuide } = productData;
  
  // State management
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');

  // Refs
  const imageRef = useRef(null);
  const thumbnailsRef = useRef(null);

  // Handlers
  const handleImageChange = (index) => {
    setSelectedImageIndex(index);
  };

  const handleColorSelect = (color) => {
    if (color.available) {
      setSelectedColor(color);
    }
  };

  const handleSizeSelect = (size) => {
    if (size.available) {
      setSelectedSize(size);
    }
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase' && quantity < product.stockCount) {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    setIsAddingToCart(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAddingToCart(false);
    
    // Show success message or redirect
    console.log('Added to cart:', {
      product: product.id,
      color: selectedColor.name,
      size: selectedSize.name,
      quantity
    });
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    if (reviewFilter === 'all') return true;
    if (reviewFilter === 'verified') return review.verified;
    if (reviewFilter === '5-star') return review.rating === 5;
    if (reviewFilter === '4-star') return review.rating === 4;
    return true;
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  return (
    <div className="pt-10">
      {/* Breadcrumb */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-900 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </motion.nav>

      {/* Main Product Section */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
            <Image
              ref={imageRef}
              src={product.images[selectedImageIndex].url}
              alt={product.images[selectedImageIndex].alt}
              fill
              className="object-cover cursor-zoom-in"
              sizes="(max-width: 768px) 100vw, 50vw"
              onClick={() => setShowZoom(true)}
            />
            
            {/* Image Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isBestseller && (
                <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  BESTSELLER
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{product.discount}% OFF
                </span>
              )}
              {product.isEcoFriendly && (
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  ECO-FRIENDLY
                </span>
              )}
            </div>

            {/* Zoom Icon */}
            <button
              onClick={() => setShowZoom(true)}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
            >
              <FiZoomIn size={20} />
            </button>

            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => handleImageChange(selectedImageIndex > 0 ? selectedImageIndex - 1 : product.images.length - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button
                  onClick={() => handleImageChange(selectedImageIndex < product.images.length - 1 ? selectedImageIndex + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <FiChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-3 overflow-x-auto pb-2" ref={thumbnailsRef}>
            {product.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => handleImageChange(index)}
                className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index ? 'border-gray-900' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product Information */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-500">{product.brand}</span>
              <span className="text-sm text-gray-300">•</span>
              <span className="text-sm text-gray-500">SKU: {product.sku}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.totalReviews} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
            )}
            {product.discount > 0 && (
              <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded">
                Save {product.discount}%
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.inStock ? (
              <>
                <FiCheck className="w-5 h-5 text-green-500" />
                <span className="text-green-600 font-medium">In Stock</span>
                <span className="text-gray-500">({product.stockCount} available)</span>
              </>
            ) : (
              <>
                <FiX className="w-5 h-5 text-red-500" />
                <span className="text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">
              Color: <span className="font-normal">{selectedColor.name}</span>
            </h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorSelect(color)}
                  disabled={!color.available}
                  className={`w-10 h-10 rounded-full border-2 relative ${
                    selectedColor.name === color.name ? 'border-gray-900' : 'border-gray-300'
                  } ${!color.available ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-600'}`}
                  style={{ backgroundColor: color.value }}
                >
                  {selectedColor.name === color.name && (
                    <FiCheck className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                  {!color.available && (
                    <div className="absolute inset-0 rounded-full border border-red-500">
                      <div className="w-full h-0.5 bg-red-500 absolute top-1/2 left-0 rotate-45 origin-center"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">
                Size: {selectedSize ? selectedSize.name : 'Select a size'}
              </h3>
              {/* <button
                onClick={() => setShowSizeGuide(true)}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Size Guide
              </button> */}
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.name}
                  onClick={() => handleSizeSelect(size)}
                  disabled={!size.available}
                  className={`py-3 text-sm font-medium border rounded-lg transition-all ${
                    selectedSize?.name === size.name
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : size.available
                      ? 'border-gray-300 hover:border-gray-900'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiMinus size={16} />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= product.stockCount}
                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus size={16} />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {product.stockCount - quantity} remaining
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || !selectedSize || isAddingToCart}
              className="flex-1 bg-gray-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiShoppingCart size={20} />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-4 border rounded-lg transition-colors ${
                isWishlisted 
                  ? 'border-red-500 bg-red-50 text-red-500' 
                  : 'border-gray-300 hover:border-gray-900'
              }`}
            >
              <FiHeart className={isWishlisted ? 'fill-current' : ''} size={20} />
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors">
              <FiShare2 size={20} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <FiTruck className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Free shipping over $100</span>
            </div>
            <div className="flex items-center gap-3">
              <FiShield className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">1 year warranty</span>
            </div>
            <div className="flex items-center gap-3">
              <FiRefreshCw className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">30-day returns</span>
            </div>
            <div className="flex items-center gap-3">
              <FiAward className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Premium quality</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Product Details Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${reviews.length})` },
              { id: 'shipping', label: 'Shipping & Returns' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>
                <h4 className="font-semibold text-gray-900 mb-4">Key Features:</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Product Details</h4>
                  <dl className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <dt className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                        <dd className="text-gray-900 font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Size Chart</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Size</th>
                          <th className="text-left py-2">Chest (in)</th>
                          <th className="text-left py-2">Length (in)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.sizes.map((size) => (
                          <tr key={size.name} className="border-b border-gray-100">
                            <td className="py-2 font-medium">{size.name}</td>
                            <td className="py-2">{size.measurements.chest}</td>
                            <td className="py-2">{size.measurements.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Reviews Summary */}
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="md:col-span-1">
                    <div className="text-center bg-gray-50 rounded-lg p-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(averageRating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        Based on {reviews.length} reviews
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="space-y-3">
                      {ratingDistribution.map((item) => (
                        <div key={item.rating} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-12">
                            {item.rating} star
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">
                            {item.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reviews Filter */}
                <div className="flex gap-4 mb-6">
                  {[
                    { id: 'all', label: 'All Reviews' },
                    { id: 'verified', label: 'Verified Only' },
                    { id: '5-star', label: '5 Stars' },
                    { id: '4-star', label: '4 Stars' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setReviewFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        reviewFilter === filter.id
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-start gap-4">
                        <Image
                          src={review.userImage}
                          alt={review.userName}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-medium text-gray-900">{review.userName}</h5>
                            {review.verified && (
                              <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-500">
                              Size: {review.size} • Color: {review.color}
                            </span>
                          </div>
                          
                          <h6 className="font-medium text-gray-900 mb-2">{review.title}</h6>
                          <p className="text-gray-600 mb-3">{review.comment}</p>
                          
                          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                            <FiThumbsUp size={14} />
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Shipping Information</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Standard Shipping</h5>
                      <p className="text-gray-600">Free on orders over $100. Delivered in 5-7 business days.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Express Shipping</h5>
                      <p className="text-gray-600">$15 flat rate. Delivered in 2-3 business days.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Overnight Shipping</h5>
                      <p className="text-gray-600">$25 flat rate. Delivered next business day.</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Returns & Exchanges</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">30-Day Returns</h5>
                      <p className="text-gray-600">Return unworn items within 30 days for a full refund.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Free Exchanges</h5>
                      <p className="text-gray-600">Exchange for different size or color at no extra cost.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Return Process</h5>
                      <p className="text-gray-600">Print return label from your account and drop off at any carrier location.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Related Products */}
      {/* <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.isOnSale && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    SALE
                  </span>
                )}
                <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                  <FiHeart size={16} />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(item.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">({item.reviews})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">${item.price}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div> */}

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{sizeGuide.title}</h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {sizeGuide.headers.map((header) => (
                        <th key={header} className="text-left py-3 font-medium text-gray-900">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeGuide.measurements.map((measurement) => (
                      <tr key={measurement.size} className="border-b border-gray-100">
                        <td className="py-3 font-medium">{measurement.size}</td>
                        <td className="py-3">{measurement.chest}</td>
                        <td className="py-3">{measurement.length}</td>
                        <td className="py-3">{measurement.sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <FiInfo className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">How to Measure</h4>
                    <p className="text-sm text-blue-700">
                      For chest measurement, measure around the fullest part of your chest. 
                      For length, measure from the shoulder seam to the bottom hem.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setShowZoom(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={product.images[selectedImageIndex].url}
                alt={product.images[selectedImageIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
              <button
                onClick={() => setShowZoom(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <FiX size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}