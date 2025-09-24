'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../shared/ProductCard';

const CardsClient = memo(({ products = [] }) => {
  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product._id || product.id || `product-card-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
});

CardsClient.displayName = 'CardsClient';

export default CardsClient;
