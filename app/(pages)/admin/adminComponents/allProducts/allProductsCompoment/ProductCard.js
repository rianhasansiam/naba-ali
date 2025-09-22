

import Image from 'next/image';
import { Star, MoreVertical, Tag, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onEdit, onDelete, isDeleting }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
  >
    <div className="relative">
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        {product.isNew && (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            New
          </span>
        )}
        {product.isOnSale && (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            On Sale
          </span>
        )}
      </div>
      <div className="absolute top-3 left-3">
        <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
          <Star className="text-yellow-500 fill-current" size={14} />
          <span className="text-sm font-medium ml-1">{product.rating}</span>
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>
      </div>
    </div>
    
    <div className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
          <div className="flex gap-2 items-center">
            <p className="text-gray-600 text-sm">{product.category}</p>
            <span className="text-gray-400">•</span>
            <p className="text-gray-600 text-sm">{product.style}</p>
          </div>
        </div>
        <div className="relative">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{product.description}</p>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-500 text-xs">Price</p>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-green-600">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
            )}
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Stock</p>
          <span className={`font-medium ${
            product.stock > 50 ? 'text-green-600' :
            product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {product?.stock || 0} units
          </span>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Color</p>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: product.color.toLowerCase() }}></div>
            <span className="font-medium text-gray-700">{product.color}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-500 text-xs mb-2">Available Sizes</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes && product.sizes.map((size, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
              {size}
            </span>
          ))}
        </div>
      </div>

      <div className="flex space-x-2">
        <button 
          onClick={() => onEdit?.(product)}
          disabled={isDeleting}
          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete?.(product)}
          disabled={isDeleting}
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          {isDeleting ? (
            <>
              <Loader className="animate-spin" size={14} />
              <span>Deleting...</span>
            </>
          ) : (
            'Delete'
          )}
        </button>
      </div>
    </div>
  </motion.div>
);

export default ProductCard;