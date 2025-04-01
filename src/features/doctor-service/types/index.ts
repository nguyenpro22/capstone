// Định nghĩa các types cho doctor-service

export interface Doctor {
    id: string
    name: string
    profilePictureUrl?: string
    specialization?: string
    email?: string
    phoneNumber?: string
  }
  
  export interface DoctorService {
    id: string
    doctor: Doctor
    service: {
      id: string
      name: string
    }
  }
  
  export interface DoctorServiceResponse {
    value: DoctorService[]
    isSuccess: boolean
    isFailure: boolean
    error: {
      code: string
      message: string
    }
  }
  
  export interface DoctorResponse {
    value: {
      items: Doctor[]
      totalCount: number
      pageIndex: number
      pageSize: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
    isSuccess: boolean
    isFailure: boolean
    error: {
      code: string
      message: string
    }
  }
  
  export interface DoctorServiceRequest {
    doctorId: string
    serviceIds: string[]
  }
  
  