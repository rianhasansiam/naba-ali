'use client';

import { useGetData } from '@/lib/hooks/useGetData';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductDetailPage({ params }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Fetch all products using real API
  const { data: products, isLoading, error } = useGetData({
    name: 'products',
    api: '/api/products'
  });

  // Find the specific product by ID from real database
  const product = products?.find(p => p._id === params.id);

  // Set default selections when product loads
  if (product && !selectedColor && product.colors?.length > 0) {
    setSelectedColor(product.colors[0]);
  }
  if (product && !selectedSize && product.sizes?.length > 0) {
    setSelectedSize(product.sizes[0]);
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Handle error or product not found
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/allProducts" 
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 bg-white shadow-sm">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span className="text-gray-400">→</span>
          <Link href="/allProducts" className="text-gray-500 hover:text-gray-700 transition-colors">
            Products
          </Link>
          <span className="text-gray-400">→</span>
          <span className="text-gray-900 font-medium">{product.name || product.title}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images?.[selectedImageIndex] || product.image || '/placeholder-product.jpg'}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Price */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 text-xs font-medium rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Information */}
            <div className="mb-6">
              {(() => {
                const stock = product.stock || 0;
                if (stock === 0) {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    </div>
                  );
                } else if (stock <= 10) {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span className="text-orange-600 font-medium">Low Stock - Only {stock} left!</span>
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-green-600 font-medium">In Stock ({stock} available)</span>
                    </div>
                  );
                }
              })()}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews?.user?.length || 0} reviews)
                </span>
              </div>
            )}

            {/* Description */}
            <div className="prose prose-sm text-gray-600 mb-8">
              <p>{product.description || 'High quality product with excellent features and comfortable design.'}</p>
            </div>
          </div>

          <div className="space-y-6">

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Available Colors
                {selectedColor && <span className="text-gray-500 font-normal ml-2">- {selectedColor}</span>}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`px-5 py-2.5 text-sm font-medium border-2 rounded-lg transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-black bg-black text-white shadow-lg transform scale-105'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Size Guide
                {selectedSize && <span className="text-gray-500 font-normal ml-2">- {selectedSize}</span>}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 text-sm font-medium border-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                      selectedSize === size
                        ? 'border-black bg-black text-white shadow-lg transform scale-105'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Quantity</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-lg font-semibold hover:bg-gray-50 transition-colors rounded-l-lg"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-6 py-3 text-lg font-semibold border-x border-gray-200 bg-white min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min((product.stock || 99), quantity + 1))}
                  className="w-12 h-12 flex items-center justify-center text-lg font-semibold hover:bg-gray-50 transition-colors rounded-r-lg"
                  disabled={quantity >= (product.stock || 99)}
                >
                  +
                </button>
              </div>
              {product.stock && quantity >= product.stock && (
                <span className="text-sm text-orange-600">Max quantity reached</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-6">
            <button 
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                (product.stock || 0) === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
              disabled={(product.stock || 0) === 0}
            >
              {(product.stock || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 px-6 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors font-medium">
                Add to Wishlist
              </button>
              <Link
                href="/allProducts"
                className="py-3 px-6 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors font-medium text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

            {/* Product Information */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold mb-6">Product Information</h3>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Product ID:</span>
                      <span className="text-gray-900 font-mono text-sm">{product._id?.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {product.category || 'General'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Brand:</span>
                      <span className="text-gray-900 font-semibold">NABA ALI</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Availability:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (product.stock || 0) > 10 
                          ? 'bg-green-100 text-green-800' 
                          : (product.stock || 0) > 0 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {(product.stock || 0) > 10 ? 'In Stock' : (product.stock || 0) > 0 ? 'Limited Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Style:</span>
                      <span className="text-gray-900">{product.style || 'Classic'}</span>
                    </div>
                    {product.createdAt && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-700">Added:</span>
                        <span className="text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Features */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      Free Shipping
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      30-Day Returns
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                      Quality Guarantee
                    </span>
                    {(product.stock || 0) > 0 && (
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                        Fast Delivery
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            {product.reviews?.user?.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Customer Reviews</h3>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {product.reviews.user.length} review{product.reviews.user.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-6">
                  {product.reviews.user.slice(0, 3).map((review, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {review.name ? review.name.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{review.name || 'Anonymous'}</div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-sm ${
                                      i < review.stars ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">({review.stars}/5)</span>
                            </div>
                          </div>
                        </div>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.description}</p>
                      {review.date && (
                        <div className="text-xs text-gray-500 mt-3">
                          Reviewed on {new Date(review.date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {product.reviews.user.length > 3 && (
                    <button className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg transition-colors">
                      View All {product.reviews.user.length} Reviews
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}