/**
 * Production-ready logger utility
 * Only logs errors in development, silent in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log error messages (only in development)
   */
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },

  /**
   * Log warning messages (only in development)
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log info messages (only in development)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  }
};
