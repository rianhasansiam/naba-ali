'use client';

import { motion, animate } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Counter component for animated numbers
const Counter = ({ from = 0, to, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(from);
  
  useEffect(() => {
    const controls = animate(from, to, {
      duration,
      onUpdate: (value) => setCount(Math.round(value))
    });
    return controls.stop;
  }, [from, to, duration]);

  return <span>{count}{suffix}</span>;
};

const HeroClient = ({ 
  title = "Discover",
  subtitle = "Premium", 
  mainTitle = "Fashion",
  description = "Elevate your style with our curated collection of luxury items. Quality, comfort, and sophistication in every piece.",
  stats = [
    { number: "500+", label: "Premium Products" },
    { number: "50K+", label: "Happy Customers" },
    { number: "99%", label: "Satisfaction Rate" }
  ],
  productName = "Premium Sneakers",
  productPrice = "$299",
  productEmoji = "👟"
}) => {



    
  return (
    <section className="relative bg-gradient-to-br from-gray-700 to-black text-white overflow-hidden">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl lg:text-7xl font-bold leading-tight"
              >
                {title}
                <br />
                <span className="text-gray-300">{subtitle}</span>
                <br />
                {mainTitle}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 max-w-md"
              >
                {description}
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button 
                className="inline-flex items-center justify-center h-11 px-8 py-2 text-base bg-white text-black hover:bg-gray-100 group rounded-md font-medium transition-colors"
              >
                Shop Collection
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                className="inline-flex items-center justify-center h-11 px-8 py-2 text-base border border-white text-white hover:bg-white hover:text-black rounded-md font-medium transition-colors"
              >
                View All Products
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-700"
            >
              {stats.map((stat, index) => {
                // Extract numeric value and suffix from stat.number
                const match = stat.number.match(/(\d+)(.*)$/);
                const numericValue = match ? parseInt(match[1]) : 0;
                const suffix = match ? match[2] : "";
                
                return (
                  <div key={index}>
                    <h3 className="text-2xl font-bold">
                      <Counter 
                        to={numericValue} 
                        duration={3 + index * 0.2} 
                        suffix={suffix}
                      />
                    </h3>
                    <p className="text-gray-400">{stat.label}</p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
              >
                <div className="space-y-6">
                  <div className="h-48 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    {/* Fashion showcase with multiple elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent mix-blend-soft-light"></div>
                    <div className="relative z-10 flex flex-col items-center space-y-4">
                      <div className="flex space-x-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm">
                          👔
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm">
                          👗
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <div className="w-12 h-12 bg-white/15 rounded-lg flex items-center justify-center text-3xl backdrop-blur-sm">
                          👟
                        </div>
                        <div className="w-12 h-12 bg-white/15 rounded-lg flex items-center justify-center text-3xl backdrop-blur-sm">
                          👜
                        </div>
                        <div className="w-12 h-12 bg-white/15 rounded-lg flex items-center justify-center text-3xl backdrop-blur-sm">
                          ⌚
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating decorative elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full blur-sm"></div>
                    <div className="absolute bottom-6 left-6 w-6 h-6 bg-white/15 rounded-full blur-sm"></div>
                    <div className="absolute top-1/2 left-4 w-4 h-4 bg-white/20 rounded-full blur-sm"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{productName}</h3>
                    <p className="text-gray-300">Handcrafted quality — Free shipping & returns</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Background Elements */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-10 -right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1.1, 1, 1.1] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 w-96 h-96 bg-gray-700/20 rounded-full blur-3xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroClient;