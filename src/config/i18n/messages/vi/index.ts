
import { staffMessages } from './staff';
import { serviceMessages } from './service';

import { apiMessages } from "./api";
import { clinicMessages } from "./clinic";
import { dashboardMessages } from "./dashboard";
import { homeMessages } from "./home";
import { landingMessages } from "./landing";
import { navbarMessages } from "./navbar";
import { voucherMessages } from "./voucher";

import { branchMessages } from './branch';
import { doctorMessages } from './doctor';


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

  doctor: doctorMessages,
  staff: staffMessages

};

export default vi;
