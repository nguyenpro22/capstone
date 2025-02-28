import { serviceMessages } from './service';
import { apiMessages } from "./api";
import { clinicMessages } from "./clinic";
import { dashboardMessages } from "./dashboard";
import { homeMessage } from "./home";
import { landingMessages } from "./landing";
import { navbarMessages } from "./navbar";
import { voucherMessages } from "./voucher";

const vi = {
  home: homeMessage,
  navbar: navbarMessages,
  voucher: voucherMessages,
  landing: landingMessages,
  dashboard: dashboardMessages,
  api: apiMessages,
  clinic: clinicMessages,
  service: serviceMessages,
};

export default vi;
