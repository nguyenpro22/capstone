export interface Event {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    clinicName: string;
    clinicId: string;
  }

  export interface EventDetail {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    clinicName: string;
    clinicId: string;
  }
  
  
//   export interface EventDetail extends Event {
//     // Add any additional fields that might be in the detailed view
//   }
  
  export interface CreateEventRequest {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    image?: File | null;
    clinicId: string;
  }
  
  export interface UpdateEventRequest {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    image?: File | null;
    clinicId?: string;
  }
  
  export interface GetEventsParams {
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
    pageIndex: number;
    pageSize: number;
    clinicId?: string;
  }