import { reAuthQuery } from '@/lib/api';
import { PackageDetailResponse } from './../types/index';
import { createApi } from '@reduxjs/toolkit/query/react';


// API GET chạy trên port 3000
export const packageApi = createApi({
  reducerPath: 'packageApi',
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getPackages: builder.query({
      query: ({ pageIndex, pageSize, searchTerm }) => `/subscriptions?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortOrder=asc`,
    }),
    getPackagesById: builder.query<PackageDetailResponse, string>({
      query: (id) => `subscriptions/${id}?id=${id}`,
    }),
  }),
});

// API POST chạy trên port 4000
export const packageCreateApi = createApi({
  reducerPath: 'packageCreateApi',
  baseQuery: reAuthQuery("command"),
  endpoints: (builder) => ({
    createPackage: builder.mutation({
      query: (newPackage) => ({
        url: "/subscriptions",
        method: "POST",
        body: newPackage,
      }),
    }),
    updatePackage: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/subscriptions/${id}`, // Sử dụng documentId trong URL nếu cần
        method: "PUT",
        body: { id: id, ...rest }, // Chuyển documentId thành id trong request body
      }),
    }),
    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/subscriptions/${id}`,
        method: "DELETE",
        body: { id }, // Gửi ID trong body
      }),
    }),
    changeStatusPackage: builder.mutation({
      query: ({ packageId }) => ({
        url: `/subscriptions/change-status/${packageId}`, // Truyền ID vào URL
        method: "PUT",
        params: { id: packageId }, // ID trong parameters
        // body: { packageId, isActivated },
      }),
    }),
  }),
});

export const { useGetPackagesQuery, useLazyGetPackagesByIdQuery, useGetPackagesByIdQuery } = packageApi;
export const { useCreatePackageMutation,
              useUpdatePackageMutation, // Thêm API cập nhật gói
              useDeletePackageMutation,
              useChangeStatusPackageMutation,
              } = packageCreateApi;
