import { branchCommandApi } from "@/features/branch/api";
import { apiMessages } from "./api";
import { clinicMessages } from "./clinic";
import { dashboardMessages } from "./dashboard";
import { homeMessages } from "./home";
import { landingMessages } from "./landing";
import { navbarMessages } from "./navbar";
import { serviceMessages } from "./service";
import { voucherMessages } from "./voucher";
import { branchMessages } from "./branch";
import { serviceMessages as doctorServiceMessage } from "./doctor/service";
import { appointments as doctorAppointments } from "./doctor/appointments";
import { calendar as doctorCalendar } from "./doctor/calendar";
import { dashboard as doctorDashboard } from "./doctor/dashboard";
import { patientMessages as doctorPatients } from "./doctor/patients";
import { profile as doctorProfile } from "./doctor/profile";
import { common as doctorCommon } from "./doctor/common";

const en = {
  home: homeMessages,
  navbar: navbarMessages,
  voucher: voucherMessages,
  landing: landingMessages,
  dashboard: dashboardMessages,
  api: apiMessages,
  clinic: clinicMessages,
  service: serviceMessages,
  branch: branchMessages,
  doctorService: doctorServiceMessage,
  doctorAppointments: doctorAppointments,
  doctorCalendar: doctorCalendar,
  doctorDashboard: doctorDashboard,
  doctorPatients: doctorPatients,
  doctorProfile: doctorProfile,
  doctorCommon: doctorCommon,
};

export default en;
