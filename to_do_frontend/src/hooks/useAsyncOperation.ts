import { useState, useCallback } from 'react';

/**
 * Custom hook for managing loading states with async operations.
 * Provides loading state and error handling for async functions.
 */
export const useAsyncOperation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: string) => void
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await asyncFn();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    execute,
    clearError,
  };
};

export default useAsyncOperation;
