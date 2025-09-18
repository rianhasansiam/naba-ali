'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  TrendingUp,
  Package,
  DollarSign,
  Grid,
  List,
  MoreVertical,
  Download,
  Upload
} from 'lucide-react';

const AllProducts = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Demo products data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Premium Cotton T-Shirt',
      category: 'T-Shirts',
      price: 49.99,
      originalPrice: 59.99,
      stock: 145,
      sold: 234,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      status: 'active',
      createdAt: '2025-09-15',
      description: 'High-quality cotton t-shirt with modern fit'
    },
    {
      id: 2,
      name: 'Designer Jeans',
      category: 'Jeans',
      price: 129.99,
      originalPrice: 149.99,
      stock: 67,
      sold: 156,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
      status: 'active',
      createdAt: '2025-09-14',
      description: 'Premium denim with perfect fit and style'
    },
    {
      id: 3,
      name: 'Casual Sneakers',
      category: 'Shoes',
      price: 99.99,
      originalPrice: 119.99,
      stock: 23,
      sold: 89,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
      status: 'low-stock',
      createdAt: '2025-09-13',
      description: 'Comfortable sneakers for everyday wear'
    },
    {
      id: 4,
      name: 'Summer Dress',
      category: 'Dresses',
      price: 79.99,
      originalPrice: 89.99,
      stock: 0,
      sold: 78,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop',
      status: 'out-of-stock',
      createdAt: '2025-09-12',
      description: 'Light and breezy summer dress'
    },
    {
      id: 5,
      name: 'Leather Jacket',
      category: 'Jackets',
      price: 249.99,
      originalPrice: 299.99,
      stock: 34,
      sold: 45,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
      status: 'active',
      createdAt: '2025-09-11',
      description: 'Premium leather jacket with modern style'
    },
    {
      id: 6,
      name: 'Formal Shirt',
      category: 'Shirts',
      price: 69.99,
      originalPrice: 79.99,
      stock: 89,
      sold: 67,
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop',
      status: 'active',
      createdAt: '2025-09-10',
      description: 'Professional formal shirt for business'
    }
  ]);

  const categories = ['all', 'T-Shirts', 'Jeans', 'Shoes', 'Dresses', 'Jackets', 'Shirts'];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
            product.status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {product.status === 'active' ? 'Active' : 
             product.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
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
            <p className="text-gray-500 text-xs">Revenue</p>
            <span className="font-bold text-gray-800">${(product.sold * product.price).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-black transition-colors flex items-center justify-center space-x-2">
            <Eye size={16} />
            <span>View</span>
          </button>
          <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );

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
            <div className="flex items-center">
              <Star className="text-yellow-500 fill-current" size={12} />
              <span className="text-xs ml-1">{product.rating}</span>
            </div>
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

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.status === 'low-stock').length,
    outOfStock: products.filter(p => p.status === 'out-of-stock').length,
    totalRevenue: products.reduce((sum, p) => sum + (p.sold * p.price), 0),
    totalSold: products.reduce((sum, p) => sum + p.sold, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600">Manage your product inventory and listings</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Upload size={16} />
            <span>Import</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors">
            <Download size={16} />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Package className="text-gray-700" size={20} />
            <span className="text-sm text-gray-600">Total Products</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Package className="text-yellow-600" size={20} />
            <span className="text-sm text-gray-600">Low Stock</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.lowStock}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Package className="text-red-600" size={20} />
            <span className="text-sm text-gray-600">Out of Stock</span>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.outOfStock}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <DollarSign className="text-gray-700" size={20} />
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">${stats.totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-gray-700" size={20} />
            <span className="text-sm text-gray-600">Units Sold</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalSold}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent w-full lg:w-64"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
      }`}>
        {filteredProducts.map(product => 
          viewMode === 'grid' ? (
            <ProductCard key={product.id} product={product} />
          ) : (
            <ProductListItem key={product.id} product={product} />
          )
        )}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
