'use client';

import { useLoading } from '../LoadingProvider';
import { useEffect } from 'react';

/**
 * Custom hook for managing loading states with automatic cleanup
 */
export const useLoadingState = () => {
  const { showLoading, hideLoading, updateLoadingMessage, isLoading } = useLoading();

  // Auto-hide loading on component unmount
  useEffect(() => {
    return () => {
      if (isLoading) {
        hideLoading();
      }
    };
  }, [isLoading, hideLoading]);

  return {
    showLoading,
    hideLoading,
    updateLoadingMessage,
    isLoading
  };
};

/**
 * Custom hook for API loading states
 */
export const useApiLoading = () => {
  const { showLoading, hideLoading } = useLoadingState();

  const withLoading = async (apiCall, loadingMessage = 'Please wait...') => {
    try {
      showLoading(loadingMessage);
      const result = await apiCall();
      return result;
    } catch (error) {
      throw error;
    } finally {
      hideLoading();
    }
  };

  return { withLoading };
};

/**
 * Custom hook for navigation loading states
 */
export const useNavigationLoading = () => {
  const { showLoading, hideLoading } = useLoadingState();

  const showNavigationLoading = (destination = '') => {
    const message = destination 
      ? `Navigating to ${destination}...` 
      : 'Navigating...';
    showLoading(message, 'minimal');
  };

  return {
    showNavigationLoading,
    hideNavigationLoading: hideLoading
  };
};