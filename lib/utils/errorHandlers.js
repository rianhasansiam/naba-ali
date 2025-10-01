/**
 * Error handling utilities for production
 * Suppresses common non-critical errors
 */

const isDev = process.env.NODE_ENV === 'development';

export const suppressCommonErrors = () => {
  if (typeof window === 'undefined') return;

  const handleError = (event) => {
    const message = event.message || event.error?.message || '';
    
    // Suppress CSP media and Redux proxy errors
    if (message.includes('data:audio') || 
        message.includes('Content Security Policy') ||
        message.includes('media-src') ||
        message.includes('proxy that has been revoked') ||
        message.includes('Cannot perform')) {
      if (isDev) console.warn('Non-critical error suppressed:', message);
      event.preventDefault();
      return false;
    }
  };

  const handleRejection = (event) => {
    const reason = event.reason?.message || event.reason || '';
    
    if (typeof reason === 'string' && 
        (reason.includes('NotSupportedError') || 
         reason.includes('Failed to load') ||
         reason.includes('no supported source') ||
         reason.includes('proxy that has been revoked'))) {
      if (isDev) console.warn('Promise rejection suppressed:', reason);
      event.preventDefault();
      return false;
    }
  };

  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleRejection);

  return () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleRejection);
  };
};

export const suppressMediaCSPErrors = suppressCommonErrors;

export const createSafeAudio = (src) => {
  try {
    return new Audio(src);
  } catch (error) {
    if (isDev) console.warn('Audio creation blocked by CSP');
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