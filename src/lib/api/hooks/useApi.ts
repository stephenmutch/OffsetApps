import { useState, useCallback } from 'react';
import { OffsetApiClient, createApiClient, ApiError } from '../client';

// Get API token from environment variables
const API_TOKEN = import.meta.env.VITE_OFFSET_API_TOKEN;

interface ApiErrorState {
  message: string;
  status?: number;
  statusText?: string;
  details?: any;
}

/**
 * Hook for making API requests using the Offset Reporting API client
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorState | null>(null);

  // Create API client instance
  const client = createApiClient(API_TOKEN);

  /**
   * Generic request wrapper that handles loading and error states
   */
  const request = useCallback(async <T>(
    apiCall: (client: OffsetApiClient) => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      // Validate API token
      if (!API_TOKEN) {
        throw new Error('API token is missing. Please check your environment variables.');
      }

      const result = await apiCall(client);
      return result;
    } catch (err) {
      console.error('API Error:', err);
      
      if (err instanceof ApiError) {
        setError({
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          details: err
        });
      } else if (err instanceof Error) {
        setError({
          message: err.message,
          details: err
        });
      } else {
        setError({
          message: 'An unknown error occurred',
          details: err
        });
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [client]);

  /**
   * Clear any existing error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    client,
    loading,
    error,
    request,
    clearError
  };
}