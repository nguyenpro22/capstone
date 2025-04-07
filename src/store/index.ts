import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "@/features/auth/slice";

import { authApi } from "@/features/auth/api";
import { landingApi } from "@/features/landing/api";
import { addressApi } from "@/features/address/api";
import { paymentsApi } from "@/features/payment/api";
import { clinicsQueryApi, clinicsCommandApi, staffQueryApi, staffCommandApi, doctorAdminQueryApi, doctorAdminCommandApi } from "@/features/clinic/api";
import { packageApi, packageCreateApi } from "@/features/package/api";
import { partnershipRequestApi } from "@/features/partnership/api";
import { serviceApi } from "@/features/services/api";
import { categoryApi } from "@/features/home/api";
import {
  categoryQueryApi,
  categoryCommandApi,
} from "@/features/category-service/api";
import {
  serviceCommandApi,
  serviceQueryApi,
} from "@/features/clinic-service/api";
import { bookingCommandApi, bookingQueryApi } from "@/features/booking/api";
import { doctorCommandApi, doctorQueryApi } from "@/features/doctor/api";
import { customerScheduleCommandApi, customerScheduleQueryApi } from "@/features/customer-schedule/api";
import { promotionCommandApi } from "@/features/promotion-service/api";

const store = configureStore({
  reducer: {
    auth: authReducer,

    [authApi.reducerPath]: authApi.reducer,
    [landingApi.reducerPath]: landingApi.reducer,
    [packageApi.reducerPath]: packageApi.reducer,
    [packageCreateApi.reducerPath]: packageCreateApi.reducer,
    [partnershipRequestApi.reducerPath]: partnershipRequestApi.reducer,
    [bookingQueryApi.reducerPath]: bookingQueryApi.reducer,
    [bookingCommandApi.reducerPath]: bookingCommandApi.reducer,
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
    [doctorQueryApi.reducerPath]: doctorQueryApi.reducer,
    [doctorCommandApi.reducerPath]: doctorCommandApi.reducer,
    [doctorAdminQueryApi.reducerPath]: doctorAdminQueryApi.reducer,
    [doctorAdminCommandApi.reducerPath]: doctorAdminCommandApi.reducer,
    [staffQueryApi.reducerPath]: staffQueryApi.reducer,
    [staffCommandApi.reducerPath]: staffCommandApi.reducer,
    [customerScheduleQueryApi.reducerPath]: customerScheduleQueryApi.reducer,
    [customerScheduleCommandApi.reducerPath]: customerScheduleCommandApi.reducer,
    [promotionCommandApi.reducerPath]: promotionCommandApi.reducer,



  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      landingApi.middleware,
      packageApi.middleware,
      packageCreateApi.middleware,
      partnershipRequestApi.middleware,
      bookingQueryApi.middleware,
      bookingCommandApi.middleware,
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
      doctorQueryApi.middleware,
      doctorCommandApi.middleware,
      doctorAdminQueryApi.middleware,
      doctorAdminCommandApi.middleware,
      staffQueryApi.middleware,
      staffCommandApi.middleware,
      customerScheduleQueryApi.middleware,
      customerScheduleCommandApi.middleware,
      promotionCommandApi.middleware,

    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
