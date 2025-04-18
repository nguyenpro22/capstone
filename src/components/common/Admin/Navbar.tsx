"use client";

import { useState, useEffect } from "react";
import type React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Moon,
  Sun,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";
import { useTheme } from "next-themes";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { handleLogout } from "@/features/auth/utils";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LangToggle = dynamic(() => import("@/components/common/LangToggle"), {
  ssr: false,
});

interface NavbarProps {
  children?: React.ReactNode;
  sidebarClosed?: boolean;
}

export default function Navbar({
  children,
  sidebarClosed = false,
}: NavbarProps) {
  const router = useRouter();
  const t = useTranslations("navbarAdmin");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onLogout = async () => {
    await handleLogout({ router });
  };

  const { theme, setTheme } = useTheme();

  const token = getAccessToken();
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  const user = useSelector((state: RootState) => state.auth.user);
  const name = user?.name;
  const role = user?.roleName;

  const notifications = [
    {
      id: 1,
      title: t("newAppointment"),
      message: t("newAppointmentMessage"),
      time: t("timeAgo.minutesAgo", { count: 5 }),
    },
    {
      id: 2,
      title: t("treatmentComplete"),
      message: t("treatmentCompleteMessage"),
      time: t("timeAgo.hourAgo"),
    },
    {
      id: 3,
      title: t("reviewReceived"),
      message: t("reviewReceivedMessage"),
      time: t("timeAgo.hoursAgo", { count: 2 }),
    },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navigateToProfile = () => {
    if (role === "Clinic Staff") {
      router.push("/clinicStaff/profile");
    } else if (role === "Clinic Admin") {
      router.push("/clinicManager/profile");
    } else {
      router.push("/systemStaff/profile");
    }
  };

  // Mobile menu items
  const mobileMenuItems = [
    { label: t("profile"), icon: User, onClick: navigateToProfile },
    { label: t("settings"), icon: Settings, onClick: () => {} },
    { label: t("support"), icon: HelpCircle, onClick: () => {} },
    { label: t("logout"), icon: LogOut, onClick: onLogout, danger: true },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border-b bg-white dark:bg-gray-950 dark:border-gray-800 backdrop-blur-sm transition-colors"
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section - Search on desktop, menu on mobile */}
        {isMobile ? (
          <div className="flex items-center gap-2">
            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSearch(true)}
              className="md:hidden"
            >
              <Search className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">{t("search")}</span>
            </Button>
          </div>
        ) : (
          <div
            className={`relative ${
              sidebarClosed ? "pl-10" : ""
            } w-1/3 hidden md:block`}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchPlaceholder")}
                className="w-full bg-white dark:bg-gray-900 text-black dark:text-white pl-10 pr-4 py-2 rounded-full border-muted focus:border-pink-300 focus:ring focus:ring-pink-200 dark:focus:ring-pink-500 focus:ring-opacity-50 transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Center section - Logo or title on mobile */}
        {isMobile && (
          <div className="flex items-center justify-center">
            <h1 className="text-lg font-serif font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Beautify
            </h1>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-6">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
            <span className="sr-only">{t("toggleTheme")}</span>
          </Button>

          {/* Notifications - Dropdown on desktop, Dialog on mobile */}
          {isMobile ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-[10px] font-medium text-white">
                    3
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md dark:bg-gray-900">
                <DialogHeader>
                  <DialogTitle className="text-center dark:text-white">
                    {t("notifications")}
                    <span className="text-xs font-normal ml-2 text-muted-foreground dark:text-gray-400">
                      {t("unreadMessages", { count: 3 })}
                    </span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-2 shrink-0">
                        <Bell className="h-4 w-4 text-pink-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-[10px] font-medium text-white">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 dark:bg-gray-900 dark:border-gray-800"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none dark:text-white">
                      {t("notifications")}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                      {t("unreadMessages", { count: 3 })}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:border-gray-800" />
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 p-4 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                  >
                    <div className="flex w-full items-start gap-2">
                      <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-2">
                        <Bell className="h-4 w-4 text-pink-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Language Toggle - Hidden on smallest screens */}
          <div className="hidden sm:block border-l border-r px-4 md:px-6 dark:border-gray-800">
            <LangToggle />
          </div>

          {/* User Profile - Dropdown on desktop, Sheet on mobile */}
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-1">
                  <Avatar className="h-8 w-8 border-2 border-pink-200 dark:border-pink-600">
                    <AvatarImage
                      src="https://placehold.co/40x40.png"
                      alt={name}
                    />
                    <AvatarFallback>
                      {(name ?? "").substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85%] max-w-[300px] dark:bg-gray-900 dark:border-gray-800 p-0"
              >
                <SheetHeader className="p-6 border-b dark:border-gray-800">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-pink-200 dark:border-pink-600">
                      <AvatarImage
                        src="https://placehold.co/40x40.png"
                        alt={name}
                      />
                      <AvatarFallback>
                        {(name ?? "").substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <SheetTitle className="text-left dark:text-white">
                        {name}
                      </SheetTitle>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        {role}
                      </p>
                    </div>
                  </div>
                </SheetHeader>
                <div className="p-4 space-y-4">
                  {/* Language toggle on mobile */}
                  <div className="sm:hidden">
                    <p className="text-sm font-medium mb-2 dark:text-white">
                      {t("language")}
                    </p>
                    <LangToggle />
                  </div>

                  {/* Menu items */}
                  <div className="space-y-1">
                    {mobileMenuItems.map((item) => (
                      <Button
                        key={item.label}
                        variant="ghost"
                        onClick={item.onClick}
                        className={`w-full justify-start text-left ${
                          item.danger
                            ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            : "dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-12 w-fit space-x-3 hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <Avatar className="h-9 w-9 border-2 border-pink-200 dark:border-pink-600">
                    <AvatarImage
                      src="https://placehold.co/40x40.png"
                      alt={name}
                    />
                    <AvatarFallback>
                      {(name ?? "").substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start max-w-[120px]">
                    <span className="text-sm font-medium text-foreground dark:text-white truncate w-full">
                      {name}
                    </span>
                    <span className="text-xs text-muted-foreground dark:text-gray-400 truncate w-full">
                      {role}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 dark:bg-gray-900 dark:border-gray-800"
              >
                <DropdownMenuLabel className="dark:text-white">
                  {t("myAccount")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:border-gray-800" />
                <DropdownMenuItem
                  onClick={navigateToProfile}
                  className="dark:text-white dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                >
                  {t("profile")}
                </DropdownMenuItem>
                <DropdownMenuItem className="dark:text-white dark:hover:bg-gray-800 dark:focus:bg-gray-800">
                  {t("settings")}
                </DropdownMenuItem>
                <DropdownMenuItem className="dark:text-white dark:hover:bg-gray-800 dark:focus:bg-gray-800">
                  {t("support")}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:border-gray-800" />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-red-600 dark:text-red-400 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                >
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Search Dialog */}
      <Dialog open={showMobileSearch} onOpenChange={setShowMobileSearch}>
        <DialogContent className="top-4 translate-y-0 p-0 sm:max-w-md dark:bg-gray-900">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchPlaceholder")}
                className="w-full bg-white dark:bg-gray-900 text-black dark:text-white pl-10 pr-4 py-2 rounded-full border-muted focus:border-pink-300 focus:ring focus:ring-pink-200 dark:focus:ring-pink-500 focus:ring-opacity-50 transition-all duration-200"
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4 dark:text-gray-400">
              {t("recentSearches")}
            </p>
            <div className="mt-2 space-y-2">
              {/* Recent searches would go here */}
              <p className="text-sm dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer">
                {t("exampleSearch1")}
              </p>
              <p className="text-sm dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer">
                {t("exampleSearch2")}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.header>
  );
}
