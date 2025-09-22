'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2, Loader2 } from 'lucide-react';

const DeleteConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  couponCode, 
  isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Delete Coupon</h2>
                  <p className="text-red-100">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="text-red-600" size={32} />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Coupon &quot;{couponCode}&quot;?
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                Are you sure you want to delete this coupon? This will permanently remove 
                the coupon and all associated data. Customers will no longer be able to use 
                this coupon code.
              </p>
            </div>

            {/* Warning Box */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-red-800 text-sm font-medium mb-1">
                    Warning: This action is irreversible
                  </p>
                  <ul className="text-red-700 text-xs space-y-1">
                    <li>• The coupon code will be permanently deleted</li>
                    <li>• Usage statistics will be lost</li>
                    <li>• Active customer carts using this coupon will be affected</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete Coupon</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteConfirmationDialog;