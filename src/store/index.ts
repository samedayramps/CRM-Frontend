import { configureStore } from '@reduxjs/toolkit';
import customerReducer from '../slices/customerSlice';
import jobReducer from '../slices/jobSlice';

export const store = configureStore({
  reducer: {
    customers: customerReducer,
    jobs: jobReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;