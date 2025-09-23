'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CategoryClient({ categories = [] }) {

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
          SHOP BY CATEGORY
        </h2>
        <p className="text-gray-600 text-lg">
          Explore our collection of fashion categories
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id}
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
              />
            </div>
            <h3 className="font-semibold text-sm md:text-base text-black group-hover:text-gray-600 transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}