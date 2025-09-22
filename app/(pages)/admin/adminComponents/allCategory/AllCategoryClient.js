'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  FolderOpen, 
  Package, 
  Search,
  Grid,
  List,
  TrendingUp,
  AlertCircle,
  Eye,
  Loader,
  Image as ImageIcon,
  Filter,
  SlidersHorizontal,
  BarChart3,
  Users,
  Activity,
  Star,
  Calendar,
  Tag,
  X
} from 'lucide-react';
import { useGetData } from '../../../../../lib/hooks/useGetData';
import { useUpdateData } from '../../../../../lib/hooks/useUpdateData';
import { useDeleteData } from '../../../../../lib/hooks/useDeleteData';
import AddCategoryModal from './categoryComponents/AddCategoryModal';
import EditCategoryModal from './categoryComponents/EditCategoryModal';
import DeleteConfirmationDialog from './categoryComponents/DeleteConfirmationDialog';
import Toast from '../allProducts/allProductsCompoment/Toast';
import Image from 'next/image';

const AllCategoryClient = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  // Fetch categories data using hook
  const { data, isLoading, error } = useGetData({
    name: 'allCategories',
    api: '/api/categories'
  });

  // Initialize update and delete hooks
  const { updateData, isLoading: isUpdating } = useUpdateData({
    name: 'allCategories',
    api: '/api/categories'
  });

  const { deleteData, isLoading: isDeleting } = useDeleteData({
    name: 'allCategories',
    api: '/api/categories'
  });

  // Filter categories based on search
  const filteredCategories = data?.Data?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Handler functions
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategory) {
      setDeletingCategoryId(selectedCategory._id);
      try {
        await deleteData(selectedCategory._id);
        setShowDeleteModal(false);
        setSelectedCategory(null);
        setToast({
          show: true,
          type: 'success',
          message: `Category "${selectedCategory.name}" deleted successfully!`
        });
      } catch (error) {
        console.error('Delete failed:', error);
        setToast({
          show: true,
          type: 'error',
          message: 'Failed to delete category. Please try again.'
        });
      } finally {
        setDeletingCategoryId(null);
      }
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCategory(null);
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  // Statistics
  const stats = {
    totalCategories: filteredCategories.length,
    activeCategories: filteredCategories.filter(cat => cat.status !== 'inactive').length,
    inactiveCategories: filteredCategories.filter(cat => cat.status === 'inactive').length
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 to-black flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 to-black flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-xl text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading categories</h2>
          <p className="text-gray-600">{error.message || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Modern Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-600 via-gray-600 to-gray-600 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500/90 via-gray-500/90 to-gray-500/90 rounded-3xl backdrop-blur-sm"></div>
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                  <BarChart3 className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Categories</h1>
                  <p className="text-blue-100 text-lg">Manage your product categories with ease</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-blue-100">
                      <Calendar size={16} />
                      <span className="text-sm">Updated today</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-100">
                      <Activity size={16} />
                      <span className="text-sm">Active system</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <motion.button 
                  onClick={() => setShowAddModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg font-semibold"
                >
                  <Plus size={20} />
                  <span>New Category</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <FolderOpen className="text-white" size={24} />
              </div>
              <div className="text-right">
                <p className="text-blue-600 text-sm font-medium uppercase tracking-wide">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCategories}</p>
              </div>
            </div>
            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-full"></div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div className="text-right">
                <p className="text-emerald-600 text-sm font-medium uppercase tracking-wide">Active</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeCategories}</p>
              </div>
            </div>
            <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${stats.totalCategories > 0 ? (stats.activeCategories / stats.totalCategories) * 100 : 0}%` }}
              ></div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group bg-gradient-to-br from-white to-red-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <AlertCircle className="text-white" size={24} />
              </div>
              <div className="text-right">
                <p className="text-red-600 text-sm font-medium uppercase tracking-wide">Inactive</p>
                <p className="text-3xl font-bold text-gray-900">{stats.inactiveCategories}</p>
              </div>
            </div>
            <div className="h-2 bg-red-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full transition-all duration-700"
                style={{ width: `${stats.totalCategories > 0 ? (stats.inactiveCategories / stats.totalCategories) * 100 : 0}%` }}
              ></div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="group bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Star className="text-white" size={24} />
              </div>
              <div className="text-right">
                <p className="text-purple-600 text-sm font-medium uppercase tracking-wide">Popular</p>
                <p className="text-3xl font-bold text-gray-900">{Math.floor(stats.totalCategories * 0.7)}</p>
              </div>
            </div>
            <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full w-4/5 transition-all duration-700"></div>
            </div>
          </motion.div>
        </div>

        {/* Modern Controls & Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Enhanced Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white w-full sm:w-80 transition-all duration-300 text-gray-900 placeholder-gray-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              
              {/* Filter Button */}
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700">
                <SlidersHorizontal size={18} />
                <span className="font-medium">Filters</span>
              </button>
            </div>
            
            {/* Enhanced View Toggle & Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid size={16} />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={16} />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-xl">
                <Package size={16} className="text-blue-600" />
                <span className="text-blue-900 font-medium">{filteredCategories.length} Categories</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Display */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-8">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCategories.map((category, index) => (
                <CategoryCard 
                  key={category._id} 
                  category={category} 
                  index={index}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                  isDeleting={deletingCategoryId === category._id}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <CategoryListItem 
                  key={category._id} 
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                  isDeleting={deletingCategoryId === category._id}
                />
              ))}
            </div>
          )}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl inline-block mb-6">
              <FolderOpen className="mx-auto text-blue-400 mb-4" size={64} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No categories found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm ? 
                "No categories match your search. Try different keywords or create a new category." :
                "You haven't created any categories yet. Start by adding your first category."
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus size={20} />
              <span>Create First Category</span>
            </button>
          </motion.div>
        )}

      {/* Modals */}
      <AddCategoryModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <EditCategoryModal 
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        category={selectedCategory}
      />

      <DeleteConfirmationDialog 
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        categoryName={selectedCategory?.name}
        isLoading={isDeleting}
      />

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
      </div>
    </div>
  );
};

// Modern Category Card Component
const CategoryCard = ({ category, index, onEdit, onDelete, isDeleting }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      delay: index * 0.05,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/50"
  >
    {/* Background Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    {/* Image Section */}
    <div className="relative h-48 overflow-hidden">
      {category.image ? (
        <Image
          src={category.image}
          alt={category.name}
          width={400}
          height={200}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30"></div>
          <div className="relative p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm">
            <Tag className="text-blue-500 mx-auto" size={40} />
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-blue-200/50 rounded-full"></div>
          <div className="absolute bottom-6 left-6 w-12 h-12 bg-purple-200/30 rounded-full"></div>
          <div className="absolute top-1/2 left-8 w-6 h-6 bg-indigo-200/40 rounded-full"></div>
        </div>
      )}
      
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border ${
            category.status === 'active' 
              ? 'bg-emerald-100/90 text-emerald-700 border-emerald-200/50' 
              : 'bg-red-100/90 text-red-700 border-red-200/50'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${
            category.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
          }`}></div>
          {category.status || 'active'}
        </motion.span>
      </div>

      {/* Hover overlay with quick actions */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-gray-700 hover:text-blue-600 transition-colors">
            <Eye size={16} />
          </button>
          <button 
            onClick={() => onEdit?.(category)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Edit3 size={16} />
          </button>
        </div>
      </div>
    </div>
    
    {/* Content Section */}
    <div className="relative p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {category.description || 'No description available'}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Package size={14} />
            <span className="font-medium">{category.productCount || 0}</span>
            <span className="text-gray-500">products</span>
          </div>
          {category.createdAt && (
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar size={14} />
              <span>{new Date(category.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{category.description}</p>
      
      <div className="flex items-center space-x-2 mb-6">
        <Package className="text-gray-400" size={16} />
        <span className="text-sm text-gray-600">{category.productCount || 0} products</span>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button 
          onClick={() => onEdit?.(category)}
          disabled={isDeleting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-600 py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium border border-blue-100/50"
        >
          <Edit3 size={16} />
          <span>Edit</span>
        </motion.button>
        <motion.button 
          onClick={() => onDelete?.(category)}
          disabled={isDeleting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-red-600 py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border border-red-100/50"
        >
          {isDeleting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader size={16} />
            </motion.div>
          ) : (
            <Trash2 size={16} />
          )}
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// Modern Category List Item Component
const CategoryListItem = ({ category, onEdit, onDelete, isDeleting }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ x: 4 }}
    className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/20 overflow-hidden"
  >
    {/* Background gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-purple-50/10 to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="relative flex items-center gap-6">
      {/* Enhanced Image */}
      <div className="relative">
        {category.image ? (
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={category.image}
              alt={category.name}
              width={80}
              height={80}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30"></div>
            <Tag className="text-blue-500 relative z-10" size={28} />
            <div className="absolute top-1 right-1 w-3 h-3 bg-blue-200/50 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-purple-200/50 rounded-full"></div>
          </div>
        )}
        
        {/* Status indicator */}
        <div className="absolute -top-1 -right-1">
          <div className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ${
            category.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'
          }`}></div>
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        {/* Name & Description */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-1 leading-relaxed">
            {category.description || 'No description available'}
          </p>
        </div>
        
        {/* Products Count */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Package className="text-blue-600" size={16} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Products</p>
            <p className="font-bold text-gray-900">{category.productCount || 0}</p>
          </div>
        </div>
        
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
            category.status === 'active' 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              category.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
            }`}></div>
            {(category.status || 'active').toUpperCase()}
          </span>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 justify-end">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
          >
            <Eye size={16} />
          </motion.button>
          <motion.button 
            onClick={() => onEdit?.(category)}
            disabled={isDeleting}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            <Edit3 size={16} />
          </motion.button>
          <motion.button 
            onClick={() => onDelete?.(category)}
            disabled={isDeleting}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            {isDeleting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader size={16} />
              </motion.div>
            ) : (
              <Trash2 size={16} />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default AllCategoryClient;
