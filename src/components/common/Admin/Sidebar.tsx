"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
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
  Calendar,
  Clock,
  Menu,
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

// Import motion from framer-motion only on the client side
import { motion } from "framer-motion"

type SidebarProps = {
  role: "systemAdmin" | "user" | "systemStaff" | "clinicManager" | "clinicStaff"
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
  clinicStaff: [
    {
      label: "Dashboard",
      path: "/clinicStaff/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Customer Schedules",
      path: "/clinicStaff/customer-schedule",
      icon: Calendar,
    },
    {
      label: "Appointments",
      path: "/clinicStaff/appointment",
      icon: Clock,
    },
    {
      label: "Branch Doctors",
      path: "/clinicStaff/doctor",
      icon: Stethoscope,
    },
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
}

// Create a client-only active indicator component
const ActiveIndicator = ({ className }: { className: string }) => {
  return (
    <motion.div layoutId="active-indicator" className={className}>
      <ChevronRight className="size-3 md:size-4" />
    </motion.div>
  )
}

export default function AppSidebar({ role, onClose }: SidebarProps) {
  const pathname = usePathname()
  // Sử dụng useState với lazy initialization để tránh hydration mismatch
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [normalizedPathname, setNormalizedPathname] = useState("")

  // Chỉ xử lý client-side logic sau khi component đã mount
  useEffect(() => {
    // Normalize pathname
    const normalizedPath = pathname?.replace(/^\/(en|vi)/, "") || ""
    setNormalizedPathname(normalizedPath)

    // Set mounted state
    setMounted(true)

    // Check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [pathname])

  // Không render gì cho đến khi component đã mount ở client
  if (!mounted) {
    return null
  }

  return (
    
    <SidebarProvider defaultOpen={!isMobile}>
      <Sidebar className="border-r" variant="default">
        <SidebarHeader className="border-b px-3 md:px-6 py-2 md:py-3 flex items-center justify-between">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex aspect-square size-7 md:size-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg">
                    <Layers className="size-4 md:size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-serif text-base md:text-lg tracking-wide">Beautify</span>
                    <span className="text-[10px] md:text-xs text-muted-foreground">Admin Portal</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {isMobile && (
            <button
              onClick={() => {
                const triggerElement = document.querySelector('[data-sidebar="trigger"]') as HTMLButtonElement | null
                if (triggerElement) triggerElement.click()
              }}
              className="md:hidden p-1.5 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </SidebarHeader>

        <SidebarContent className="p-2 md:p-4">
          <SidebarMenu>
            {menuItems[role].map((item) => {
              const Icon = item.icon
              const isActive =
                normalizedPathname === item.path.replace(/^\/(en|vi)/, "") ||
                normalizedPathname.startsWith(item.path.replace(/^\/(en|vi)/, "") + "/")

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
                    <Link href={item.path} className="flex items-center gap-2 md:gap-3 py-1.5 md:py-2">
                      <Icon
                        className={cn(
                          "size-4 md:size-5 transition-colors",
                          isActive ? "text-pink-600" : "text-muted-foreground group-hover:text-pink-500",
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm md:text-base font-medium tracking-wide transition-colors",
                          isActive ? "text-pink-600" : "text-foreground/70 group-hover:text-pink-500",
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
              )
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

