import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Parameters } from "../../types/Parameters";

const initialState: Parameters = {
  page: 0,
  size: 10,
  name: null,
  complete: null,
  priority: null,
  sortByDueDate: null,
  sortByPriority: null,
};
const paramsSlice = createSlice({
  name: "params",
  initialState,
  reducers: {
    setParams: (_state, action: PayloadAction<Parameters>) => {
      return action.payload;
    },
  },
});

export const { setParams } = paramsSlice.actions;
export default paramsSlice.reducer;
