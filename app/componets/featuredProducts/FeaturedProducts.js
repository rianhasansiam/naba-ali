'use client';

import React, { useMemo } from 'react';
import FeaturedProductsClient from './FeaturedProductsClient';
import { PLACEHOLDER_IMAGES } from '@/lib/constants';

export default function FeaturedProducts({ productsData }) {
  // Select featured products from real data
  const featuredProducts = useMemo(() => {
    if (!Array.isArray(productsData)) return [];

    // Get the first 4 products or filter by featured flag if it exists
    return productsData
      .filter(product => product.featured === true || productsData.indexOf(product) < 4)
      .slice(0, 4)
      .map(product => ({
        _id: product.id || product._id,
        id: product.id || product._id,
        name: product.name || product.title || `Product ${product.id || product._id}`,
        category: product.category || 'Fashion',
        style: product.style || 'Casual',
        price: product.price || product.discountPrice || 99,
        originalPrice: product.originalPrice && product.originalPrice > product.price ? product.originalPrice : null,
        primaryImage: product.primaryImage || product.image || product.images?.[0] || PLACEHOLDER_IMAGES.PRODUCT_LARGE,
        image: product.image || product.images?.[0] || PLACEHOLDER_IMAGES.PRODUCT_LARGE,
        rating: product.rating || 4.5,
        reviews: product.reviews || product.reviewCount || Math.floor(Math.random() * 50) + 10,
        isNew: product.isNew || false,
        isOnSale: product.originalPrice > product.price,
        color: product.color || product.colors?.[0] || 'Black',
        sizes: product.sizes || ['S', 'M', 'L', 'XL'],
        description: product.shortDescription || product.description || `High-quality ${product.category || 'product'} with premium materials.`
      }));
  }, [productsData]);

  // Empty state
  if (featuredProducts.length === 0) {
    return (
      <section className="pt-10 bg-white">
        <div className="container mx-auto px-4 xl:px-0 max-w-frame">
          <div className="text-center py-16">
            <p className="text-gray-600">No featured products available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-10 bg-white">
      <div className="container mx-auto px-4 xl:px-0 max-w-frame">
        <FeaturedProductsClient products={featuredProducts} />
      </div>
    </section>
  );
}
