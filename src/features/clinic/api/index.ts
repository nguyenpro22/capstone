import { createApi } from "@reduxjs/toolkit/query/react";
import {
  Clinic,
  ClinicDetailResponse,
  ClinicsResponse,
  Branch,
  Staff,
  Doctor,
  ClinicBranchesData,
  ClinicBranchData,
} from "@/features/clinic/types";
import { IListResponse, IResCommon, reAuthQuery } from "@/lib/api";

export const clinicsQueryApi = createApi({
  reducerPath: "clinicsQueryApi",
  baseQuery: reAuthQuery("query"), // 👉 Dùng port 3000
  tagTypes: ["Clinic"],
  endpoints: (builder) => ({
    getClinics: builder.query<
      ClinicsResponse,
      { pageIndex: number; pageSize: number; searchTerm: string }
    >({
      query: ({ pageIndex, pageSize, searchTerm }) =>
        `clinics?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
    }),
    getClinicById: builder.query<ClinicDetailResponse, string>({
      query: (id) => `clinics/${id}`,
    }),
    getClinicByIdV2: builder.query<IResCommon<Branch>, string>({
      query: (id) => `clinics/${id}`,
    }),
    getBranches: builder.query<IResCommon<Branch>, string>({
      // query: ({ pageIndex = 1, pageSize = 10, serchTerm=""}) => `/clinics?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${serchTerm}&sortOrder=desc`,
      query: (id) => `/clinics/${id}?id=${id}`,
    }),
    getBranchById: builder.query<IResCommon<Branch>, string>({
      query: (id) => `clinics/${id}?id=${id}`,
    }),
    // Thêm endpoint này vào trong phần endpoints của clinicsQueryApi
    getAllBranches: builder.query<IResCommon<ClinicBranchesData>, void>({
      query: () => `clinics/branches`,
      providesTags: ["Clinic"],
    }),
    getBranchDetailById: builder.query<IResCommon<ClinicBranchData>, string>({
      query: (clinicId) => `clinics/sub-clinics/${clinicId}`,
      providesTags: ["Clinic"],
    }),

   
  }),
});

export const clinicsCommandApi = createApi({
  reducerPath: "clinicsCommandApi",
  baseQuery: reAuthQuery("command"), // 👉 Dùng port 4000
  tagTypes: ["Clinic","Schedule"],
  endpoints: (builder) => ({
    updateClinic: builder.mutation<
      Clinic,
      { clinicId: string; data: FormData }
    >({
      query: ({ clinicId, data }) => ({
        url: `/clinics/${clinicId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Clinic", id: "LIST" }],
    }),
    createBranch: builder.mutation<any, { clinicId: string; data: FormData }>({
      query: ({ clinicId, data }) => ({
        url: `clinics/${clinicId}/branches`,
        method: "POST",
        body: data, // Truyền trực tiếp FormData
      }),
    }),
    updateBranch: builder.mutation<
      Branch,
      { clinicId: string; branchId: string; data: FormData }
    >({
      query: ({ clinicId, branchId, data }) => ({
        url: `clinics/${clinicId}/branches/${branchId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Clinic", id: "LIST" }],
    }),
    changeStatusBranch: builder.mutation({
      query: ({ id }) => ({
        url: `clinics/${id}/status`,
        method: "PATCH",
      
      }),
    }),
    
  }),
});

// Query API for GET operations
export const staffQueryApi = createApi({
  reducerPath: "staffQueryApi",
  baseQuery: reAuthQuery("query"), // Using port 3000
  tagTypes: ["Staff"],
  endpoints: (builder) => ({
    getStaff: builder.query<
      IResCommon<IListResponse<Staff>>,
      {
        clinicId: string;
        pageIndex: number;
        pageSize: number;
        searchTerm: string;
        role: number;
      }
    >({
      query: ({ clinicId, pageIndex, pageSize, searchTerm, role }) =>
        `clinics/${clinicId}/employees?role=${role}&pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
      providesTags: ["Staff"],
    }),
    getStaffById: builder.query<
      IResCommon<Staff>,
      { clinicId: string; staffId: string }
    >({
      query: ({ clinicId, staffId }) =>
        `clinics/${clinicId}/employees/${staffId}`,
      providesTags: (result, error, { staffId }) => [
        { type: "Staff", id: staffId },
      ],
    }),
    getStaffByClinic: builder.query<
      IResCommon<IListResponse<Staff>>,
      { id: string; pageIndex: number; pageSize: number; searchTerm: string }
    >({
      query: ({ id, pageIndex, pageSize, searchTerm }) =>
        `clinics/${id}/accounts?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
      providesTags: ["Staff"],
    }),
  }),
});

// Command API for POST/PUT/DELETE operations
export const staffCommandApi = createApi({
  reducerPath: "staffCommandApi",
  baseQuery: reAuthQuery("command"), // Using port 4000
  tagTypes: ["Staff"],
  endpoints: (builder) => ({
    // Updated to match createBranch pattern with additional id parameter
    addStaff: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/clinics/${id}/accounts`,
        method: "POST",
        body: data, // Pass FormData directly
      }),
    }),
    updateStaff: builder.mutation<void, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/clinics/${id}/accounts`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error) => [{ type: "Staff" }, "Staff"],
    }),
    deleteStaff: builder.mutation<void, { id: string; accountId: string }>({
      query: ({ id, accountId }) => ({
        url: `/clinics/${id}/accounts/${accountId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staff"],
    }),
    changeStaffStatus: builder.mutation<
      void,
      { id: string; accountId: string }
    >({
      query: ({ id, accountId }) => ({
        url: `/clinics/${id}/accounts/${accountId}/status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { accountId }) => [
        { type: "Staff", id: accountId },
        "Staff",
      ],
    }),
  }),
});

export const doctorAdminQueryApi = createApi({
  reducerPath: "doctorAdminQueryApi",
  baseQuery: reAuthQuery("query"), // Using port 3000
  tagTypes: ["Doctor"],
  endpoints: (builder) => ({
    getDoctors: builder.query<
      IResCommon<IListResponse<Doctor>>,
      {
        clinicId: string;
        pageIndex: number;
        pageSize: number;
        searchTerm: string;
        role: number;
      }
    >({
      query: ({ clinicId, pageIndex, pageSize, searchTerm, role }) =>
        `clinics/${clinicId}/employees?role=${role}&pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
      
      providesTags: ["Doctor"],
    }),
    getDoctorById: builder.query<
      IResCommon<Doctor>,
      { clinicId: string; employeeId: string }
    >({
      query: ({ clinicId, employeeId }) =>
        `clinics/${clinicId}/employees/${employeeId}`,
      providesTags: (result, error, { employeeId }) => [
        { type: "Doctor", id: employeeId },
      ],
    }),
    getDoctorByClinic: builder.query<
      IResCommon<IListResponse<Doctor>>,
      { id: string; pageIndex: number; pageSize: number; searchTerm: string }
    >({
      query: ({ id, pageIndex, pageSize, searchTerm }) =>
        `clinics/${id}/accounts?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
      providesTags: ["Doctor"],
    }),
  }),
});

// Command API for POST/PUT/DELETE operations
export const doctorAdminCommandApi = createApi({
  reducerPath: "doctorAdminCommandApi",
  baseQuery: reAuthQuery("command"), // Using port 4000
  tagTypes: ["Doctor"],
  endpoints: (builder) => ({
    // Updated to match createBranch pattern with additional id parameter
    addDoctor: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/clinics/${id}/accounts`,
        method: "POST",
        body: data, // Pass FormData directly
      }),
    }),
    updateDoctor: builder.mutation<void, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/clinics/${id}/accounts`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error) => [{ type: "Doctor" }, "Doctor"],
    }),
    deleteDoctor: builder.mutation<void, { id: string; accountId: string }>({
      query: ({ id, accountId }) => ({
        url: `/clinics/${id}/accounts/${accountId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctor"],
    }),
    changeDoctorStatus: builder.mutation<
      void,
      { id: string; accountId: string }
    >({
      query: ({ id, accountId }) => ({
        url: `/clinics/${id}/accounts/${accountId}/status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { accountId }) => [
        { type: "Doctor", id: accountId },
        "Doctor",
      ],
    }),

    // New endpoint for updating doctor's branch
    changeDoctorBranch: builder.mutation<void, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `clinics/${id}/staff/doctor`,
        method: "PATCH",
        body: data,
        formData: true, // Important for multipart/form-data
      }),
      invalidatesTags: ["Doctor"],
    }),
  }),
});

export const {
  useGetClinicsQuery,
  useLazyGetClinicByIdQuery,
  useGetClinicByIdQuery,
  useGetBranchesQuery,
  useLazyGetBranchByIdQuery,
  useGetClinicByIdV2Query,
  useGetAllBranchesQuery, // Thêm hook mới này
  useGetBranchDetailByIdQuery,

} = clinicsQueryApi;

export const {
  useUpdateClinicMutation,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useChangeStatusBranchMutation,
} = clinicsCommandApi;

export const {
  useGetStaffQuery,
  useLazyGetStaffByIdQuery,
  useGetStaffByClinicQuery,
} = staffQueryApi;

// Export hooks for the command API
export const {
  useAddStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useChangeStaffStatusMutation,
} = staffCommandApi;

// Export the hooks
export const {
  useGetDoctorsQuery,
  useLazyGetDoctorByIdQuery,
  useGetDoctorByClinicQuery,
} = doctorAdminQueryApi;

export const {
  useAddDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
  useChangeDoctorStatusMutation,
  useChangeDoctorBranchMutation,
} = doctorAdminCommandApi;
