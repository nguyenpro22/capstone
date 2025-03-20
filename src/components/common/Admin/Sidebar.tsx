"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
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
  ChevronRight,
  ShoppingBag,
  Users,
  Stethoscope,
  UserCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"

type SidebarProps = {
  role: "systemAdmin" | "user" | "systemStaff" | "clinicManager"
  onClose?: () => void
}

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
    {
      label: "Staff Management",
      path: "/clinicManager/staff",
      icon: Users,
    },
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
  user: [
    { label: "Home", path: "/user/home", icon: Home },
    { label: "Profile", path: "/user/profile", icon: User },
    { label: "Package", path: "/user/package", icon: Archive },
    { label: "Settings", path: "/user/settings", icon: Settings },
    { label: "Logout", path: "/logout", icon: LogOut },
  ],
}

export default function AppSidebar({ role, onClose }: SidebarProps) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const normalizePath = (path: string) => {
    return path.replace(/^\/(en|vi)/, "")
  }

  const normalizedPathname = normalizePath(pathname)

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="border-r">
        <SidebarHeader className="border-b px-6 py-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg">
                    <Layers className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-serif text-lg tracking-wide">Beautify</span>
                    <span className="text-xs text-muted-foreground">Admin Portal</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="p-4">
          <SidebarMenu>
            {menuItems[role].map((item) => {
              const Icon = item.icon
              const isActive =
                normalizedPathname === normalizePath(item.path) ||
                normalizedPathname.startsWith(normalizePath(item.path) + "/")

              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "group relative overflow-hidden rounded-lg transition-colors",
                      isActive && "bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600",
                      !isActive && "hover:bg-gradient-to-r hover:from-pink-500/5 hover:to-purple-500/5",
                    )}
                  >
                    <Link href={item.path} className="flex items-center gap-3 py-2">
                      <Icon
                        className={cn(
                          "size-5 transition-colors",
                          isActive ? "text-pink-600" : "text-muted-foreground group-hover:text-pink-500",
                        )}
                      />
                      <span
                        className={cn(
                          "font-medium tracking-wide transition-colors",
                          isActive ? "text-pink-600" : "text-foreground/70 group-hover:text-pink-500",
                        )}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute right-2 flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        >
                          <ChevronRight className="size-4" />
                        </motion.div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

