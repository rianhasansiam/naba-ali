'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NewsLetterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <motion.div 
      className="bg-black text-white rounded-[20px] px-6 md:px-16 py-9 md:py-12 max-w-frame mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 lg:gap-8">
        <div className="lg:max-w-[551px]">
          <h2 className="text-[32px] md:text-[40px] font-bold leading-[35px] md:leading-[45px] mb-4">
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h2>
        </div>
        
        <div className="lg:max-w-[349px] w-full">
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-black/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-12 pr-4 py-3 bg-white text-black placeholder-black/40 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
                required
              />
            </div>
            
            <motion.button
              type="submit"
              className="w-full py-3 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubscribed}
            >
              {isSubscribed ? 'Subscribed!' : 'Subscribe to Newsletter'}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}