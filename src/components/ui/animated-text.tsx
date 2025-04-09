"use client";

import type React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  variant?: "h1" | "h2" | "h3";
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  variant = "h1",
  className,
}) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: -20,
      y: 10,
    },
  };

  return (
    <motion.div
      className={cn(
        "flex flex-wrap w-full justify-center",
        variant === "h1" && "text-4xl md:text-6xl lg:text-7xl font-bold",
        variant === "h2" && "text-3xl md:text-5xl font-bold",
        variant === "h3" && "text-2xl md:text-4xl font-bold",
        className
      )}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: "5px", display: "inline-block" }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};
