// import { ExampleAPI } from "@/services/apis";
import { authApi } from "@/features/auth/api";
import authReducer from "@/features/auth/slice";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
const store = configureStore({
  reducer: {
    // [ExampleAPI.reducerPath]: ExampleAPI.reducer,
    auth: authReducer, //save state auth
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware().concat(ExampleAPI.middleware),
    getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
