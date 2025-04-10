"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

interface SidebarContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

function useSidebarContext() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("Sidebar components must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  defaultOpen?: boolean
  children: React.ReactNode
}

const SidebarProvider = ({ defaultOpen = true, children }: SidebarProviderProps) => {
  const [open, setOpen] = useState(defaultOpen)

  return <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>
}

const sidebarVariants = cva("relative flex flex-col", {
  variants: {
    variant: {
      default: "bg-background",
      ghost: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(({ className, variant, children, ...props }, ref) => {
  const { open } = useSidebarContext()

  return (
    <div
      ref={ref}
      className={cn(sidebarVariants({ variant }), className, open ? "w-64" : "w-0 overflow-hidden")}
      {...props}
    >
      {children}
    </div>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex h-14 items-center px-4", className)} {...props}>
        {children}
      </div>
    )
  },
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex-1 overflow-auto py-2", className)} {...props}>
        {children}
      </div>
    )
  },
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center border-t p-4", className)} {...props}>
        {children}
      </div>
    )
  },
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("pb-4", className)} {...props}>
        {children}
      </div>
    )
  },
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("px-2 py-1 text-xs font-medium text-muted-foreground", className)} {...props}>
        {children}
      </div>
    )
  },
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("", className)} {...props}>
        {children}
      </div>
    )
  },
)
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-1 px-2", className)} {...props}>
        {children}
      </div>
    )
  },
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    // Fix: Remove the className from the Fragment and add a div wrapper
    return (
      <div ref={ref} className={cn("", className)} {...props}>
        {children}
      </div>
    )
  },
)
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  size?: "default" | "sm" | "lg"
  asChild?: boolean
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, size = "default", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"

    // Fix: When using Fragment, don't pass className
    if (asChild) {
      return <Comp>{children}</Comp>
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          size === "default" && "h-9 py-2",
          size === "sm" && "h-8 py-1.5",
          size === "lg" && "h-10 py-2.5",
          isActive
            ? "bg-accent text-accent-foreground hover:bg-accent/80"
            : "hover:bg-accent hover:text-accent-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarRail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("absolute right-0 top-0 h-full w-px bg-border", className)} {...props} />
  },
)
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-1 flex-col", className)} {...props}>
        {children}
      </div>
    )
  },
)
SidebarInset.displayName = "SidebarInset"

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { setOpen } = useSidebarContext()

    return (
      <button
        ref={ref}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <line x1="3" x2="21" y1="6" y2="6" />
          <line x1="3" x2="21" y1="12" y2="12" />
          <line x1="3" x2="21" y1="18" y2="18" />
        </svg>
        <span className="sr-only">Toggle sidebar</span>
      </button>
    )
  },
)
SidebarTrigger.displayName = "SidebarTrigger"

export {
  Sidebar,
  SidebarContent,
  SidebarContext,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebarContext,
}
