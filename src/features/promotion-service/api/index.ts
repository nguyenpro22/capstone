import { reAuthQuery } from '@/lib/api';
import { PromotionDetailResponse } from './../types/index';
import { createApi } from '@reduxjs/toolkit/query/react';


// API GET chạy trên port 3000
export const promotionQueryApi = createApi({
  reducerPath: 'promotionQueryApi',
  baseQuery: reAuthQuery("query"),
  endpoints: (builder) => ({
    getPromotions: builder.query({
      query: ({ pageIndex, pageSize, searchTerm }) => `/servicePromotions?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortOrder=desc`,
    }),
    getPromotionById: builder.query<PromotionDetailResponse, string>({
      query: (id) => `servicePromotions/${id}?id=${id}`,
    }),
  }),
});
// API POST chạy trên port 4000

export const promotionCommandApi = createApi({
    reducerPath: "promotionCommandApi",
    baseQuery: reAuthQuery("command"), // Chạy trên port 4000
    endpoints: (builder) => ({
      createPromotion: builder.mutation<any, { data: FormData }>({
        query: ({ data }) => ({
          url: "/servicePromotions",
          method: "POST",
          body: data, // Truyền trực tiếp FormData
        }),
      }),
      updatePromotion: builder.mutation<any, { id: string; data: FormData }>({
        query: ({ id, data }) => ({
          url: `/servicePromotions/${id}`,
          method: "PUT",
          body: data, // Truyền trực tiếp FormData
        }),
      }),
      deletePromotion: builder.mutation<any, { id: string }>({ // Chỉnh lại kiểu tham số
        query: ({ id }) => ({
          url: `servicePromotions/${id}?id=${id}`, // Không cần truyền id trên query string lần nữa
          method: "DELETE",
          body: { id }, // Truyền request body đúng định dạng
          headers: {
            "Content-Type": "application/json", // Đảm bảo server hiểu đây là JSON
          },
        }),
      }),
    }),
  });

  export const { useCreatePromotionMutation,
                useUpdatePromotionMutation, // Thêm API cập nhật gói
                useDeletePromotionMutation,
                } = promotionCommandApi;