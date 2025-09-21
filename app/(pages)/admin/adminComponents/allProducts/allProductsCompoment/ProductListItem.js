


import { motion } from 'framer-motion';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

const ProductListItem = ({ product }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4"
  >
    <div className="flex items-center space-x-4">
      <Image
        src={product.image}
        alt={product.name}
        width={60}
        height={60}
        className="w-15 h-15 rounded-lg object-cover"
      />
      
      <div className="flex-1 grid grid-cols-6 gap-4 items-center">
        <div className="col-span-2">
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.category}</p>
        </div>
        
        <div>
          <p className="font-bold text-green-600">${product.price}</p>
          {product.originalPrice > product.price && (
            <p className="text-xs text-gray-400 line-through">${product.originalPrice}</p>
          )}
        </div>
        
        <div>
          <p className={`font-medium ${
            product.stock > 50 ? 'text-green-600' :
            product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {product.stock} units
          </p>
        </div>
        
        <div>
          <p className="font-medium text-gray-700">{product.sold} sold</p>
          <p className="text-xs text-gray-500">★ {product.rating}</p>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Eye size={16} />
          </button>
          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <Edit size={16} />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default ProductListItem;
