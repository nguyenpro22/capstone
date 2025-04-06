"use client";

import { useLocale, useTranslations } from "next-intl";
import { redirect, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  BarChart4,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LangToggle from "../common/LangToggle";
import ThemeToggle from "../common/ThemeToggle";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { clearToken, showSuccess } from "@/utils";

export function Sidebar() {
  const t = useTranslations("doctor.sidebar");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const navItems = [
    {
      label: t("dashboard"),
      href: `/${locale}/doctor/dashboard`,
      icon: BarChart4,
    },
    {
      label: t("calendar"),
      href: `/${locale}/doctor/calendar`,
      icon: Calendar,
      badge: "12",
    },
    {
      label: t("appointment"),
      href: `/${locale}/doctor/patients`,
      icon: User,
    },
    {
      label: t("settings"),
      href: `/${locale}/doctor/settings`,
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    clearToken();

    showSuccess(t("logoutSuccess"));
    router.push("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header with logo */}

      {/* Profile section */}
      <div className="px-4 py-5">
        <div className="p-3 rounded-xl bg-gradient-to-r from-muted/80 to-muted/30 dark:from-muted/20 dark:to-muted/5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-background shadow-md">
              <AvatarImage src="https://placehold.co/48x48.png" />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                DR
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">
                Dr. Sarah Smith
              </h3>
              <p className="text-xs text-muted-foreground">Cardiologist</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full h-8 w-8 bg-background/80 hover:bg-background"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="mb-2 px-4">
          <h2 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
            {t("mainMenu")}
          </h2>
        </div>
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md dark:shadow-primary/10"
                    : "text-foreground hover:bg-muted/50 dark:hover:bg-muted/20 hover:shadow-sm"
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-white/20 text-primary-foreground"
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
                {item.badge && (
                  <Badge
                    variant={isActive ? "outline" : "default"}
                    className={cn(
                      "ml-auto",
                      isActive
                        ? "bg-white/20 text-primary-foreground hover:bg-white/30"
                        : ""
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
                {isActive && (
                  <ChevronRight className="h-4 w-4 ml-auto opacity-70" />
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
        <div className="px-3 py-2 rounded-xl bg-muted/30 dark:bg-muted/10 mx-1">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">{t("appearance")}</div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{t("language")}</div>
            <LangToggle />
          </div>
        </div>
      </nav>

      {/* Footer with user actions */}
      <div className="p-4 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start px-4 py-3 h-auto rounded-xl border-muted-foreground/20 hover:border-muted-foreground/30 hover:bg-muted/50 dark:hover:bg-muted/20"
            >
              <LogOut className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{t("signout")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>{t("viewProfile")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t("accountSettings")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span onClick={handleLogout}>{t("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm shadow-md rounded-lg"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[300px]">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:block fixed top-0 left-0 w-[300px] border-r border-border/10 dark:border-border/20 h-screen bg-background/95 dark:bg-background/90 backdrop-blur-sm shadow-xl z-30">
        <SidebarContent />
      </div>
    </>
  );
}
