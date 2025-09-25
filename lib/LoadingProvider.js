'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import GlobalLoadingPage from '../app/componets/loading/GlobalLoadingPage';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [loadingVariant, setLoadingVariant] = useState('default');

  const showLoading = useCallback((message = 'Loading...', variant = 'default') => {
    setLoadingMessage(message);
    setLoadingVariant(variant);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const updateLoadingMessage = useCallback((message) => {
    setLoadingMessage(message);
  }, []);

  const value = {
    isLoading,
    loadingMessage,
    loadingVariant,
    showLoading,
    hideLoading,
    updateLoadingMessage,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && (
        <GlobalLoadingPage 
          message={loadingMessage} 
          variant={loadingVariant}
        />
      )}
    </LoadingContext.Provider>
  );
};