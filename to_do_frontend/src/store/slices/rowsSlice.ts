import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToDo } from "../../types/ToDo";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";

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
  name: "rows",
  initialState,
  reducers: {
    setRows: (_state, action: PayloadAction<rowsInfo>) => {
      return action.payload;
    },
    addRow: (state, action: PayloadAction<ToDo>) => {
      if (
        (state.paginationModel?.page! + 1) * state.paginationModel?.pageSize! >=
        action.payload.id!
      ) {
        state.rows.push(action.payload);
      }
      state.paginationModel = {
        page: Math.ceil(state.rowsCount / state.paginationModel?.pageSize!) + 1,
        pageSize: state.paginationModel?.pageSize!,
      };
      state.rowsCount += 1;
    },
    updateRow: (state, action: PayloadAction<ToDo>) => {
      const idx = state.rows.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.rows[idx] = action.payload;
      }
    },
    deleteRow: (state, action: PayloadAction<rowsInfo>) => {
      if (action.payload.rows.length == 0 && state.paginationModel?.page! > 0) {
        state.paginationModel = {
          page: state.paginationModel?.page! - 1,
          pageSize: state.paginationModel?.pageSize!,
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
