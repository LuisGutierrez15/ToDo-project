import axios, { AxiosError, AxiosResponse } from 'axios';
import { axiosInstance } from './axiosInstance';
import { Parameters } from '../types/Parameters';
import { ToDo } from '../types/ToDo';

/**
 * API Response types for better type safety
 * Matches backend ApiResponse<T> and Pagination<T> structures
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
 * Generic error handler for API requests
 */
const handleAPIError = (error: unknown): APIError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<APIError>;
    return {
      message: axiosError.response?.data?.message || 'An error occurred',
      error: axiosError.response?.data?.error || axiosError.message,
      statusCode: axiosError.response?.status,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      error: 'Unknown error',
    };
  }

  return {
    message: 'An unexpected error occurred',
    error: 'Unknown error',
  };
};

/**
 * Helper to extract data from response or return error
 */
const processResponse = <T>(response: AxiosResponse<T> | undefined): T | APIError => {
  if (response?.data) {
    return response.data;
  }
  return {
    message: 'No response data',
    error: 'Empty response',
    statusCode: response?.status,
  };
};

export const getToDos = async (
  params: Parameters | null
): Promise<PaginatedAPIResponse<ToDo[]> | APIError> => {
  try {
    const response = await axiosInstance.get<PaginatedAPIResponse<ToDo[]>>('', { params });
    return processResponse(response) as PaginatedAPIResponse<ToDo[]>;
  } catch (error) {
    return handleAPIError(error);
  }
};

export const getStats = async (): Promise<APIResponse | APIError> => {
  try {
    const response = await axiosInstance.get<APIResponse>('/stats');
    return processResponse(response) as APIResponse;
  } catch (error) {
    return handleAPIError(error);
  }
};

export const createToDo = async (toDo: ToDo): Promise<APIResponse<ToDo> | APIError> => {
  try {
    const response = await axiosInstance.post<APIResponse<ToDo>>('', toDo);
    return processResponse(response) as APIResponse<ToDo>;
  } catch (error) {
    return handleAPIError(error);
  }
};

export const markDone = async (id: number): Promise<APIResponse<boolean> | APIError> => {
  try {
    const response = await axiosInstance.post<APIResponse<boolean>>(`/${id}/done`);
    return processResponse(response) as APIResponse<boolean>;
  } catch (error) {
    return handleAPIError(error);
  }
};

export const markUnDone = async (id: number): Promise<APIResponse<boolean> | APIError> => {
  try {
    const response = await axiosInstance.put<APIResponse<boolean>>(`/${id}/undone`);
    return processResponse(response) as APIResponse<boolean>;
  } catch (error) {
    return handleAPIError(error);
  }
};

export const updateToDo = async (
  id: number,
  toDoUpdated: ToDo
): Promise<APIResponse<boolean> | APIError> => {
  try {
    const response = await axiosInstance.put<APIResponse<boolean>>(`/${id}`, toDoUpdated);
    return processResponse(response) as APIResponse<boolean>;
  } catch (error) {
    return handleAPIError(error);
  }
};

export const deleteToDo = async (id: number): Promise<APIResponse<boolean> | APIError> => {
  try {
    const response = await axiosInstance.delete<APIResponse<boolean>>(`/${id}`);
    return processResponse(response) as APIResponse<boolean>;
  } catch (error) {
    return handleAPIError(error);
  }
};
