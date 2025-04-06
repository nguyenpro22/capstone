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
import { doctor } from "./doctor";
import { serviceDetail } from "./serivceDetail";
import { registerClinic } from "./registerClinic";
import { doctorMessages } from "./doctor";
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
  doctor,
  login: loginMessage,
  forgotPassword,
  register,
  serviceDetail,
  registerClinic,
  doctor: doctorMessages,
  staff: staffMessages
};

export default en;
