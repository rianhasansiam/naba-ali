'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload, Check, AlertCircle, Loader, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUpdateData } from '@/lib/hooks/useUpdateData';
import { uploadToImageBB } from '@/lib/imagebb';
import Image from 'next/image';

const EditCategoryModal = ({ isOpen, onClose, category }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'active'
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // Initialize the useUpdateData hook
  const { updateData, isLoading, error } = useUpdateData({
    name: 'allCategories',
    api: '/api/categories'
  });

  // Populate form when category prop changes
  useEffect(() => {
    if (category && isOpen) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
        status: category.status || 'active'
      });
      
      // Set existing image preview
      if (category.image) {
        setImagePreview(category.image);
      }
    }
  }, [category, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        description: '',
        image: '',
        status: 'active'
      });
      setImagePreview('');
      setFormErrors({});
      setSubmitAttempted(false);
      setSuccessMessage('');
      setImageUploading(false);
      setSelectedFile(null);
    }
  }, [isOpen]);

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Category name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    if (!validateForm()) return;
    
    try {
      let imageUrl = formData.image;
      
      // Upload new file if selected
      if (selectedFile) {
        setImageUploading(true);
        try {
          imageUrl = await uploadToImageBB(selectedFile);
        } catch (error) {
          setFormErrors(prev => ({ ...prev, image: error.message }));
          setImageUploading(false);
          return;
        }
        setImageUploading(false);
      }
      
      // Prepare category data
      const categoryData = {
        ...formData,
        image: imageUrl,
        updatedAt: new Date()
      };
      
      await updateData({ id: category._id, data: categoryData });
      setSuccessMessage('Category updated successfully!');
      
      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error updating category:', err);
      setImageUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files?.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      
      // Clear image error
      if (formErrors.image) {
        setFormErrors(prev => {
          const newErrors = {...prev};
          delete newErrors.image;
          return newErrors;
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear field error
      if (formErrors[name]) {
        setFormErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[name];
          return newErrors;
        });
      }
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
      const file = files[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
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
          className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] flex flex-col relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Category</h2>
              <p className="text-sm text-gray-600 mt-1">Update category information</p>
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter category name"
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
                    placeholder="Enter category description..."
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <ImageIcon className="inline mr-2" size={16} />
                  Category Image
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4">
                    <div className="relative inline-block">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={200}
                        height={150}
                        className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                    formErrors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <ImageIcon className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-gray-600 mb-2">Drag & drop an image here, or click to browse</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Choose File
                  </button>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG up to 10MB</p>
                </div>
                {formErrors.image && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.image}
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
                  'Update Category'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EditCategoryModal;