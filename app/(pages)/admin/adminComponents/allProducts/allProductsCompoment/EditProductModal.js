'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload, Check, AlertCircle, Loader, Plus, Minus, Tag, Palette, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUpdateData } from '@/lib/hooks/useUpdateData';
import { uploadToImageBB } from '@/lib/imagebb';
import Image from 'next/image';

const EditProductModal = ({ isOpen, onClose, categories, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    style: '',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    images: [],
    colors: [],
    sizes: []
  });
  
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [availableSizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  const [availableStyles] = useState(['Casual', 'Formal', 'Business', 'Sport', 'Elegant', 'Trendy']);
  const [availableColors] = useState([
    { name: 'Red', value: 'Red', bg: 'bg-red-500', border: 'border-red-500' },
    { name: 'Blue', value: 'Blue', bg: 'bg-blue-500', border: 'border-blue-500' },
    { name: 'Green', value: 'Green', bg: 'bg-green-500', border: 'border-green-500' },
    { name: 'Black', value: 'Black', bg: 'bg-black', border: 'border-black' },
    { name: 'White', value: 'White', bg: 'bg-white', border: 'border-gray-300' },
    { name: 'Gray', value: 'Gray', bg: 'bg-gray-500', border: 'border-gray-500' },
    { name: 'Navy', value: 'Navy', bg: 'bg-gray-800', border: 'border-gray-800' },
    { name: 'Brown', value: 'Brown', bg: 'bg-amber-700', border: 'border-amber-700' },
    { name: 'Pink', value: 'Pink', bg: 'bg-pink-500', border: 'border-pink-500' },
    { name: 'Purple', value: 'Purple', bg: 'bg-purple-500', border: 'border-purple-500' }
  ]);
  const fileInputRef = useRef(null);
  
  // Initialize the useUpdateData hook
  const { updateData, isLoading, error } = useUpdateData({
    name: 'allProducts',
    api: '/api/products'
  });

  // Populate form when product prop changes
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        style: product.style || '',
        price: product.price?.toString() || '',
        originalPrice: product.originalPrice?.toString() || '',
        stock: product.stock?.toString() || '',
        description: product.description || '',
        images: product.images || [product.image] || [],
        colors: product.colors || [product.color] || [],
        sizes: product.sizes || []
      });
      
      // Set existing image previews
      if (product.images) {
        setImagePreviews(product.images);
      } else if (product.image) {
        setImagePreviews([product.image]);
      }
    }
  }, [product, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        category: '',
        style: '',
        price: '',
        originalPrice: '',
        stock: '',
        description: '',
        images: [],
        colors: [],
        sizes: []
      });
      setImagePreviews([]);
      setFormErrors({});
      setSubmitAttempted(false);
      setSuccessMessage('');
      setImageUploading(false);
      setSelectedFiles([]);
    }
  }, [isOpen]);

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.style) errors.style = 'Style is required';
    if (!formData.price) errors.price = 'Price is required';
    if (!formData.stock) errors.stock = 'Stock quantity is required';
    if (formData.colors.length === 0) errors.colors = 'At least one color is required';
    if (formData.sizes.length === 0) errors.sizes = 'At least one size is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (formData.images.length === 0 && selectedFiles.length === 0 && imagePreviews.length === 0) {
      errors.images = 'At least one product image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    if (!validateForm()) return;
    
    try {
      let imageUrls = [...formData.images];
      
      // Upload new files if any
      if (selectedFiles.length > 0) {
        setImageUploading(true);
        try {
          const uploadedUrls = await Promise.all(
            selectedFiles.map(file => uploadToImageBB(file))
          );
          imageUrls = [...imageUrls, ...uploadedUrls];
        } catch (error) {
          setFormErrors(prev => ({ ...prev, images: error.message }));
          setImageUploading(false);
          return;
        }
        setImageUploading(false);
      }
      
      // Prepare product data
      const productData = {
        ...formData,
        images: imageUrls,
        image: imageUrls[0], // Keep backward compatibility
        colors: formData.colors,
        color: formData.colors[0], // Keep backward compatibility
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock),
      };
      
      await updateData({ id: product._id, data: productData });
      setSuccessMessage('Product updated successfully!');
      
      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error updating product:', err);
      setImageUploading(false);
    }
  };

  // Handle size selection
  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
    
    if (formErrors.sizes) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.sizes;
        return newErrors;
      });
    }
  };

  // Handle color selection
  const handleColorToggle = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
    
    if (formErrors.colors) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.colors;
        return newErrors;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files?.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      // Create previews for new files
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => setImagePreviews(prev => [...prev, reader.result]);
        reader.readAsDataURL(file);
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files?.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => setImagePreviews(prev => [...prev, reader.result]);
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove individual image
  const removeImage = (index) => {
    const isExistingImage = index < formData.images.length;
    
    if (isExistingImage) {
      // Remove from existing images
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      // Remove from new files
      const newFileIndex = index - formData.images.length;
      setSelectedFiles(prev => prev.filter((_, i) => i !== newFileIndex));
    }
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden backdrop-blur-sm flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-w-3xl w-full max-h-[90vh] flex flex-col relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-indigo-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
              <p className="text-sm text-gray-600 mt-1">Update product information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
            >
              <Check className="text-green-600" size={20} />
              <span className="text-green-700 font-medium">{successMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter product name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      formErrors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">
                      {!categories ? 'Loading categories...' : 
                       categories.length === 0 ? 'No categories available - Create one first' : 
                       'Select a category'}
                    </option>
                    {categories?.filter(category => category.status === 'active' || !category.status)?.map((category) => (
                      <option key={category._id || category.id || category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {formErrors.category}
                    </p>
                  )}
                  {categories && categories.length === 0 && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700 mb-2">
                        No categories found. You need to create categories first.
                      </p>
                      <p className="text-xs text-blue-600">
                        💡 Go to Category Management → Add New Category to create your first category
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Style and Prices */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style *
                  </label>
                  <select
                    name="style"
                    value={formData.style}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      formErrors.style ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Style</option>
                    {availableStyles.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                  {formErrors.style && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {formErrors.style}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price * 
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        formErrors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      formErrors.stock ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {formErrors.stock && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {formErrors.stock}
                    </p>
                  )}
                </div>
                <div></div>
                <div></div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                    formErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter product description..."
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Upload className="inline mr-2" size={16} />
                  Product Images *
                </label>
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                    formErrors.images ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}
                >
                  <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-gray-600 mb-2">Drag & drop images here, or click to browse</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    Choose Files
                  </button>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG up to 10MB each</p>
                </div>
                {formErrors.images && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.images}
                  </p>
                )}
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Palette className="inline mr-2" size={16} />
                  Available Colors *
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleColorToggle(color.value)}
                      className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${
                        formData.colors.includes(color.value)
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${color.bg} border ${color.border}`}></div>
                      <span className="text-sm font-medium">{color.name}</span>
                    </button>
                  ))}
                </div>
                {formErrors.colors && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.colors}
                  </p>
                )}
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Tag className="inline mr-2" size={16} />
                  Available Sizes *
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                        formData.sizes.includes(size)
                          ? 'border-indigo-500 bg-indigo-500 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {formErrors.sizes && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.sizes}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading || imageUploading}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading || imageUploading ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    {imageUploading ? 'Uploading...' : 'Updating...'}
                  </>
                ) : (
                  'Update Product'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EditProductModal;