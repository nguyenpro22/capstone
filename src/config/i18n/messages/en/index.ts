import { packageMessages } from './package';
import { apiMessages } from "./api";
import { clinicMessages } from "./clinic";
import { dashboardMessages } from "./dashboard";
import { homeMessages } from "./home";
import { landingMessages } from "./landing";
import { navbarMessages } from "./navbar";
import { service, serviceMessages } from "./service";
import { voucherMessages } from "./voucher";
import { branchMessages } from "./branch";
import { loginMessage } from "./login";
import { forgotPassword } from "./forgot-password";
import { register } from "./register";
import { serviceDetail } from "./serivceDetail";
import { registerClinic } from "./registerClinic";
import { doctorMessages } from "./staffDoctor";
import { staffMessages } from "./staff";
import { clinicProfileMessages } from "./clinicProfile";
import { livestream } from "./livestream";
import { livestreamRoom } from "./livestream-room";
import { bookingFlowMessages } from './booking-flow';
import { sidebarMessages } from './sidebar';
import { navbarAdminMessages } from './navbarAdmin';
import { buyPackageMessages } from './buy-package';

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
  login: loginMessage,
  forgotPassword,
  register,
  serviceDetail,
  registerClinic,
  staffDoctor: doctorMessages,
  staff: staffMessages,
  serviceMessage: service,
  clinicProfile: clinicProfileMessages,
  livestream,
  livestreamRoom,
  package: packageMessages,
  bookingFlow : bookingFlowMessages,
  sidebar: sidebarMessages,
  navbarAdmin: navbarAdminMessages,
  buyPackage: buyPackageMessages
};

export default en;
