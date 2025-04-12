"use client"
import { motion } from "framer-motion"
import { AlertCircle, X, ArrowRight } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl" // Thêm import này

interface UpgradePackagePopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function UpgradePackagePopup({ isOpen, onClose }: UpgradePackagePopupProps) {
  const router = useRouter()
  const t = useTranslations("branch") // Thêm hook useTranslations

  if (!isOpen) return null

  const handleUpgrade = () => {
    router.push("/clinicManager/buy-package")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 dark:bg-gray-900/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
          <h2 className="text-xl font-bold">{t("upgradePopupTitle")}</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {t("upgradePopupMessage")}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t("upgradePopupQuestion")}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
            >
              {t("upgradePopupNotNow")}
            </button>
            <button
              type="button"
              onClick={handleUpgrade}
              className="px-4 py-2 text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-200 flex items-center gap-2"
            >
              <span>{t("upgradePopupUpgradePackage")}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}