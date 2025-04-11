"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Ticket,
  Archive,
  Settings,
  LogOut,
  Building2,
  ClipboardList,
  Inbox,
  Video,
  User,
  Home,
  Layers,
  ShoppingBag,
  Users,
  Stethoscope,
  UserCircle,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { handleLogout } from "@/features/auth/utils";
import { useTranslations } from "next-intl";

type SidebarProps = {
  role:
    | "systemAdmin"
    | "user"
    | "systemStaff"
    | "clinicManager"
    | "clinicStaff";
  onClose?: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const menuItems = {
  systemAdmin: [
    {
      label: "Dashboard",
      path: "/systemAdmin/dashboard",
      icon: LayoutDashboard,
    },
    { label: "Voucher", path: "/systemAdmin/voucher", icon: Ticket },
    { label: "Package", path: "/systemAdmin/package", icon: Archive },
    {
      label: "Category Services",
      path: "/systemAdmin/category-service",
      icon: Layers,
    },
    { label: "Settings", path: "/systemAdmin/settings", icon: Settings },
    { label: "Logout", path: "/logout", icon: LogOut },
  ],
  systemStaff: [
    { label: "User", path: "/systemStaff/user", icon: User },
    { label: "Clinic", path: "/systemStaff/clinic", icon: Building2 },
    { label: "Partnership", path: "/systemStaff/partnership", icon: Layers },
    { label: "Settings", path: "/systemStaff/setting", icon: Settings },
    { label: "Logout", path: "/logout", icon: LogOut },
  ],
  clinicManager: [
    {
      label: "Dashboard",
      path: "/clinicManager/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Branch Management",
      path: "/clinicManager/branch",
      icon: Building2,
    },
    { label: "Staff Management", path: "/clinicManager/staff", icon: Users },
    {
      label: "Doctor Management",
      path: "/clinicManager/doctor",
      icon: Stethoscope,
    },
    { label: "Service", path: "/clinicManager/service", icon: Ticket },
    { label: "Order", path: "/clinicManager/order", icon: ClipboardList },
    {
      label: "Buy Package",
      path: "/clinicManager/buy-package",
      icon: ShoppingBag,
    },
    { label: "Inbox", path: "/clinicManager/inbox", icon: Inbox },
    { label: "Live Stream", path: "/clinicManager/live-stream", icon: Video },
    { label: "Profile", path: "/clinicManager/profile", icon: UserCircle },
    { label: "Settings", path: "/clinicManager/settings", icon: Settings },
    { label: "Logout", path: "/logout", icon: LogOut },
  ],
  clinicStaff: [
    {
      label: "Dashboard",
      path: "/clinicStaff/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Schedule Approval",
      path: "/clinicStaff/schedule-approval",
      icon: Layers,
    },
    {
      label: "Customer Schedules",
      path: "/clinicStaff/customer-schedule",
      icon: Calendar,
    },
    { label: "Appointments", path: "/clinicStaff/appointment", icon: Clock },
    { label: "Branch Doctors", path: "/clinicStaff/doctor", icon: Stethoscope },
    { label: "Service", path: "/clinicStaff/service", icon: Ticket },
    { label: "Order", path: "/clinicStaff/order", icon: ClipboardList },
    { label: "Inbox", path: "/clinicStaff/inbox", icon: Inbox },
    { label: "Profile", path: "/clinicStaff/profile", icon: UserCircle },
    { label: "Settings", path: "/clinicStaff/setting", icon: Settings },
    { label: "Logout", path: "/logout", icon: LogOut },
  ],
  user: [
    { label: "Home", path: "/user/home", icon: Home },
    { label: "Profile", path: "/user/profile", icon: User },
    { label: "Package", path: "/user/package", icon: Archive },
    { label: "Settings", path: "/user/settings", icon: Settings },
    { label: "Logout", path: "/logout", icon: LogOut },
  ],
};

const ActiveIndicator = ({ className }: { className: string }) => (
  <motion.div layoutId="active-indicator" className={className}>
    <ChevronRightIcon className="size-3 md:size-4" />
  </motion.div>
);

export default function AppSidebar({
  role,
  onClose,
  isSidebarOpen,
  toggleSidebar,
}: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [normalizedPathname, setNormalizedPathname] = useState("");
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  const onLogout = async () => {
    await handleLogout({ router });
  };

  useEffect(() => {
    const normalizedPath = pathname?.replace(/^\/(en|vi)/, "") || "";
    setNormalizedPathname(normalizedPath);
    setMounted(true);

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <Sidebar
        className="border-r dark:border-gray-800 dark:bg-gray-950 h-screen flex flex-col"
        variant="default"
      >
        <SidebarHeader className="border-b dark:border-gray-800 px-3 md:px-6 py-2 md:py-3 flex items-center justify-between">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex aspect-square size-7 md:size-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg">
                    <Layers className="size-4 md:size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-serif text-base md:text-lg tracking-wide dark:text-white">
                      Beautify
                    </span>
                    <span className="text-[10px] md:text-xs text-muted-foreground dark:text-gray-400">
                      Admin Portal
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Toggle sidebar button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </button>
        </SidebarHeader>

        <SidebarContent className="p-2 md:p-4 flex-grow overflow-y-auto">
          <SidebarMenu>
            {menuItems[role].map((item) => {
              const Icon = item.icon;
              const isActive =
                normalizedPathname === item.path.replace(/^\/(en|vi)/, "") ||
                normalizedPathname.startsWith(
                  item.path.replace(/^\/(en|vi)/, "") + "/"
                );

              if (item.path === "/logout") {
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={false}
                      onClick={() => setOpenLogoutDialog(true)}
                      className="group relative overflow-hidden rounded-lg transition-colors hover:bg-gradient-to-r hover:from-pink-500/5 hover:to-purple-500/5 dark:hover:from-pink-500/10 dark:hover:to-purple-500/10"
                    >
                      <div className="flex items-center gap-2 md:gap-3 py-1.5 md:py-2">
                        <LogOut className="size-4 md:size-5 text-muted-foreground group-hover:text-pink-500 dark:text-gray-400 dark:group-hover:text-pink-400" />
                        <span className="text-sm md:text-base font-medium tracking-wide text-foreground/70 group-hover:text-pink-500 dark:text-gray-300 dark:group-hover:text-pink-400">
                          {item.label}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "group relative overflow-hidden rounded-lg transition-colors",
                      isActive
                        ? "bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 dark:from-pink-500/20 dark:to-purple-500/20 dark:text-pink-400"
                        : "hover:bg-gradient-to-r hover:from-pink-500/5 hover:to-purple-500/5 dark:hover:from-pink-500/10 dark:hover:to-purple-500/10"
                    )}
                  >
                    <Link
                      href={item.path}
                      className="flex items-center gap-2 md:gap-3 py-1.5 md:py-2"
                    >
                      <Icon
                        className={cn(
                          "size-4 md:size-5",
                          isActive
                            ? "text-pink-600 dark:text-pink-400"
                            : "text-muted-foreground group-hover:text-pink-500 dark:text-gray-400 dark:group-hover:text-pink-400"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm md:text-base font-medium tracking-wide",
                          isActive
                            ? "text-pink-600 dark:text-pink-400"
                            : "text-foreground/70 group-hover:text-pink-500 dark:text-gray-300 dark:group-hover:text-pink-400"
                        )}
                      >
                        {item.label}
                      </span>
                      {isActive && mounted && (
                        <ActiveIndicator className="absolute right-1 md:right-2 flex size-4 md:size-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      {/* Confirm Logout Dialog */}
      <AlertDialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
        <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              This will end your session and log you out of the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onLogout}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
