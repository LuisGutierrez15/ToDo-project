import { createSlice } from "@reduxjs/toolkit";
import { Parameters } from "../../types/Parameters";

const initialState: Parameters | null = null;

const paramsSlice = createSlice({
  name: "params",
  initialState,
  reducers: {
    setParams: (_state, actions) => actions.payload,
  },
});

export const { setParams } = paramsSlice.actions;
export default paramsSlice.reducer;
