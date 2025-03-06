import { IListResponse, IResCommon, reAuthQuery } from '@/lib/api';
import { CategoryDetail, CategoryDetailResponse } from './../types/index';
import { createApi } from '@reduxjs/toolkit/query/react';


// API GET chạy trên port 3000
export const categoryQueryApi = createApi({
  reducerPath: 'categoryQueryApi',
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getCategories: builder.query<
      IResCommon<IListResponse<CategoryDetail>>,
      { pageIndex?: number; pageSize?: number; searchTerm?: string }
    >({
      query: ({ pageIndex = 1, pageSize = 10, searchTerm = "" }) =>
        `/categories?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortOrder=desc`,
    }),
    getCategoryById: builder.query<IResCommon<CategoryDetail>, string>({
      query: (id) => `categories/${id}?id=${id}`,
    }),
  }),
});

// API POST chạy trên port 4000
export const categoryCommandApi = createApi({
  reducerPath: 'categoryCommandApi',
  baseQuery: reAuthQuery("command"),
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/categories",
        method: "POST",
        body: newCategory,
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ data }) => ({
        url: `/categories/${data.id}?id=${data.id}`,
        method: "PUT",
        body: data, // Không cần gửi `id` trong body vì nó đã có trong URL
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
        body: { id }, // Gửi ID trong body
      }),
    }),

  }),
});

export const { useGetCategoriesQuery, useLazyGetCategoryByIdQuery } = categoryQueryApi;
export const { useCreateCategoryMutation,
              useUpdateCategoryMutation, // Thêm API cập nhật gói
              useDeleteCategoryMutation,
              } = categoryCommandApi;
