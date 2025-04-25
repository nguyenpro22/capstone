import { packageMessages } from "./package";
import { staffMessages } from "./staff";
import { service, serviceMessages } from "./service";
import { apiMessages } from "./api";
import { clinicMessages } from "./clinic";
import { dashboardMessages } from "./dashboard";
import { homeMessages } from "./home";
import { landingMessages } from "./landing";
import { navbarMessages } from "./navbar";
import { voucherMessages } from "./voucher";
import { branchMessages } from "./branch";
import { doctorMessages } from "./staffDoctor";
import { loginMessage } from "./login";
import { forgotPassword } from "./forgot-password";
import { register } from "./register";
import { serviceDetail } from "./serivceDetail";
import { registerClinic } from "./registerClinic";
import { livestream } from "./livestream";
import { livestreamRoom } from "./livestream-room";
import { clinicProfileMessages } from "./clinicProfile";

import { bookingFlowMessages } from "./booking-flow";
import { sidebarMessages } from "./sidebar";
import { navbarAdminMessages } from "./navbarAdmin";
import { buyPackageMessages } from "./buy-package";
import { clinicView } from "./clinic-view";
import { clinicCard } from "./clinicCard";
import { clinicViewDetail } from "./clinic-view-detail";

import { customerScheduleMessage } from "./customerSchedule";
import { clinicStaffServicePageMessages } from "./clinicStaffService";
import { clinicStaffOrderMessages } from "./clinicStaffOrder";
import { clinicStaffAppointmentMessages } from "./clinicStaffAppointment";
import { scheduleApprovalMessages } from "./scheduleApproval";
import { doctor } from "./doctor";
import { doctorProfile } from "./doctor-profile";
import { doctorCertificate } from "./doctor-certificate";
import { categoryMessages } from "./category";
import { walletMessages } from "./wallet";
import { chatMessages } from "./chat";
import { withdrawalMessages } from "./withdrawal";
import { orderMessages } from "./order";
import { orderDetail } from "./order-detail";
import { workingScheduleMessages } from "./working-schedule";
import { paginationMessages } from "./pagination";
import { registerSchedule } from "./register-schedule";
import { profileMessages } from "./profile";
import { configs } from "./configs";

const vi = {
  home: homeMessages,
  navbar: navbarMessages,
  voucher: voucherMessages,
  landing: landingMessages,
  dashboard: dashboardMessages,
  api: apiMessages,
  clinic: clinicMessages,
  service: serviceMessages,
  branch: branchMessages,
  staffDoctor: doctorMessages,
  staff: staffMessages,
  serviceMessages: service,
  login: loginMessage,
  forgotPassword,
  register,
  serviceDetail,
  registerClinic,
  livestream,
  livestreamRoom,
  clinicProfile: clinicProfileMessages,
  package: packageMessages,
  bookingFlow: bookingFlowMessages,
  sidebar: sidebarMessages,
  navbarAdmin: navbarAdminMessages,
  buyPackage: buyPackageMessages,
  clinicView,
  clinicViewDetail,
  clinicCard,
  customerSchedule: customerScheduleMessage,
  clinicStaffService: clinicStaffServicePageMessages,
  clinicStaffOrder: clinicStaffOrderMessages,
  clinicStaffAppointment: clinicStaffAppointmentMessages,
  scheduleApproval: scheduleApprovalMessages,
  doctor,
  doctorProfile,
  doctorCertificate,
  category: categoryMessages,
  wallet: walletMessages,
  chat: chatMessages,
  withdrawal: withdrawalMessages,
  orderMessages,
  orderDetail,
  workingSchedule: workingScheduleMessages,
  pagination: paginationMessages,
  registerSchedule,
  profile: profileMessages,
  configs,
};

export default vi;
