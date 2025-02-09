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
      query: ({ pageIndex, pageSize, searchTerm }) => `/subscriptions?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortOrder=desc`,
    }),
    getPackagesById: builder.query<PackageDetailResponse, string>({
      query: (id) => `subscriptions/${id}?id=${id}`,
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
      query: ({ documentId, ...rest }) => ({
        url: `/subscriptions`, // Sử dụng documentId trong URL nếu cần
        method: "PUT",
        body: { id: documentId, ...rest }, // Chuyển documentId thành id trong request body
      }),
    }),
    deletePackage: builder.mutation({
      query: (id) => ({
        url: "/subscriptions",
        method: "DELETE",
        body: { id }, // Gửi ID trong body
      }),
    }),
    changeStatusPackage: builder.mutation({
      query: ({ packageId }) => ({
        url: `/subscriptions/${packageId}/change-status`, // Truyền ID vào URL
        method: "PUT",
        params: { id: packageId }, // ID trong parameters
      }),
    }),
  }),
});

export const { useGetPackagesQuery, useLazyGetPackagesByIdQuery } = packageApi;
export const { useCreatePackageMutation,
              useUpdatePackageMutation, // Thêm API cập nhật gói
              useDeletePackageMutation,
              useChangeStatusPackageMutation,
              } = packageCreateApi;
