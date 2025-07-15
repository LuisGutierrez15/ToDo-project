/**
 * Type guards for runtime type checking and better type safety.
 * Helps distinguish between successful API responses and errors.
 */

interface APIResponse<T = unknown> {
  message: string;
  data: T;
}

interface PaginatedAPIResponse<T = unknown> {
  message: string;
  data: T;
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

interface APIError {
  message: string;
  error?: string;
  statusCode?: number;
}

/**
 * Type guard to check if a response is a successful API response
 */
export const isAPIResponse = <T>(
  response: APIResponse<T> | PaginatedAPIResponse<T> | APIError | undefined | null
): response is APIResponse<T> => {
  return (
    response !== null &&
    response !== undefined &&
    typeof response === 'object' &&
    'data' in response &&
    response.data !== undefined &&
    !('total' in response)
  );
};

/**
 * Type guard to check if a response is a paginated API response
 */
export const isPaginatedAPIResponse = <T>(
  response: APIResponse<T> | PaginatedAPIResponse<T> | APIError | undefined | null
): response is PaginatedAPIResponse<T> => {
  return (
    response !== null &&
    response !== undefined &&
    typeof response === 'object' &&
    'data' in response &&
    'total' in response &&
    'page' in response &&
    'size' in response &&
    'totalPages' in response &&
    response.data !== undefined
  );
};

/**
 * Type guard to check if a response is an API error
 */
export const isAPIError = (
  response: APIResponse | PaginatedAPIResponse | APIError | undefined | null
): response is APIError => {
  return (
    response !== null &&
    response !== undefined &&
    typeof response === 'object' &&
    'error' in response &&
    !('data' in response)
  );
};

/**
 * Type guard to check if a response indicates success
 */
export const isSuccessResponse = <T>(
  response: APIResponse<T> | PaginatedAPIResponse<T> | APIError | undefined | null
): response is APIResponse<T> | PaginatedAPIResponse<T> => {
  return (
    (isAPIResponse(response) || isPaginatedAPIResponse(response)) &&
    (response.message.includes('successfully') ||
      response.message === 'success' ||
      response.message.includes('retrieved') ||
      response.message.includes('found'))
  );
};

/**
 * Helper to extract data safely from API response
 */
export const extractAPIData = <T>(
  response: APIResponse<T> | PaginatedAPIResponse<T> | APIError | undefined | null
): T | null => {
  if (isAPIResponse<T>(response) || isPaginatedAPIResponse<T>(response)) {
    return response.data;
  }
  return null;
};

/**
 * Helper to extract error message from API response
 */
export const extractErrorMessage = (
  response: APIResponse | PaginatedAPIResponse | APIError | undefined | null
): string => {
  if (isAPIError(response)) {
    return response.error || response.message || 'An error occurred';
  }
  if (
    response &&
    'message' in response &&
    !response.message.includes('successfully') &&
    !response.message.includes('retrieved') &&
    !response.message.includes('found') &&
    response.message !== 'success'
  ) {
    return response.message;
  }
  return 'An unexpected error occurred';
};
