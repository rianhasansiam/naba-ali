'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function CategoryClient({ categories = [] }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position and update button states
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  // Scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div>
      {/* Section Header */}
      <motion.div 
        className="text-center mb-12 md:mb-16"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
          SHOP BY CATEGORY
        </h2>
        <p className="text-black/60 text-lg md:text-xl max-w-2xl mx-auto">
          Explore our diverse collection of fashion categories. 
          Find exactly what you&apos;re looking for.
        </p>
      </motion.div>

      {/* Categories Container */}
      <div className="relative">
        {/* Scroll Buttons */}
        <motion.button
          onClick={scrollLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 ${
            canScrollLeft 
              ? 'opacity-100 hover:bg-gray-50 cursor-pointer' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          whileHover={canScrollLeft ? { scale: 1.1 } : {}}
          whileTap={canScrollLeft ? { scale: 0.9 } : {}}
          disabled={!canScrollLeft}
        >
          <FiChevronLeft className="w-6 h-6 text-gray-700" />
        </motion.button>

        <motion.button
          onClick={scrollRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 ${
            canScrollRight 
              ? 'opacity-100 hover:bg-gray-50 cursor-pointer' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          whileHover={canScrollRight ? { scale: 1.1 } : {}}
          whileTap={canScrollRight ? { scale: 0.9 } : {}}
          disabled={!canScrollRight}
        >
          <FiChevronRight className="w-6 h-6 text-gray-700" />
        </motion.button>

        {/* Scrollable Categories */}
        <motion.div
          ref={scrollContainerRef}
          className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-4 px-8 md:px-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={checkScrollButtons}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="flex-shrink-0"
            >
              <Link 
                href={`/category/${category.slug}`}
                className="group block"
              >
                <motion.div
                  className="text-center"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Circular Image */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 mx-auto mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full group-hover:shadow-2xl transition-shadow duration-300" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-gray-100 transition-colors duration-300">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 144px"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-full" />
                    </div>
                    
                    {/* Hover effect ring */}
                    <div className="absolute -inset-2 border-2 border-transparent group-hover:border-black/20 rounded-full transition-all duration-300" />
                  </div>

                  {/* Category Info */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-base md:text-lg text-black group-hover:text-gray-700 transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                      {category.itemCount} items
                    </p>
                    <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors duration-200 hidden md:block">
                      {category.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* View All Categories Button */}
      <motion.div 
        className="text-center mt-12 md:mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* <Link href="/categories">
          <motion.button
            className="inline-flex items-center gap-3 border-2 border-black text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-black hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View All Categories</span>
          </motion.button>
        </Link> */}
      </motion.div>

      {/* Custom scrollbar hide styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}