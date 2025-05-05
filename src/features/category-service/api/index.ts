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
      query: ({ pageIndex = 1, pageSize = 10, searchTerm = "" }) => {
        // Prepare the search term with the fixed filter
        const baseSearchTerm = "IsParent==true and name="
        const fullSearchTerm = searchTerm ? `${baseSearchTerm}${searchTerm}` : baseSearchTerm

        // Encode the search term to handle special characters
        const encodedSearchTerm = encodeURIComponent(fullSearchTerm)

        return `/categories?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${encodedSearchTerm}&sortOrder=desc`
      },
    }),
    getAllCategories: builder.query<IResCommon<IListResponse<CategoryDetail>>, void>({
      query: () => `/categories?pageIndex=1&pageSize=1000&sortOrder=desc&searchTerm=IsParent==true`,
    }),

    getAllCategoriesV2: builder.query<IResCommon<IListResponse<CategoryDetail>>, void>({
      query: () => `/categories?pageIndex=1&pageSize=1000&sortOrder=desc&searchTerm=IsParent==false`,
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
        body: data, 
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
        body: { id }, // Gửi ID trong body
      }),
    }),
    moveCategory: builder.mutation({
      query: ({ subCategoryId, categoryId }) => ({
        url: `/categories/${categoryId}/${subCategoryId}`,
        method: "PATCH"
       
      }),
    }),

  }),
});

export const { useGetCategoriesQuery, useLazyGetCategoryByIdQuery,
  useGetAllCategoriesQuery,
  useGetAllCategoriesV2Query,
 } = categoryQueryApi;
export const { useCreateCategoryMutation,
              useUpdateCategoryMutation, // Thêm API cập nhật gói
              useDeleteCategoryMutation,
              useMoveCategoryMutation,
              } = categoryCommandApi;
