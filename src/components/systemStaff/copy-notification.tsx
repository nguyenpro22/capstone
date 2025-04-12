"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface CopyNotificationProps {
  show: boolean
  onClose: () => void
}

export const CopyNotification = ({ show, onClose }: CopyNotificationProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
          <CheckCircle className="w-4 h-4" />
          <span>Copied to clipboard</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
