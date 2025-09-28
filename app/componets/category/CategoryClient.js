'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CategoryClient({ categories = [] }) {
  // Filter to show only active categories
  const activeCategories = categories.filter(category => 
    category.status === 'active' || !category.hasOwnProperty('status')
  );

  // Debug: Check for missing IDs
  if (process.env.NODE_ENV === 'development') {
    activeCategories.forEach((category, index) => {
      if (!category._id && !category.name) {
        console.warn(`CategoryClient: Category at index ${index} is missing both _id and name:`, category);
      }
    });
  }

  return (
    <div>
      {/* Section Header */}
      <div className="text-center my-12">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
          SHOP BY CATEGORY
        </h2>
        <p className="text-gray-600 text-lg">
          Explore our collection of fashion categories
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {activeCategories.map((category, index) => (
          <Link 
            key={category.id || category.name || index}
            href={`/allProducts?category=${encodeURIComponent(category.name)}`}
            className="group text-center"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-black transition-colors">
              <Image
                src={category.image}
                alt={category.name}
                width={96}
                height={96}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                unoptimized={category.image?.startsWith('http') && (category.image.includes('ibb.co') || category.image.includes('imagebb'))}
              />
            </div>
            <h3 className="font-semibold text-sm md:text-base text-black group-hover:text-gray-600 transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {category.description || 'Explore this category'}
            </p>
            {category.productCount !== undefined && (
              <p className="text-xs text-gray-400 mt-1">
                {category.productCount} items
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}