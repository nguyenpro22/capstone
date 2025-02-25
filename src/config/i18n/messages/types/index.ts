import { homeMessages } from "./home";
import { landingMessages } from "./landing";
import { navbarMessages } from "./navbar";
import { apiMessages } from "./api";
import { dashboardMessages } from "./dashboard";
import { voucherMessages } from "./voucher";

export type Messages = {
  home: homeMessages;
  landing: landingMessages;
  navbar: navbarMessages;
  api: apiMessages;
  dashboard: dashboardMessages;
  voucher: voucherMessages;
};
