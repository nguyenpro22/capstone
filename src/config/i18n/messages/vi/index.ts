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
import { adminSidebar } from "./adminSideBar";

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
  adminSidebar,
};

export default vi;
