'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ type, message, isVisible, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => onClose(), 300); // Wait for animation to complete
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle size={20} />,
          bgColor: 'bg-green-600',
          borderColor: 'border-green-600',
          textColor: 'text-white'
        };
      case 'error':
        return {
          icon: <XCircle size={20} />,
          bgColor: 'bg-red-600',
          borderColor: 'border-red-600',
          textColor: 'text-white'
        };
      case 'warning':
        return {
          icon: <AlertCircle size={20} />,
          bgColor: 'bg-yellow-600',
          borderColor: 'border-yellow-600',
          textColor: 'text-white'
        };
      default:
        return {
          icon: <AlertCircle size={20} />,
          bgColor: 'bg-blue-600',
          borderColor: 'border-blue-600',
          textColor: 'text-white'
        };
    }
  };

  const config = getToastConfig();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.95 }}
          className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50"
        >
          <div className={`${config.bgColor} ${config.borderColor} ${config.textColor} rounded-xl shadow-2xl border backdrop-blur-sm p-3 sm:p-4 min-w-0 sm:min-w-[300px] max-w-md`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {config.icon}
                </div>
                <p className="font-medium text-sm leading-relaxed">
                  {message}
                </p>
              </div>
              <button
                onClick={() => {
                  setShow(false);
                  setTimeout(() => onClose(), 300);
                }}
                className="flex-shrink-0 ml-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
