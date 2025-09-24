'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '../shared/ProductCard';

const FeaturedProductsClient = memo(({ products = [] }) => {
  const featuredProducts = React.useMemo(() => 
    products.slice(0, 8), 
    [products]
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Featured Products
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Discover our handpicked selection of premium products.
          </motion.p>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product._id || product.id || `featured-product-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard 
                  product={product}
                  variant="featured"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No featured products available</p>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/allProducts">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 group"
            >
              <span className="mr-2">View All Products</span>
              <FiArrowRight 
                className="group-hover:translate-x-1 transition-transform duration-200" 
                size={18} 
              />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

FeaturedProductsClient.displayName = 'FeaturedProductsClient';

export default FeaturedProductsClient;