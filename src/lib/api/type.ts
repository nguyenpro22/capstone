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

export interface IErrorResponse {
  success?: boolean;
  status?: number;
  message?: string;
  code?: number;
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