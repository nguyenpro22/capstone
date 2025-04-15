export interface ClinicDashboard{
    totalBranch: number,
    totalBranchActive: number,
    totalBranchInActive: number,
    totalStaff: number,
    totalService: number,
    totalDoctor: number
}
export interface ClinicDashboardInformation {
    totalCountOrderCustomer: number;
    totalCountScheduleCustomer: number;
    totalCountCustomerSchedule: number;
    totalCountCustomerSchedulePending: number;
    totalCountCustomerScheduleInProgress: number;
    totalCountCustomerScheduleCompleted: number;
    totalSumRevenue: number;
    totalCountOrderPending: number;
    totalSumRevenueNormal: number;
    totalSumRevenueLiveStream: number;
  }

  export interface AdminDashboardInformation {
    totalCountBranding: number;
  totalCountBranches: number;
  totalCountBrandPending: number;
  totalCountService: number;
  totalCountDoctor: number;
  totalCountBronzeSubscription: number;
  totalCountSilverSubscription: number;
  totalCountGoldSubscription: number;
  totalSumRevenue: number;
  totalSystemSumRevenue: number;
  totalSumBronzeSubscriptionRevenue: number;
  totalSumSilverSubscriptionRevenue: number;
  totalSumGoldSubscriptionRevenue: number;
  totalSumClinicRevenue: number;
  }
  
  
  export interface ClinicDashboardDateTimeItem {
    information: ClinicDashboardInformation;
    startDate: string;
    endDate: string;
  }
  export interface AdminDashboardDateTimeItem {
    information: AdminDashboardInformation;
    startDate: string;
    endDate: string;
  }
  
  export interface ClinicDashboardDateTimeResponse {
    datetimeInformation: ClinicDashboardInformation | null;
    datetimeInformationList: ClinicDashboardDateTimeItem[];
  }

  export interface AdminDashboardDateTimeResponse {
    systemInformation: AdminDashboardInformation | null;
    systemInformationList: AdminDashboardDateTimeItem[];
  }
  
  