import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToDo } from '../../types/ToDo';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

type rowsInfo = {
  rows: ToDo[];
  rowsCount: number;
  paginationModel?: GridPaginationModel | undefined;
  sortModel?: GridSortModel | undefined;
};

const initialState: rowsInfo = {
  rows: [],
  rowsCount: 0,
  paginationModel: undefined,
  sortModel: undefined,
};
const rowSlice = createSlice({
  name: 'rows',
  initialState,
  reducers: {
    setRows: (_state, action: PayloadAction<rowsInfo>) => {
      return action.payload;
    },
    addRow: (state, action: PayloadAction<ToDo>) => {
      // Increment total count first
      state.rowsCount += 1;

      // Only navigate if pagination model exists
      if (state.paginationModel) {
        // Calculate which page the new item should appear on (assuming items are sorted by newest first or by ID)
        const totalPages = Math.ceil(state.rowsCount / state.paginationModel.pageSize);

        // Navigate to the last page to show the new task
        state.paginationModel = {
          page: Math.max(0, totalPages - 1), // Pages are 0-indexed, ensure not negative
          pageSize: state.paginationModel.pageSize,
        };
      }

      // Add the new row to current view (it will be properly fetched by the effect in useFetchToDos)
      // But for optimistic UI, add it temporarily if we're on the right page
      state.rows.unshift(action.payload); // Add to beginning assuming newest first
    },
    updateRow: (state, action: PayloadAction<ToDo>) => {
      const idx = state.rows.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.rows[idx] = action.payload;
      }
    },
    deleteRow: (state, action: PayloadAction<rowsInfo>) => {
      // If current page is empty and not the first page, go to previous page
      if (
        action.payload.rows.length === 0 &&
        state.paginationModel &&
        state.paginationModel.page > 0
      ) {
        state.paginationModel = {
          page: state.paginationModel.page - 1,
          pageSize: state.paginationModel.pageSize,
        };
        return;
      }
      state.rows = action.payload.rows;
      state.rowsCount = action.payload.rowsCount;
    },
  },
});

export const { setRows, addRow, updateRow, deleteRow } = rowSlice.actions;
export default rowSlice.reducer;
