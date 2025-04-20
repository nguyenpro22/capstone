"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SuccessAnimationProps {
  onClose: () => void;
}

export function SuccessAnimation({ onClose }: SuccessAnimationProps) {
  const t = useTranslations("registerSchedule");
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push(`/doctor/calendar`);
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center border border-slate-200 dark:border-slate-800"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            damping: 10,
            stiffness: 100,
          }}
          className="mx-auto bg-green-100 dark:bg-green-900/30 p-6 rounded-full mb-6 w-24 h-24 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-slate-900 dark:text-white mb-2"
        >
          {t("registrationSuccessful")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 dark:text-slate-300 mb-6"
        >
          {t("registrationSuccessDescription")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          <Button
            onClick={() => router.push(`/doctor/calendar`)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {t("viewCalendar")}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-200 dark:border-slate-700"
          >
            {t("registerMore")}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-sm text-slate-500 dark:text-slate-400"
        >
          {t("autoRedirect")}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
