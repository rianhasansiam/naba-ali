'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

const GlobalLoadingPage = ({ 
  message = 'Loading...', 
  showLogo = true,
  variant = 'default'
}) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  if (variant === 'minimal') {
    return (
      <motion.div
        className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" variant="spin" />
          <motion.p
            className="text-gray-600 font-medium"
            variants={textVariants}
          >
            {message}
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-50 flex items-center justify-center"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-blue-300 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-purple-300 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 border-2 border-pink-300 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 border-2 border-indigo-300 rounded-full"></div>
      </div>

      <div className="text-center space-y-8">
        {showLogo && (
          <motion.div
            variants={logoVariants}
            animate="animate"
            initial="initial"
            className="flex justify-center"
          >
            <motion.div
              animate={floatingAnimation}
              className="relative"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white text-2xl font-bold">NA</span>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 -z-10"></div>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          variants={textVariants}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-800">
            NABA ALI
          </h2>
          <p className="text-gray-600 font-medium">
            Premium Fashion Store
          </p>
        </motion.div>

        <motion.div
          variants={textVariants}
          className="flex flex-col items-center space-y-6"
        >
          <LoadingSpinner size="lg" variant="spin" />
          
          <motion.p
            className="text-gray-500"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {message}
          </motion.p>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GlobalLoadingPage;