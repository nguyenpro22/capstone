import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ProvinceResponse, DistrictResponse, WardResponse, LocationNameResponse } from "../types"

// Define the address API using RTK Query
export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://esgoo.net/api-tinhthanh" }),
  endpoints: (builder) => ({
    // Get all provinces/cities
    getProvinces: builder.query<ProvinceResponse, void>({
      query: () => "/1/0.htm",
    }),

    // Get districts for a specific province
    getDistricts: builder.query<DistrictResponse, string>({
      query: (provinceId) => `/2/${provinceId}.htm`,
    }),

    // Get wards for a specific district
    getWards: builder.query<WardResponse, string>({
      query: (districtId) => `/3/${districtId}.htm`,
    }),

    // Get all location data
    getAllLocationData: builder.query<any, void>({
      query: () => "/4/0.htm",
    }),

    // Get location name details by ID
    getLocationNameById: builder.query<LocationNameResponse, string>({
      query: (locationId) => `/5/${locationId}.htm`,
    }),
  }),
})

// Export the auto-generated hooks for each endpoint
export const {
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetWardsQuery,
  useGetAllLocationDataQuery,
  useGetLocationNameByIdQuery,
} = addressApi

// Export the API for use in the Redux store
export default addressApi

