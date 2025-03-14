import type { ReactNode } from "react"
import { X } from "lucide-react"

interface ModalProps {
  onClose: () => void
  children: ReactNode
}

export default function Modal({ onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto bg-black/30 backdrop-blur-sm">
      <div
        className="relative w-full max-w-2xl animate-in fade-in zoom-in duration-300 rounded-2xl border border-white/20"
        style={{
          background: "linear-gradient(to right bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.98))",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.1), 0 0 100px rgba(0, 0, 0, 0.05)",
          backdropFilter: "blur(40px)",
        }}
    
      >
        <button
          className="absolute -top-2 -right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg 
                     hover:bg-white transition-all duration-300 group z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="relative p-8">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-transparent rounded-full -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-200/20 to-transparent rounded-full translate-x-16 translate-y-16" />

          {/* Content */}
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  )
}

