"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "lg";
  children: React.ReactNode;
}

export const GradientButton = React.forwardRef<
  HTMLButtonElement,
  GradientButtonProps
>(
  (
    { className, variant = "default", size = "default", children, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden rounded-full transition-all duration-300",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/80 before:via-secondary/80 before:to-accent/80 before:transition-all before:duration-500",
          "hover:before:scale-110 hover:before:animate-gradient",
          variant === "outline" && "border-2 border-primary/20",
          size === "default" ? "h-10 px-6 text-sm" : "h-14 px-8 text-base",
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="relative flex items-center text-white font-medium">
          {children}
        </span>
      </button>
    );
  }
);
GradientButton.displayName = "GradientButton";
