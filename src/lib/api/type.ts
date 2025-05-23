import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

export interface IResCommon<T> {
  value: T;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors: any;
}
export interface ErrorDetail {
  code: string;
  message: string;
}

export interface ErrorMutationResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors: ErrorDetail[];
}
// New validation error interfaces
export interface ValidationErrorItem {
  code: string;
  message: string;
}

export interface ValidationErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors: ValidationErrorItem[];
}
// Interface cho lỗi 500 và các lỗi khác không có mảng errors
export interface BasicErrorResponse {
  type: string
  title: string
  status: number
  detail: string
}

export type CustomBaseQuery = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
>;

export interface IListResponse<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IResListCommon<T> {
  value: T[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}
