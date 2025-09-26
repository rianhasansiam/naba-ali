/**
 * Error handling utilities for common issues
 */

// Suppress CSP-related audio/media errors and Redux proxy errors
export const suppressCommonErrors = () => {
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
    
    // Suppress Redux proxy revocation errors
    if (message.includes('proxy that has been revoked') || 
        message.includes('Cannot perform') ||
        message.includes('revoked proxy')) {
      console.warn('Redux proxy revocation error suppressed:', message);
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
         reason.includes('no supported source') ||
         reason.includes('proxy that has been revoked') ||
         reason.includes('Cannot perform'))) {
      console.warn('Error suppressed:', reason);
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

// Backward compatibility alias
export const suppressMediaCSPErrors = suppressCommonErrors;

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