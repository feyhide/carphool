import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";
import sidebarReducer from "./sidebarSlice";

const userPersistConfig = {
  key: "user",
  storage,
  version: 1,
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  sidebar: sidebarReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
