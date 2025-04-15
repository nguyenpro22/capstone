"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  LogOut,
  ChevronRight,
  Menu,
  Bell,
  User2Icon,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LangToggle from "../common/LangToggle";
import ThemeToggle from "../common/ThemeToggle";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { handleLogout } from "@/features/auth/utils";
import { useGetUserProfileQuery } from "@/features/home/api";
import { toast } from "react-toastify";

export function Sidebar() {
  const t = useTranslations("doctor.sidebar");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const router = useRouter();
  const { data, isLoading, refetch } = useGetUserProfileQuery();

  const navItems = [
    {
      label: t("calendar"),
      href: `/${locale}/doctor/calendar`,
      icon: Calendar,
    },
    {
      label: t("accountSettings"),
      href: `/${locale}/doctor/profile`,
      icon: User2Icon,
    },
  ];

  const onLogout = async () => {
    await handleLogout({ router });
  };

  const handleRefetch = async () => {
    try {
      setIsRefetching(true);
      await refetch();
      toast(t("profileRefreshed"));
    } catch (error) {
    } finally {
      setIsRefetching(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background/95 dark:bg-background/90 backdrop-blur-sm">
      {/* Profile section */}
      <div className="px-4 py-5 border-b border-border/30 dark:border-border/20">
        <div className="p-3 rounded-xl bg-purple-50/80 dark:bg-purple-900/10 shadow-sm">
          <div className="flex items-center gap-3">
            {isLoading ? (
              <Skeleton className="h-12 w-12 rounded-full" />
            ) : (
              <Avatar className="h-12 w-12 border border-border/30 dark:border-border/20 shadow-sm">
                <AvatarImage src={data?.value?.profilePicture || ""} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium">
                  DR
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <Skeleton className="h-5 w-32" />
              ) : (
                <h3 className="font-semibold text-base truncate text-foreground">
                  {data?.value?.fullName || t("doctor")}
                </h3>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full h-8 w-8 bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground"
                onClick={handleRefetch}
                disabled={isLoading || isRefetching}
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4",
                    (isLoading || isRefetching) && "animate-spin"
                  )}
                />
                <span className="sr-only">{t("refreshProfile")}</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full h-8 w-8 bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
                <span className="sr-only">{t("notifications")}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="mb-2 px-4">
          <h2 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
            {t("mainMenu")}
          </h2>
        </div>
        <div className="space-y-1.5">
          {isLoading
            ? // Loading skeleton for navigation items
              Array(2)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="px-4 py-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-lg" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  </div>
                ))
            : navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm"
                        : "text-foreground hover:bg-muted/50 dark:hover:bg-muted/20 hover:shadow-sm"
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-muted/50 dark:bg-muted/30 text-muted-foreground group-hover:text-foreground group-hover:bg-muted/80 dark:group-hover:bg-muted/40"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-[18px] w-[18px] transition-all duration-200",
                          !isActive && "group-hover:scale-110"
                        )}
                      />
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 ml-auto text-white/70" />
                    )}
                  </Link>
                );
              })}
        </div>

        <div className="mt-6 mb-2 px-4">
          <h2 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
            {t("Settings")}
          </h2>
        </div>
        <div className="px-3 py-3 rounded-xl bg-muted/30 dark:bg-muted/10 mx-1 border border-border/30 dark:border-border/20">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-foreground">
              {t("appearance")}
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-foreground">
              {t("language")}
            </div>
            <LangToggle />
          </div>
        </div>
      </nav>

      {/* Footer with user actions */}
      <div className="p-4 mt-auto border-t border-border/30 dark:border-border/20">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full justify-start px-4 py-3 h-auto rounded-xl border-border/30 dark:border-border/20 hover:bg-muted/50 dark:hover:bg-muted/20 text-foreground"
          disabled={isLoading}
        >
          <LogOut className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{t("signout")}</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm shadow-sm rounded-lg border border-border/30 dark:border-border/20"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="p-0 w-[300px] border-r border-border/30 dark:border-border/20"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:block fixed top-0 left-0 w-[300px] border-r border-border/30 dark:border-border/20 h-screen shadow-sm z-30">
        <SidebarContent />
      </div>
    </>
  );
}
