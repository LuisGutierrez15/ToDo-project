import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export type SearchFilters = {
  name: string;
  priority: number | null;
  status: number | null;
  page: number;
  size: number;
  sortByPriority: string | null;
  sortByDueDate: string | null;
};

export const DEFAULT_FILTERS: SearchFilters = {
  name: '',
  priority: null,
  status: null,
  page: 0,
  size: 10,
  sortByPriority: null,
  sortByDueDate: null,
};

/**
 * Custom hook to manage URL parameters synchronization with search filters
 * Provides URL persistence and easy filter management
 */
export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  // Initialize filters from URL on mount
  useEffect(() => {
    const urlFilters: SearchFilters = {
      name: searchParams.get('name') || '',
      priority: searchParams.get('priority') ? parseInt(searchParams.get('priority')!) : null,
      status: searchParams.get('status') ? parseInt(searchParams.get('status')!) : null,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 0,
      size: searchParams.get('size') ? parseInt(searchParams.get('size')!) : 10,
      sortByPriority: searchParams.get('sortByPriority') || null,
      sortByDueDate: searchParams.get('sortByDueDate') || null,
    };
    setFilters(urlFilters);
  }, [searchParams]);

  // Update URL when filters change
  const updateUrlParams = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const newSearchParams = new URLSearchParams();

    // Only add non-default values to URL
    if (updatedFilters.name && updatedFilters.name.trim() !== '') {
      newSearchParams.set('name', updatedFilters.name);
    }
    if (updatedFilters.priority !== null) {
      newSearchParams.set('priority', updatedFilters.priority.toString());
    }
    if (updatedFilters.status !== null) {
      newSearchParams.set('status', updatedFilters.status.toString());
    }
    if (updatedFilters.page !== 0) {
      newSearchParams.set('page', updatedFilters.page.toString());
    }
    if (updatedFilters.size !== 10) {
      newSearchParams.set('size', updatedFilters.size.toString());
    }
    if (updatedFilters.sortByPriority) {
      newSearchParams.set('sortByPriority', updatedFilters.sortByPriority);
    }
    if (updatedFilters.sortByDueDate) {
      newSearchParams.set('sortByDueDate', updatedFilters.sortByDueDate);
    }

    setSearchParams(newSearchParams);
  };

  // Clear all filters and reset to defaults
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchParams(new URLSearchParams());
  };

  // Check if any content filters are active (excluding pagination and sorting)
  const hasActiveFilters = () => {
    return (
      filters.name !== DEFAULT_FILTERS.name ||
      filters.priority !== DEFAULT_FILTERS.priority ||
      filters.status !== DEFAULT_FILTERS.status
    );
  };

  return {
    filters,
    updateUrlParams,
    clearFilters,
    hasActiveFilters: hasActiveFilters(),
  };
};
