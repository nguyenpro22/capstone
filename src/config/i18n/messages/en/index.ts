import { branchCommandApi } from "@/features/branch/api";
import { apiMessages } from "./api";
import { clinicMessages } from "./clinic";
import { dashboardMessages } from "./dashboard";
import { homeMessage } from "./home";
import { landingMessages } from "./landing";
import { navbarMessages } from "./navbar";
import { serviceMessages } from "./service";
import { voucherMessages } from "./voucher";
import { branchMessages } from "./branch";


const en = {
  home: homeMessage,
  navbar: navbarMessages,
  voucher: voucherMessages,
  landing: landingMessages,
  dashboard: dashboardMessages,
  api: apiMessages,
  clinic: clinicMessages,
  service: serviceMessages,
  branch: branchMessages,
};

export default en;
