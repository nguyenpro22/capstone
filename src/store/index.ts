// import { ExampleAPI } from "@/services/apis";
import { authApi } from "@/features/auth/api";
import { landingApi } from "@/features/landing/api";
import authReducer from "@/features/auth/slice";
import { addressApi  } from "@/features/address/api";
import { paymentsApi  } from "@/features/payment/api";

import { clinicsQueryApi, clinicsCommandApi, staffCommandApi, staffQueryApi, doctorCommandApi, doctorQueryApi  } from "@/features/clinic/api";
import { packageApi, packageCreateApi } from "@/features/package/api"; // Đảm bảo đường dẫn đúng
import { partnershipRequestApi } from "@/features/partnership/api"; // Đảm bảo đường dẫn đúng

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { serviceApi } from "@/features/services/api";
import { categoryApi } from "@/features/home/api";
import { categoryQueryApi, categoryCommandApi } from "@/features/category-service/api";
import { serviceCommandApi, serviceQueryApi } from "@/features/clinic-service/api";
const store = configureStore({
  reducer: {
    // [ExampleAPI.reducerPath]: ExampleAPI.reducer,
    auth: authReducer, //save state auth
    [landingApi.reducerPath]: landingApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [packageApi.reducerPath]: packageApi.reducer, // ✅ Thêm reducer của RTK Query
    [packageCreateApi.reducerPath]: packageCreateApi.reducer, // Thêm packageCreateApi vào store
    [partnershipRequestApi.reducerPath]: partnershipRequestApi.reducer,

    [serviceApi.reducerPath]: serviceApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [clinicsQueryApi.reducerPath]: clinicsQueryApi.reducer,
    [clinicsCommandApi.reducerPath]: clinicsCommandApi.reducer,
    [categoryQueryApi.reducerPath]: categoryQueryApi.reducer,
    [categoryCommandApi.reducerPath]: categoryCommandApi.reducer,
    [serviceCommandApi.reducerPath]: serviceCommandApi.reducer,
    [serviceQueryApi.reducerPath]: serviceQueryApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [staffCommandApi.reducerPath]: staffCommandApi.reducer,
    [staffQueryApi.reducerPath]: staffQueryApi.reducer,
    [doctorCommandApi.reducerPath]: doctorCommandApi.reducer,
    [doctorQueryApi.reducerPath]: doctorQueryApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware().concat(ExampleAPI.middleware),
    getDefaultMiddleware().concat(
      authApi.middleware,
      packageApi.middleware,
      packageCreateApi.middleware, // Thêm middleware cho packageCreateApi
      partnershipRequestApi.middleware,
      serviceApi.middleware,
      categoryApi.middleware,
      clinicsQueryApi.middleware,
      clinicsCommandApi.middleware,
      categoryQueryApi.middleware,
      categoryCommandApi.middleware,
      serviceCommandApi.middleware,
      serviceQueryApi.middleware,
      addressApi.middleware,
      paymentsApi.middleware,
      staffCommandApi.middleware,
      staffQueryApi.middleware,
      doctorCommandApi.middleware,
      doctorQueryApi.middleware,
    ),// ✅ Đảm bảo middleware của cả hai API được thêm vào
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
