'use client';

import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Badge component
const Badge = ({ children, className, variant }) => {
  const baseClasses = "inline-flex items-center px-2 py-1 text-xs font-medium rounded-md";
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-500 text-white"
  };
  const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className || ""}`;
  
  return <span className={classes}>{children}</span>;
};

// Image with fallback component
const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
    setImageSrc('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D'); // You can add a placeholder image
  };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={400}
      height={400}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

// Product Card Component
const ProductCard = ({ 
  product, 
  onProductClick = () => {}, 
  onAddToCart = () => {} 
}) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {/* {product.isNew && (
          <Badge className=" ">New</Badge>
        )} */}
        {product.isOnSale && discount > 0 && (
          <Badge variant="destructive">{discount}% OFF</Badge>
        )}
      </div>

      {/* Quick Actions */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle wishlist functionality
          }}
        >
          <Heart className="w-4 h-4" />
        </motion.button>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onProductClick(product);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          <Eye className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <ImageWithFallback
          src={product.image || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        {/* Quick Add to Cart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full bg-gray-900 text-white hover:bg-gray-800 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-gray-500 uppercase tracking-wide">{product.category}</p>
          <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < Math.floor(product.rating || 0) 
                    ? 'text-yellow-400' 
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main Cards component for displaying multiple products
const Cards = ({ products = [] }) => {
  const router = useRouter();

  // Handle product click (view details)
  const handleProductClick = (product) => {
    // Navigate to product details page with the product ID
    const productId = product._id || product.id;
    if (productId) {
      router.push(`/productDetails/${productId}`);
    }
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
    // You can add cart logic here, e.g., dispatch to cart state
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProductCard
            product={product}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Cards;
