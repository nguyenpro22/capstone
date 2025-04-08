"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"

interface MenuPortalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  triggerRect: DOMRect | null
}

export function MenuPortal({ isOpen, onClose, children, triggerRect }: MenuPortalProps) {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // Calculate and set position whenever triggerRect changes
  useEffect(() => {
    if (triggerRect) {
      const pos = calculatePosition(triggerRect)
      setPosition(pos)
    }
  }, [triggerRect])

  useEffect(() => {
    setMounted(true)

    // Add event listener to close menu when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const menuElement = document.getElementById("menu-portal-content")
      if (!isOpen || (menuElement && menuElement.contains(e.target as Node))) {
        return
      }
      onClose()
    }

    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Calculate position based on trigger element
  const calculatePosition = (rect: DOMRect) => {
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const menuHeight = 180
    const menuWidth = 200

    let top = rect.bottom
    let left = rect.right - menuWidth

    top += window.scrollY
    left += window.scrollX

    if (top + menuHeight > window.scrollY + viewportHeight) {
      top = rect.top + window.scrollY - menuHeight
    }

    if (left + menuWidth > window.scrollX + viewportWidth) {
      left = window.scrollX + viewportWidth - menuWidth - 10
    }

    if (left < window.scrollX) {
      left = rect.left + window.scrollX
    }

    left = Math.max(left, window.scrollX + 10)

    return { top, left }
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      onClick={(e) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
      }}
      style={{ position: "fixed", zIndex: 9999, top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          zIndex: 9999,
          pointerEvents: "auto",
        }}
      >
        <div
          id="menu-portal-content"
          className="w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg dark:shadow-gray-900 rounded-md text-sm py-1 max-h-[300px] overflow-y-auto text-gray-900 dark:text-gray-100"
        >
          {children}
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}