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
  serviceMessage: service,
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
};

export default vi;
