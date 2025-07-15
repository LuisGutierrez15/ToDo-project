import { useEffect, useState } from 'react';
import { GridPaginationModel, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';
import { Status } from '../types/Status';
import { getToDos } from '../api/toDoService';
import { Priority } from '../types/Priority';
import { useDispatch, useSelector } from 'react-redux';
import { setRows } from '../store/slices/rowsSlice';
import { setParams } from '../store/slices/paramsSlice';
import { selectAllToDos } from '../store/selectors/rowsSelector';
import { handlePreSelectedRows } from '../helpers/handlersHelpers';
import { selectParams } from '../store/selectors/paramsSelector';
import { isAPIError, isPaginatedAPIResponse } from '../utils/typeGuards';
import { SearchFilters } from './useUrlParams';
import { transformToDoArray } from '../utils/dataTransformers';

export type DataTableProps = {
  name: string | null;
  priority: number | null;
  complete: number | null;
  page: number;
  size: number;
  sortByPriority: string | null;
  sortByDueDate: string | null;
  updateUrlParams: (newFilters: Partial<SearchFilters>) => void;
  className?: string;
};

export const useFetchToDos = ({
  name,
  priority,
  complete,
  page,
  size,
  sortByPriority,
  sortByDueDate,
  updateUrlParams,
}: DataTableProps) => {
  const dispatch = useDispatch();
  const rowsInfo = useSelector(selectAllToDos);
  const rowCount = rowsInfo.rowsCount;
  const rows = rowsInfo.rows;
  const [isLoading, setIsLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: page,
    pageSize: size,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>(() => {
    const initialSort = [];
    if (sortByPriority) {
      initialSort.push({ field: 'priority', sort: sortByPriority as 'asc' | 'desc' });
    }
    if (sortByDueDate) {
      initialSort.push({ field: 'dueDate', sort: sortByDueDate as 'asc' | 'desc' });
    }
    return initialSort;
  });

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [shouldResetPage, setShouldResetPage] = useState(false);

  // Reset page to 0 when filters change (but not when page itself changes)
  useEffect(() => {
    setShouldResetPage(true);
  }, [name, priority, complete, sortByPriority, sortByDueDate]);

  // Handle pagination model changes
  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    if (shouldResetPage) {
      // Reset page to 0 when filters change
      setPaginationModel({ ...newModel, page: 0 });
      setShouldResetPage(false);
    } else {
      setPaginationModel(newModel);
    }
  };

  // Update URL params when pagination or sorting changes
  useEffect(() => {
    if (paginationModel.page !== page || paginationModel.pageSize !== size) {
      updateUrlParams({
        page: paginationModel.page,
        size: paginationModel.pageSize,
      });
    }
  }, [paginationModel, page, size, updateUrlParams]);

  useEffect(() => {
    const newSortByPriority = sortModel.find(s => s.field === 'priority')?.sort || null;
    const newSortByDueDate = sortModel.find(s => s.field === 'dueDate')?.sort || null;

    if (newSortByPriority !== sortByPriority || newSortByDueDate !== sortByDueDate) {
      updateUrlParams({
        sortByPriority: newSortByPriority,
        sortByDueDate: newSortByDueDate,
      });
    }
  }, [sortModel, sortByPriority, sortByDueDate, updateUrlParams]);

  useEffect(() => {
    const parameters = {
      page: paginationModel.page,
      size: paginationModel.pageSize,
      complete: complete !== null ? Status[complete] : null,
      name: name && name?.length > 0 ? name : null,
      priority: priority !== null ? Priority[priority] : null,
      sortByPriority: sortModel.find(s => s.field === 'priority')?.sort,
      sortByDueDate: sortModel.find(s => s.field === 'dueDate')?.sort,
    };
    dispatch(setParams(parameters));
  }, [sortModel, paginationModel, name, priority, complete, dispatch]);

  const params = useSelector(selectParams);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getToDos(params);
      if (!isAPIError(response) && isPaginatedAPIResponse(response)) {
        // Backend returns: {message: "success", data: [todos...], total: X, page: Y, size: Z, totalPages: W}
        // response.data contains the actual todo array
        // Transform the data to ensure proper enum values
        const transformedData = transformToDoArray(response.data);

        dispatch(
          setRows({
            rows: transformedData, // Use transformed data
            rowsCount: response.total, // total count is at response.total
            paginationModel: paginationModel,
            sortModel: sortModel,
          })
        );
        const ids = handlePreSelectedRows(transformedData.filter(todo => todo.doneFlag));
        setSelectionModel(ids);
      } else if (isAPIError(response)) {
        console.error('Failed to fetch todos:', response);
      }
    };

    if (params) {
      fetchData();
    }
    setIsLoading(false);
  }, [dispatch, paginationModel, params, sortModel]);

  useEffect(() => {
    if (rowsInfo.paginationModel) setPaginationModel(rowsInfo.paginationModel);
  }, [rowsInfo.paginationModel]);

  return {
    rows,
    rowCount,
    isLoading,
    paginationModel,
    sortModel,
    selectionModel,
    setPaginationModel: handlePaginationModelChange,
    setSortModel,
    setSelectionModel,
    setIsLoading,
  };
};
