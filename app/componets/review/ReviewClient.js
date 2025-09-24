'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiStar, FiCheck } from 'react-icons/fi';

// Individual Review Card Component
const ReviewCard = ({ review }) => {
  return (
    <motion.div
      className="flex-shrink-0 w-80 md:w-96 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      {/* Customer Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-12 h-12">
          <Image
            src={review.avatar}
            alt={review.name}
            fill
            className="object-cover rounded-full"
            sizes="48px"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{review.name}</h4>
            {review.verified && (
              <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                <FiCheck className="w-3 h-3" />
                <span>Verified</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">{review.date}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`w-4 h-4 ${
                i < review.rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {review.rating}.0
        </span>
      </div>

      {/* Review Title */}
      <h3 className="font-bold text-lg text-gray-900 mb-3">
        {review.title}
      </h3>

      {/* Review Comment */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
        {review.comment}
      </p>

      {/* Product Info */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 mb-1">Purchased:</p>
        <p className="font-medium text-gray-900 text-sm">{review.product}</p>
      </div>
    </motion.div>
  );
};

export default function ReviewClient({ reviews = [], stats, error }) {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollSpeed = 1; // pixels per frame
    let animationFrame;

    const autoScroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        
        // Reset scroll when reaching the end
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(autoScroll);
    };

    animationFrame = requestAnimationFrame(autoScroll);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPaused]);

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
        <p className="text-gray-600">Unable to load reviews at the moment. Please try again later.</p>
      </div>
    );
  }

  // Handle empty reviews
  if (reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
        <p className="text-gray-600">No reviews available yet. Be the first to share your experience!</p>
      </div>
    );
  }

  // Duplicate reviews for seamless scrolling
  const duplicatedReviews = [...reviews, ...reviews];

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
          CUSTOMER REVIEWS
        </h2>
        <p className="text-black/60 text-lg md:text-xl max-w-2xl mx-auto">
          Don&apos;t just take our word for it. See what our customers have to say 
          about their experience with NABA ALI.
        </p>
      </motion.div>

      {/* Reviews Stats */}
      <motion.div 
        className="flex justify-center items-center gap-8 md:gap-12 mb-12 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-black mb-2">
            {stats?.averageRating || "4.8"}
          </div>
          <div className="flex items-center justify-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className="w-5 h-5 text-yellow-400 fill-current"
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">Average Rating</p>
        </div>
        
        <div className="w-px h-12 bg-gray-300"></div>
        
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-black mb-2">
            {stats?.totalReviews ? `${stats.totalReviews > 1000 ? Math.round(stats.totalReviews/1000) + 'K' : stats.totalReviews}+` : "2.5K+"}
          </div>
          <p className="text-sm text-gray-500">Happy Customers</p>
        </div>
        
        <div className="w-px h-12 bg-gray-300"></div>
        
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-black mb-2">98%</div>
          <p className="text-sm text-gray-500">Satisfaction Rate</p>
        </div>
      </motion.div>

      {/* Auto-scrolling Reviews */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-hidden py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {duplicatedReviews.map((review, index) => (
            <ReviewCard 
              key={`${review.id}-${index}`} 
              review={review} 
            />
          ))}
        </div>
      </motion.div>

      {/* Pause indicator */}
      <motion.div 
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: isPaused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm text-gray-500">
          Hover over reviews to pause scrolling
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div 
        className="text-center mt-12 md:mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <motion.button
          className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Read All Reviews</span>
        </motion.button>
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