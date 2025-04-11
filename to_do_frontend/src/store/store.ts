import { configureStore } from "@reduxjs/toolkit";
import rowReducer from "./slices/rowsSlice";
import paramsSlice from "./slices/paramsSlice";

export const store = configureStore({
  reducer: {
    rows: rowReducer,
    params: paramsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
