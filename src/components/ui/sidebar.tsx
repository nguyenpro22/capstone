"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"

const sidebarVariants = cva("relative flex flex-col w-64 transition-all duration-300 ease-in-out", {
  variants: {
    variant: {
      default: "bg-background",
      transparent: "bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  children?: React.ReactNode
}

const SidebarContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}>({
  isOpen: true,
  setIsOpen: () => null,
})

const SidebarProvider = ({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return <SidebarContext.Provider value={{ isOpen, setIsOpen }}>{children}</SidebarContext.Provider>
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(({ className, variant, children, ...props }, ref) => {
  const { isOpen } = React.useContext(SidebarContext)

  return (
    <div ref={ref} className={cn(sidebarVariants({ variant }), isOpen ? "w-64" : "w-20", className)} {...props}>
      {children}
    </div>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between", className)} {...props} />
  ),
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex-1 overflow-auto", className)} {...props} />,
)
SidebarContent.displayName = "SidebarContent"

const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-1", className)} {...props} />,
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const menuButtonVariants = cva("flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors", {
  variants: {
    variant: {
      default: "hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-transparent hover:text-accent-foreground",
    },
    size: {
      default: "h-9",
      sm: "h-8",
      lg: "h-10",
    },
    isActive: {
      true: "bg-accent text-accent-foreground",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    isActive: false,
  },
})

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof menuButtonVariants> {
  asChild?: boolean
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, variant, size, isActive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"
    return <Comp ref={ref} className={cn(menuButtonVariants({ variant, size, isActive, className }))} {...props} />
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarTrigger = () => {
  const { isOpen, setIsOpen } = React.useContext(SidebarContext)
  return (
    <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-accent">
      <Menu className="h-4 w-4" />
    </button>
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
}

