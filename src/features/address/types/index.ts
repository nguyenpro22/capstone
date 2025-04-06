// Define the base response structure
export interface BaseResponse<T> {
    error: number
    error_text: string
    data_name: string
    data: T[]
  }

export interface AddressDetail {
    provinceId: string
    provinceName: string
    districtId: string
    districtName: string
    wardId: string
    wardName: string
    streetAddress: string
  }
  
  // Province/City data structure
  export interface Province {
    id: string
    name: string
    name_en: string
    full_name: string
    full_name_en: string
    latitude: string
    longitude: string
  }
  
  // District data structure
  export interface District {
    id: string
    name: string
    name_en: string
    full_name: string
    full_name_en: string
    latitude: string
    longitude: string
  }
  
  // Ward data structure
  export interface Ward {
    id: string
    name: string
    name_en: string
    full_name: string
    full_name_en: string
    latitude: string
    longitude: string
  }
  
  // Response types for each API endpoint
  export type ProvinceResponse = BaseResponse<Province>
  export type DistrictResponse = BaseResponse<District>
  export type WardResponse = BaseResponse<Ward>
  
  // Location name response
  export interface LocationNameResponse {
    error: number
    error_text: string
    data_name: string
    data: {
      id: string
      name: string
      path: string
      path_with_type: string
    }
  }
  
  