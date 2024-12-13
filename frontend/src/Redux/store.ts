import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userAuthReducer from './slices/userSlice';
import doctorAuthReducer from './slices/doctorSlice';
import adminAuthReducer from './slices/adminSlice';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// Combine reducers for different roles
const rootReducer = combineReducers({
  userAuth: userAuthReducer,
  doctorAuth: doctorAuthReducer,
  adminAuth: adminAuthReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userAuth', 'doctorAuth', 'adminAuth'], // Only persist these slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['_persist'],
      },
    }),
});

export const persistor = persistStore(store);

// TypeScript types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
