


import { motion } from 'framer-motion';
import { Eye, Edit, Trash2, Loader, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { PLACEHOLDER_IMAGES } from '@/lib/constants';

const ProductListItem = ({ product, onEdit, onDelete, onAddReview, isDeleting }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4"
  >
    <div className="flex items-center space-x-4">
      <Image
        src={product.image || PLACEHOLDER_IMAGES.PRODUCT_SMALL}
        alt={product.name}
        width={60}
        height={60}
        className="w-15 h-15 rounded-lg object-cover"
        unoptimized={true}
        onError={(e) => {
          e.target.src = PLACEHOLDER_IMAGES.PRODUCT_SMALL;
        }}
      />
      
      <div className="flex-1 grid grid-cols-6 gap-4 items-center">
        <div className="col-span-2">
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.category}</p>
        </div>
        
        <div>
          <p className="font-bold text-green-600">৳{product.price}</p>
          {product.originalPrice > product.price && (
            <p className="text-xs text-gray-400 line-through">৳{product.originalPrice}</p>
          )}
        </div>
        
        <div>
          <p className={`font-medium ${
            product.stock > 50 ? 'text-green-600' :
            product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {product?.stock || 0} Units
          </p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500">Rating</p>
          <p className="text-xs text-gray-500">★ {product?.rating || 0}</p>
        </div>
        
        <div className="flex space-x-2">
          <button 
            disabled={isDeleting}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => onEdit?.(product)}
            disabled={isDeleting}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit size={16} />
          </button>
          {/* <button 
            onClick={() => onAddReview?.(product)}
            disabled={isDeleting}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add Review"
          >
            <MessageSquare size={16} />
          </button> */}
          <button 
            onClick={() => onDelete?.(product)}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default ProductListItem;
