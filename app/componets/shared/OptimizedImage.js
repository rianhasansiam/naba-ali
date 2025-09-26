'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PLACEHOLDER_IMAGES } from '@/lib/constants';

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  fallbackSrc = PLACEHOLDER_IMAGES.IMAGE_GENERIC,
  priority = false,
  quality = 75,
  ...props 
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setError(true);
    }
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        onError={handleError}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        } ${error ? 'opacity-75' : ''}`}
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
        {...props}
      />
      
      {error && (
        <div className="absolute bottom-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
          Fallback
        </div>
      )}
    </div>
  );
}