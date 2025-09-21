

import Image from 'next/image';
import { Star, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => (
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
      <div className="absolute top-3 right-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          product.status === 'active' ? 'bg-green-100 text-green-800' :
          product.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {product.status === 'active' ? 'Active' : 
           product.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
        </span>
      </div>
      <div className="absolute top-3 left-3">
        <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
          <Star className="text-yellow-500 fill-current" size={14} />
          <span className="text-sm font-medium ml-1">{product.rating}</span>
        </div>
      </div>
    </div>
    
    <div className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.category}</p>
        </div>
        <div className="relative">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{product.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
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
          <span className={`font-bold ${
            product.stock > 50 ? 'text-green-600' :
            product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {product.stock} units
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-500 text-xs">Sold</p>
          <span className="font-bold text-gray-700">{product.sold} units</span>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Created</p>
          <span className="font-bold text-gray-700">{product.createdAt}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium transition-colors">
          Edit
        </button>
        <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium transition-colors">
          Delete
        </button>
      </div>
    </div>
  </motion.div>
);

export default ProductCard;