import { homeMessages } from "./home";
import { landingMessages } from "./landing";
import { navbarMessages } from "./navbar";
import { apiMessages } from "./api";
import { dashboardMessages } from "./dashboard";
import { voucherMessages } from "./voucher";
import { clinicMessages } from "./clinic";
import { serviceMessages } from "./service";
import { branchMessages } from "./branch";

export type Messages = {
  home: homeMessages;
  landing: landingMessages;
  navbar: navbarMessages;
  api: apiMessages;
  dashboard: dashboardMessages;
  voucher: voucherMessages;
  clinic: clinicMessages;
  service: serviceMessages;
  branch: branchMessages;
};
