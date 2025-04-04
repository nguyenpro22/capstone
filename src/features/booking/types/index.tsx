export interface AppointmentCounts {
    total: number
    completed: number
    inProgress: number
    pending: number
    cancelled: number
  }
  
  export interface DailyData {
    date: string
    counts: AppointmentCounts
  }
  
  export interface Customer {
    id: string
    name: string
    avatar: string | null
  }
  
  export interface Service {
    id: string
    name: string
  }
  
  export interface Doctor {
    id: string
    name: string
  }
  
  export interface Clinic {
    id: string
    name: string
  }
  
  export interface Appointment {
    id: string
    customer: Customer
    service: Service
    startTime: string
    endTime: string
    duration: string
    status: string
    doctor: Doctor
    clinic: Clinic
  }
  
  