/**
 * Error handling utilities for common issues
 */

// Suppress CSP-related audio/media errors
export const suppressMediaCSPErrors = () => {
  if (typeof window === 'undefined') return;

  // Handle uncaught errors
  const handleError = (event) => {
    const message = event.message || event.error?.message || '';
    
    // Suppress specific CSP media errors
    if (message.includes('data:audio') || 
        message.includes('Content Security Policy') ||
        message.includes('media-src')) {
      console.warn('Media CSP error suppressed:', message);
      event.preventDefault();
      return false;
    }
  };

  // Handle unhandled promise rejections
  const handleRejection = (event) => {
    const reason = event.reason?.message || event.reason || '';
    
    if (typeof reason === 'string' && 
        (reason.includes('NotSupportedError') || 
         reason.includes('Failed to load') ||
         reason.includes('no supported source'))) {
      console.warn('Media loading error suppressed:', reason);
      event.preventDefault();
      return false;
    }
  };

  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleRejection);

  // Return cleanup function
  return () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleRejection);
  };
};

// Mock audio constructor that prevents CSP errors
export const createSafeAudio = (src) => {
  try {
    return new Audio(src);
  } catch (error) {
    console.warn('Audio creation blocked by CSP, returning mock:', error);
    return {
      play: () => Promise.resolve(),
      pause: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      load: () => {},
      currentTime: 0,
      duration: 0,
      volume: 1,
      muted: false,
      paused: true,
      ended: false,
      src: src || '',
      readyState: 4
    };
  }
};