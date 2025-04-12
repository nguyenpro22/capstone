"use client"

import type React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bell, Search, Moon, Sun } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import { useTheme } from "next-themes"
import type { RootState } from "@/store"
import { useSelector } from "react-redux"
import { handleLogout } from "@/features/auth/utils"
import { useTranslations } from "next-intl"

const LangToggle = dynamic(() => import("@/components/common/LangToggle"), {
  ssr: false,
})

interface NavbarProps {
  children?: React.ReactNode
  sidebarClosed?: boolean
}

export default function Navbar({ children, sidebarClosed = false }: NavbarProps) {
  const router = useRouter()
  const t = useTranslations("navbarAdmin")

  const onLogout = async () => {
    await handleLogout({ router })
  }
  const { theme, setTheme } = useTheme()

  const token = getAccessToken()
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null
  const user = useSelector((state: RootState) => state.auth.user)
  const name = user?.name
  const role = user?.roleName

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
  ]

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border-b bg-white dark:bg-gray-950 dark:border-gray-800 backdrop-blur-sm transition-colors"
    >
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search Bar - with padding when sidebar is closed */}
        <div className={`relative ${sidebarClosed ? "pl-10" : ""} w-1/3`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="w-full bg-white dark:bg-gray-900 text-black dark:text-white pl-10 pr-4 py-2 rounded-full border-muted focus:border-pink-300 focus:ring focus:ring-pink-200 dark:focus:ring-pink-500 focus:ring-opacity-50 transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
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

          {/* Notifications */}
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
            <DropdownMenuContent align="end" className="w-80 dark:bg-gray-900 dark:border-gray-800">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none dark:text-white">{t("notifications")}</p>
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
                      <p className="text-sm font-medium leading-none dark:text-white">{notification.title}</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">{notification.message}</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">{notification.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Toggle */}
          <div className="border-l border-r px-6 dark:border-gray-800">
            <LangToggle />
          </div>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-fit space-x-3 hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <Avatar className="h-9 w-9 border-2 border-pink-200 dark:border-pink-600">
                  <AvatarImage src="https://placehold.co/40x40.png" alt={name} />
                  <AvatarFallback>{(name ?? "").substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground dark:text-white">{name}</span>
                  <span className="text-xs text-muted-foreground dark:text-gray-400">{role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 dark:bg-gray-900 dark:border-gray-800">
              <DropdownMenuLabel className="dark:text-white">{t("myAccount")}</DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:border-gray-800" />
              <DropdownMenuItem
                onClick={() => {
                  if (role === "Clinic Staff") {
                    router.push("/clinicStaff/profile")
                  } else if (role === "Clinic Admin") {
                    router.push("/clinicManager/profile")
                  } else {
                    router.push("/systemStaff/profile")
                  }
                }}
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
        </div>
      </div>
    </motion.header>
  )
}
