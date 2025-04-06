import { apiMessages } from "./api";
import { clinicMessages } from "./clinic";
import { dashboardMessages } from "./dashboard";
import { homeMessages } from "./home";
import { landingMessages } from "./landing";
import { navbarMessages } from "./navbar";
import { serviceMessages } from "./service";
import { voucherMessages } from "./voucher";
import { branchMessages } from "./branch";
import { loginMessage } from "./login";
import { forgotPassword } from "./forgot-password";
import { register } from "./register";
import { serviceDetail } from "./serivceDetail";
import { registerClinic } from "./registerClinic";
import { doctorMessages } from "./staffDoctor";
import { staffMessages } from "./staff";


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
  staff: staffMessages
};

export default en;
