"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ClipboardList,
  Home,
  LogOut,
  Settings,
  User,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslations } from "next-intl";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations("doctorCommon.sidebar");

  const routes = [
    {
      label: t("dashboard"),
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: t("calendar"),
      icon: Calendar,
      href: "/doctor/calendar",
      active: pathname === "/doctor/calendar",
    },
    {
      label: t("appointments"),
      icon: ClipboardList,
      href: "/doctor/appointments",
      active: pathname.includes("/doctor/appointments"),
    },
    {
      label: t("patients"),
      icon: User,
      href: "/doctor/patients",
      active: pathname.includes("/doctor/patients"),
    },
    {
      label: t("profile"),
      icon: Settings,
      href: "/doctor/profile",
      active: pathname === "/doctor/profile",
    },
  ];

  const SidebarContent = (
    <>
      <div className="px-3 py-2">
        <div className="mb-4 px-4 py-3 rounded-lg bg-gradient-sidebar text-white">
          <h2 className="text-xl font-bold tracking-tight">{t("title")}</h2>
        </div>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
            >
              <Button
                variant={route.active ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  route.active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-primary/10 font-normal"
                )}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-clinic-error hover:text-clinic-error hover:bg-clinic-error/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("logout")}
        </Button>
      </div>
    </>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="ml-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <ScrollArea className="h-full py-6">{SidebarContent}</ScrollArea>
        </SheetContent>
      </Sheet>

      <aside
        className={cn(
          "hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10 bg-background",
          className
        )}
      >
        <div className="flex flex-col flex-grow border-r bg-background">
          <ScrollArea className="flex-1">{SidebarContent}</ScrollArea>
        </div>
      </aside>
    </>
  );
}
