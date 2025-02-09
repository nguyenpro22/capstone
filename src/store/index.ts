// import { ExampleAPI } from "@/services/apis";
import { authApi } from "@/features/auth/api";
import { landingApi } from "@/features/landing/api";
import authReducer from "@/features/auth/slice";
import { clinicsApi } from "@/features/clinic/api";
import { packageApi, packageCreateApi } from "@/features/package/api"; // Đảm bảo đường dẫn đúng
import { partnershipRequestApi } from "@/features/partnership/api"; // Đảm bảo đường dẫn đúng

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
const store = configureStore({
  reducer: {
    // [ExampleAPI.reducerPath]: ExampleAPI.reducer,
    auth: authReducer, //save state auth
    [authApi.reducerPath]: authApi.reducer,
    [packageApi.reducerPath]: packageApi.reducer, // ✅ Thêm reducer của RTK Query
    [packageCreateApi.reducerPath]: packageCreateApi.reducer, // Thêm packageCreateApi vào store
    [partnershipRequestApi.reducerPath]: partnershipRequestApi.reducer,
    [clinicsApi.reducerPath]: clinicsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware().concat(ExampleAPI.middleware),
    getDefaultMiddleware().concat(
      authApi.middleware, 
      packageApi.middleware,
      packageCreateApi.middleware, // Thêm middleware cho packageCreateApi
      partnershipRequestApi.middleware,
      clinicsApi.middleware
    ),// ✅ Đảm bảo middleware của cả hai API được thêm vào
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
