"use client"

import type { ReactNode } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ModalProps {
  onClose: () => void
  children: ReactNode
  /**
   * Set to false to disable scrolling in the modal content
   * Useful when the child component has its own scrolling container
   */
  scrollable?: boolean
}

export default function Modal({ onClose, children, scrollable = true }: ModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-purple-100/20 to-transparent rounded-full translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-t from-pink-100/20 to-transparent rounded-full -translate-x-16 translate-y-16" />

          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg 
                     hover:bg-white transition-all duration-300 group z-10"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div
            className={`relative p-8 ${
              scrollable ? "max-h-[85vh] overflow-y-auto" : "overflow-visible"
            } custom-scrollbar`}
          >
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

