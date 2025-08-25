import { configureStore, combineReducers } from '@reduxjs/toolkit';
import studentReducer from './slice/studentSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // uses localStorage for web
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2, // Optional: helps merge nested state
};

const rootReducer = combineReducers({
  student: studentReducer,
  // Add additional reducers here if needed
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Ignore non-serializable values from redux-persist actions.
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
