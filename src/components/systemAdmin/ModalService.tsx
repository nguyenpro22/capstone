"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface ModalProps {
  children: React.ReactNode
  onClose: () => void
  title?: string
  customContent?: boolean
}

export default function ModalService({ children, onClose, title, customContent = false }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative"
      >
        {/* Nếu là customContent, chỉ render children mà không thêm padding hay overflow */}
        {customContent ? (
          <>
           
            {children}
          </>
        ) : (
          <>
            {title && (
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
          </>
        )}
      </motion.div>
    </div>
  )
}

