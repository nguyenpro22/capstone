"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "default" | "lg"
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

export function Toggle({
  className,
  size = "default",
  pressed,
  onPressedChange,
  children,
  ...props
}: ToggleProps) {
  const [isPressed, setIsPressed] = React.useState(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newPressed = !isPressed
    setIsPressed(newPressed)
    onPressedChange?.(newPressed)
    props.onClick?.(event)
  }

  return (
    <button
      type="button"
      aria-pressed={pressed ?? isPressed}
      data-state={pressed ?? isPressed ? "on" : "off"}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-accent text-accent-foreground": pressed ?? isPressed,
          "p-1": size === "sm",
          "p-2": size === "default",
          "p-3": size === "lg",
        },
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}
