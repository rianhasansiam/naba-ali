'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, FolderOpen, Package } from 'lucide-react';

const AllCategory = () => {
  const [categories] = useState([
    { id: 1, name: 'T-Shirts', products: 45, description: 'Comfortable cotton t-shirts' },
    { id: 2, name: 'Jeans', products: 23, description: 'Premium denim jeans' },
    { id: 3, name: 'Shoes', products: 34, description: 'Footwear collection' },
    { id: 4, name: 'Dresses', products: 18, description: 'Elegant dresses' },
    { id: 5, name: 'Jackets', products: 12, description: 'Outerwear collection' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <FolderOpen className="text-gray-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
            </div>
            
            <p className="text-gray-600 mb-4">{category.description}</p>
            
            <div className="flex items-center space-x-2 mb-6">
              <Package className="text-gray-600" size={16} />
              <span className="text-sm text-gray-600">{category.products} products</span>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AllCategory;
