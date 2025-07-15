import { configureStore } from '@reduxjs/toolkit';
import rowReducer from './slices/rowsSlice';
import paramsReducer from './slices/paramsSlice';

export const store = configureStore({
  reducer: {
    rows: rowReducer,
    params: paramsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['rows/addRow'],
        ignoredPaths: ['rows.rows'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
