import { Package } from './../types/index';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface PackageDetailResponse {
  value: Package;
  isSuccess: boolean;
}
// API GET chạy trên port 3000
export const packageApi = createApi({
  reducerPath: 'packageApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://160.187.240.214:3000/api/v1' }),
  endpoints: (builder) => ({
    getPackages: builder.query({
      query: ({ pageIndex, pageSize, searchTerm }) => `/subscriptions?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
    }),
    getPackagesById: builder.query<PackageDetailResponse, string>({
      query: (id) => `subscriptions/${id}`,
    }),
  }),
});

// API POST chạy trên port 4000
export const packageCreateApi = createApi({
  reducerPath: 'packageCreateApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://160.187.240.214:4000/api/v1' }),
  endpoints: (builder) => ({
    createPackage: builder.mutation({
      query: (newPackage) => ({
        url: "/subscriptions",
        method: "POST",
        body: newPackage,
      }),
    }),
    updatePackage: builder.mutation({
      query: (updatedPackage) => ({
        url: "/subscriptions",
        method: "PUT",
        body: updatedPackage,
      }),
    }),
    deletePackage: builder.mutation({
      query: (id) => ({
        url: "/subscriptions",
        method: "DELETE",
        body: { id }, // Gửi ID trong body
      }),
    }),
    activatePackage: builder.mutation({
      query: (packageId) => ({
        url: "/subscriptions/activate",
        method: "PUT",
        body: { id: packageId },
      }),
    }),
    deactivatePackage: builder.mutation({
      query: (packageId) => ({
        url: "/subscriptions/deactivate",
        method: "PUT",
        body: { id: packageId },
      }),
    }),
  }),
});

export const { useGetPackagesQuery, useLazyGetPackagesByIdQuery } = packageApi;
export const { useCreatePackageMutation,
              useUpdatePackageMutation, // Thêm API cập nhật gói
              useDeletePackageMutation,
              useActivatePackageMutation,
              useDeactivatePackageMutation, 
              } = packageCreateApi;
