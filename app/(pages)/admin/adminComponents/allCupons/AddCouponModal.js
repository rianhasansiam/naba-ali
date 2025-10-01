'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  AlertCircle, 
  Ticket,
  Calendar,
  Percent,
  DollarSign,
  Users,
  FileText
} from 'lucide-react';
import { useAddData } from '../../../../../lib/hooks/useAddData';

const AddCouponModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    type: 'percentage',
    description: '',
    minAmount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    status: 'active'
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const { addData, isLoading } = useAddData({
    name: 'allCoupons',
    api: '/api/coupons'
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        code: '',
        discount: '',
        type: 'percentage',
        description: '',
        minAmount: '',
        usageLimit: '',
        startDate: '',
        endDate: '',
        status: 'active'
      });
      setFormErrors({});
      setSubmitAttempted(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.code.trim()) errors.code = 'Coupon code is required';
    else if (formData.code.length < 3) errors.code = 'Coupon code must be at least 3 characters';
    else if (!/^[A-Z0-9]+$/.test(formData.code)) errors.code = 'Use only uppercase letters and numbers';
    
    if (!formData.discount) errors.discount = 'Discount value is required';
    else if (isNaN(formData.discount) || formData.discount <= 0) errors.discount = 'Discount must be a positive number';
    else if (formData.type === 'percentage' && formData.discount > 100) errors.discount = 'Percentage discount cannot exceed 100%';
    
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    if (!formData.minAmount) errors.minAmount = 'Minimum amount is required';
    else if (isNaN(formData.minAmount) || formData.minAmount < 0) errors.minAmount = 'Minimum amount must be a valid number';
    
    if (!formData.usageLimit) errors.usageLimit = 'Usage limit is required';
    else if (isNaN(formData.usageLimit) || formData.usageLimit <= 0) errors.usageLimit = 'Usage limit must be a positive number';
    
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';
    else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      try {
        const couponData = {
          ...formData,
          code: formData.code.toUpperCase(),
          discount: parseFloat(formData.discount),
          minAmount: parseFloat(formData.minAmount),
          usageLimit: parseInt(formData.usageLimit),
          used: 0
        };

        await addData(couponData);
        onClose();
      } catch (error) {
        console.error('Error creating coupon:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-700 to-black p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Ticket size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Create New Coupon</h2>
                  <p className="text-gray-200">Add a new promotional coupon</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Ticket size={16} className="inline mr-1" />
                    Coupon Code*
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g., WELCOME20"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.code ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200/60 focus:border-gray-500 focus:ring-gray-500/20'
                    } focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-white/80 backdrop-blur-sm`}
                  />
                  {formErrors.code && submitAttempted && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.code}
                    </p>
                  )}
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type*
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-white/80 backdrop-blur-sm"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === 'percentage' ? (
                      <><Percent size={16} className="inline mr-1" />Discount Percentage*</>
                    ) : (
                      <><DollarSign size={16} className="inline mr-1" />Discount Amount*</>
                    )}
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder={formData.type === 'percentage' ? '20' : '50'}
                    min="0"
                    max={formData.type === 'percentage' ? '100' : undefined}
                    step="0.01"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.discount ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20'
                    } focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-white/80 backdrop-blur-sm`}
                  />
                  {formErrors.discount && submitAttempted && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.discount}
                    </p>
                  )}
                </div>

                {/* Minimum Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign size={16} className="inline mr-1" />
                    Minimum Amount*
                  </label>
                  <input
                    type="number"
                    name="minAmount"
                    value={formData.minAmount}
                    onChange={handleChange}
                    placeholder="50"
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.minAmount ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20'
                    } focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-white/80 backdrop-blur-sm`}
                  />
                  {formErrors.minAmount && submitAttempted && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.minAmount}
                    </p>
                  )}
                </div>

                {/* Usage Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users size={16} className="inline mr-1" />
                    Usage Limit*
                  </label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    placeholder="100"
                    min="1"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.usageLimit ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20'
                    } focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-white/80 backdrop-blur-sm`}
                  />
                  {formErrors.usageLimit && submitAttempted && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.usageLimit}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status*
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-white/80 backdrop-blur-sm"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Start Date*
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.startDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20'
                    } focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-white/80 backdrop-blur-sm`}
                  />
                  {formErrors.startDate && submitAttempted && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.startDate}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    End Date*
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.endDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20'
                    } focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-white/80 backdrop-blur-sm`}
                  />
                  {formErrors.endDate && submitAttempted && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="inline mr-1" />
                  Description*
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe when and how this coupon should be used..."
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20'
                  } focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-white/80 backdrop-blur-sm resize-none`}
                />
                {formErrors.description && submitAttempted && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-700 to-black text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddCouponModal;