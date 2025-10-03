'use client';

import { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Image from 'next/image';

export default function ImageViewer({ 
  images = [], 
  initialIndex = 0, 
  isOpen = false, 
  onClose,
  onDownload 
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    resetTransforms();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    resetTransforms();
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetTransforms = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case 'r':
      case 'R':
        handleRotate();
        break;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold truncate max-w-md">
              {currentImage.name || `Image ${currentIndex + 1}`}
            </h3>
            <span className="text-sm text-gray-300">
              {currentIndex + 1} of {images.length}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Controls */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            
            <span className="px-2 py-1 bg-black/30 rounded text-sm min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRotate();
              }}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              title="Rotate"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.(currentImage);
              }}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors z-10"
            title="Previous (←)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors z-10"
            title="Next (→)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Main Image */}
      <div 
        className="relative max-w-full max-h-full flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: 'transform 0.2s ease-out'
          }}
          className="max-w-[90vw] max-h-[90vh] relative"
        >
          <Image
            src={currentImage.url}
            alt={currentImage.name || 'Image'}
            width={currentImage.width || 800}
            height={currentImage.height || 600}
            className="max-w-full max-h-full object-contain"
            unoptimized={currentImage.url.startsWith('blob:')}
          />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 p-2 bg-black/30 rounded-lg max-w-[90vw] overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                resetTransforms();
              }}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-white shadow-lg'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={image.url}
                alt={image.name || `Thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized={image.url.startsWith('blob:')}
              />
            </button>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 text-white text-sm bg-black/30 rounded-lg p-2 hidden md:block">
        <div>Use arrow keys to navigate</div>
        <div>+/- to zoom, R to rotate, Esc to close</div>
      </div>
    </div>
  );
}