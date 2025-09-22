'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  TrendingUp,
  Package,
  DollarSign,
  Grid,
  List,
  Download,
  Upload,
  AlertCircle
} from 'lucide-react';
import ProductCard from './allProductsCompoment/ProductCard';
import ProductListItem from './allProductsCompoment/ProductListItem';
import AddProductModal from './allProductsCompoment/AddProductModal';
import EditProductModal from './allProductsCompoment/EditProductModal';
import DeleteConfirmationDialog from './allProductsCompoment/DeleteConfirmationDialog';
import Toast from './allProductsCompoment/Toast';
import { useGetData } from '../../../../../lib/hooks/useGetData';
import { useUpdateData } from '../../../../../lib/hooks/useUpdateData';
import { useDeleteData } from '../../../../../lib/hooks/useDeleteData';


const AllProductsClient = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  // Fetch products data using hook
  const { data, isLoading, error } = useGetData({
    name: 'allProducts',
    api: '/api/products'
  });

  // Fetch categories data using hook
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetData({
    name: 'allCategories',
    api: '/api/categories'
  });

  // Initialize update and delete hooks
  const { updateData, isLoading: isUpdating } = useUpdateData({
    name: 'allProducts',
    api: '/api/products'
  });

  const { deleteData, isLoading: isDeleting } = useDeleteData({
    name: 'allProducts',
    api: '/api/products'
  });


  console.log(data);

  // Handler functions
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      setDeletingProductId(selectedProduct._id);
      try {
        await deleteData(selectedProduct._id);
        setShowDeleteModal(false);
        setSelectedProduct(null);
        setToast({
          show: true,
          type: 'success',
          message: `Product "${selectedProduct.name}" deleted successfully!`
        });
      } catch (error) {
        console.error('Delete failed:', error);
        setToast({
          show: true,
          type: 'error',
          message: 'Failed to delete product. Please try again.'
        });
      } finally {
        setDeletingProductId(null);
      }
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {  // Prevent closing during delete operation
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-red-500">
        <AlertCircle size={48} />
        <h2 className="text-xl font-semibold mt-4">Error loading products</h2>
        <p>{error.message || 'Something went wrong'}</p>
      </div>
    );
  }

  // Process the data once it's loaded
  const productsData = data 
  
  // Extract categories from database and add 'all' option
  const dbCategories = categoriesData?.Data || [];
  const categories = ['all', ...dbCategories];

  // Filter products based on search term and category
  const filteredProducts = data?.Data?.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  // Calculate stats from filtered products
  const stats = {
    total: filteredProducts.length || 0,
    totalValue: filteredProducts.reduce((sum, product) => sum + (product.price || 0), 0),
    categories: new Set(filteredProducts.map(product => product.category)).size,
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Package className="text-gray-700" size={20} />
            <span className="text-sm text-gray-600">Total Products</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
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
              {categories.map(category => {
                if (category === 'all') {
                  return (
                    <option key="all" value="all">
                      All Categories
                    </option>
                  );
                }
                return (
                  <option key={category._id || category.name} value={category.name}>
                    {category.name}
                  </option>
                );
              })}
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
        {data?.map(product => 
          viewMode === 'grid' ? (
            <ProductCard 
              key={product._id || product.id} 
              product={product} 
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              isDeleting={deletingProductId === product._id}
            />
          ) : (
            <ProductListItem 
              key={product._id || product.id} 
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              isDeleting={deletingProductId === product._id}
            />
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

      {/* Add Product Modal */}
      <AddProductModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={dbCategories}
      />

      {/* Edit Product Modal */}
      <EditProductModal 
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        product={selectedProduct}
        categories={dbCategories}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        productName={selectedProduct?.name}
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
  );
};

export default AllProductsClient;