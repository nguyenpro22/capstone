"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

export function ProgressBar({
  currentQuestion,
  totalQuestions,
}: ProgressBarProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full bg-muted rounded-full h-3 mb-6 overflow-hidden">
      <motion.div
        className="bg-gradient h-full rounded-full animate-gradient relative"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        role="progressbar"
        aria-valuenow={currentQuestion}
        aria-valuemin={0}
        aria-valuemax={totalQuestions}
      >
        {/* Animated shine effect */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shine" />
      </motion.div>
    </div>
  );
}
