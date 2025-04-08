

export interface BusyTimeSlot {
    start: string;
    end: string;
    date: string;
  }
  
export  interface BusyTimesResponse {
    value: BusyTimeSlot[]
    isSuccess: boolean
    isFailure: boolean
    error: {
      code: string
      message: string
    }
  }