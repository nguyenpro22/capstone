"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  variant?: "h1" | "h2" | "h3";
}

export function AnimatedText({
  text,
  className,
  variant = "h1",
}: AnimatedTextProps) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={cn(
        "flex flex-wrap",
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
        <motion.span key={index} className="mr-2 mb-2" variants={child}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
