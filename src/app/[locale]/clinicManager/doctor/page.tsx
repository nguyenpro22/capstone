"use client"
import { useState, useRef } from "react"
import type React from "react"
import { Stethoscope, Building2, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useGetDoctorsQuery, useLazyGetDoctorByIdQuery, useDeleteDoctorMutation } from "@/features/clinic/api"
import { useTranslations } from "next-intl"
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch"

import Pagination from "@/components/common/Pagination/Pagination"
import DoctorForm from "@/components/clinicManager/doctor/DoctorForm"
import EditDoctorForm from "@/components/clinicManager/doctor/EditDoctorForm"
import ViewDoctorModal from "@/components/clinicManager/doctor/view-doctor-modal"
import ChangeDoctorBranchForm from "@/components/clinicManager/doctor/ChangeDoctorBranchForm"

import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { MoreVertical } from "lucide-react"
import { MenuPortal } from "@/components/ui/menu-portal"

// Add the import for getAccessToken and GetDataByToken
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import type { Doctor } from "@/features/clinic/types"

interface BranchViewModalProps {
  branches: Array<{ id: string; name: string; fullAddress?: string }>
  onClose: () => void
}

const BranchViewModal = ({ branches, onClose }: BranchViewModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          All Branches
        </h3>

        <div className="max-h-60 overflow-y-auto">
          {branches.map((branch, index) => (
            <div key={branch.id} className="p-3 border-b border-gray-100 last:border-b-0">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 text-purple-500 mr-2" />
                  <span className="font-medium">{branch.name}</span>
                </div>
                {branch.fullAddress && <div className="mt-1 ml-6 text-xs text-gray-500">{branch.fullAddress}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function DoctorPage() {
  const t = useTranslations("doctor") // Using namespace "doctor"

  // Get the token and extract clinicId
  const token = getAccessToken()
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null
  const clinicId = tokenData?.clinicId || ""

  const [viewDoctor, setViewDoctor] = useState<Doctor | null>(null)
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null)
  const [changeBranchDoctor, setChangeBranchDoctor] = useState<Doctor | null>(null)
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
  const [viewingBranches, setViewingBranches] = useState<Array<{
    id: string
    name: string
    fullAddress?: string
  }> | null>(null)

  // State to track which branch is being hovered
  const [hoveredBranchId, setHoveredBranchId] = useState<string | null>(null)
  // Ref to store tooltip position
  const tooltipPositionRef = useRef<{ x: number; y: number; targetElement?: HTMLElement } | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showChangeBranchForm, setShowChangeBranchForm] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")

  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 5

  const { data, refetch } = useGetDoctorsQuery({
    clinicId,
    pageIndex,
    pageSize,
    searchTerm,
    role: 1, // Use role=1 for doctors
  })

  // Use the delayed refetch hook
  const delayedRefetch = useDelayedRefetch(refetch)

  const [fetchDoctorById] = useLazyGetDoctorByIdQuery()
  const [deleteDoctor] = useDeleteDoctorMutation()

  // Update to match the actual response structure with nested items
  const doctorList: Doctor[] = data?.value?.items || []

  // Get pagination info from the response
  const totalCount = data?.value?.totalCount || 0
  const hasNextPage = !!data?.value?.hasNextPage
  const hasPreviousPage = !!data?.value?.hasPreviousPage

  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)

  const handleCloseMenu = () => {
    setMenuOpen(null)
  }

  const handleViewAllBranches = (branches: Array<{ id: string; name: string; fullAddress?: string }> = []) => {
    setViewingBranches(branches)
  }

  // Handle mouse enter on branch with position capture
  const handleBranchMouseEnter = (branchId: string, e: React.MouseEvent) => {
    // Store the target element for tooltip positioning
    tooltipPositionRef.current = {
      x: e.clientX,
      y: e.clientY,
      targetElement: e.currentTarget as HTMLElement,
    }
    setHoveredBranchId(branchId)
  }

  const handleMenuAction = async (action: string, doctorId: string) => {
    if (action === "view") {
      try {
        const result = await fetchDoctorById({
          clinicId,
          employeeId: doctorId,
        }).unwrap()
        setViewDoctor(result.value)
      } catch (error) {
        console.error(error)
        toast.error("Không thể lấy thông tin bác sĩ!")
        setViewDoctor({
          id: "",
          clinicId: "",
          employeeId: "",
          email: "",
          firstName: "",
          lastName: "",
          fullName: "",
          city: null,
          district: null,
          ward: null,
          address: null,
          phoneNumber: null,
          fullAddress: "",
          profilePictureUrl: null,
          role: "",
          doctorCertificates: null,
          branchs: [],
        })
      }
    }

    if (action === "edit") {
      try {
        const result = await fetchDoctorById({
          clinicId,
          employeeId: doctorId,
        }).unwrap()
        setEditDoctor(result.value)
      } catch (error) {
        console.error(error)
        toast.error("Không thể lấy thông tin bác sĩ!")
        setEditDoctor({
          id: "",
          clinicId: "",
          employeeId: "",
          email: "",
          firstName: "",
          lastName: "",
          fullName: "",
          city: null,
          district: null,
          ward: null,
          address: null,
          phoneNumber: null,
          fullAddress: "",
          profilePictureUrl: null,
          role: "",
          doctorCertificates: null,
          branchs: [],
        })
      }
      setShowEditForm(true)
    }

    if (action === "changeBranch") {
      try {
        const result = await fetchDoctorById({
          clinicId,
          employeeId: doctorId,
        }).unwrap()
        setChangeBranchDoctor(result.value)
      } catch (error) {
        console.error(error)
        toast.error("Không thể lấy thông tin bác sĩ!")
        setChangeBranchDoctor({
          id: "",
          clinicId: "",
          employeeId: "",
          email: "",
          firstName: "",
          lastName: "",
          fullName: "",
          city: null,
          district: null,
          ward: null,
          address: null,
          phoneNumber: null,
          fullAddress: "",
          profilePictureUrl: null,
          role: "",
          doctorCertificates: null,
          branchs: [],
        })
      }
      setShowChangeBranchForm(true)
    }

    setMenuOpen(null)
  }

  // Update the handleDeleteDoctor function to use the correct API structure
  const handleDeleteDoctor = async (doctorId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bác sĩ này?")) {
      try {
        // Check if clinicId is available
        if (!clinicId) {
          toast.error("Clinic ID not found. Please try again or contact support.")
          return
        }

        await deleteDoctor({
          id: clinicId, // clinicId is now guaranteed to be a string
          accountId: doctorId, // Use doctorId as the accountId parameter
        }).unwrap()

        toast.success("Bác sĩ đã được xóa thành công!")
        delayedRefetch() // Use delayed refetch instead of immediate refetch
      } catch (error) {
        console.error(error)
        toast.error("Xóa bác sĩ thất bại!")
      }
    }
  }

  return (
    <div className="p-6" onClick={handleCloseMenu}>
      <ToastContainer />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          {t("doctorList") || "Doctor List"}
        </h1>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={`${t("searchByName") || "Search by name"}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium tracking-wide">{t("addNewDoctor") || "Add New Doctor"}</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg relative">
        {doctorList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50 text-left">
                  <th className="p-3 border border-gray-200 rounded-tl-lg">{t("no") || "No."}</th>
                  <th className="p-3 border border-gray-200">{t("fullName") || "Full Name"}</th>
                  <th className="p-3 border border-gray-200">{t("email") || "Email"}</th>
                  <th className="p-3 border border-gray-200">{t("phoneNumber") || "Phone Number"}</th>
                  <th className="p-3 border border-gray-200">{t("role") || "Role"}</th>
                  <th className="p-3 border border-gray-200">{t("branches") || "Branches"}</th>
                  <th className="p-3 border border-gray-200 rounded-tr-lg">{t("action") || "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {doctorList.map((doctor: Doctor, index: number) => (
                  <tr key={doctor.employeeId} className="border-t hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-3 border border-gray-200">{(pageIndex - 1) * pageSize + index + 1}</td>
                    <td className="p-3 border border-gray-200 font-medium">{doctor.fullName}</td>
                    <td className="p-3 border border-gray-200">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-medium">
                        {doctor.email}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200">{doctor.phoneNumber || "-"}</td>
                    <td className="p-3 border border-gray-200">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                        {doctor.role}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200">
                      {doctor.branchs && doctor.branchs.length > 0 ? (
                        <div>
                          <div className="flex flex-wrap gap-1 mb-1">
                            {doctor.branchs.slice(0, 2).map((branch, idx) => (
                              <div key={idx} className="relative">
                                <span
                                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full cursor-pointer hover:bg-blue-100 transition-colors max-w-[100px] inline-block truncate align-bottom"
                                  onMouseEnter={(e) => handleBranchMouseEnter(branch.id, e)}
                                  onMouseLeave={() => setHoveredBranchId(null)}
                                
                                >
                                  {branch.name}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No branches</span>
                      )}
                    </td>
                    <td className="p-3 border border-gray-200 relative">
                      <button
                        className="p-2 rounded-full hover:bg-purple-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.nativeEvent.stopImmediatePropagation()
                          // Get the button's position for the menu
                          const rect = e.currentTarget.getBoundingClientRect()
                          setTriggerRect(rect)
                          // Toggle the menu
                          setMenuOpen(menuOpen === doctor.employeeId ? null : doctor.employeeId)
                        }}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-purple-300" />
            </div>
            <p className="text-gray-500">{t("noDoctorsAvailable") || "No Doctors available."}</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-200 rounded-md hover:bg-purple-50 transition-colors"
            >
              {t("addYourFirstDoctor") || "Add your first doctor"}
            </button>
          </div>
        )}
      </div>

      {/* Tooltip for branch addresses - positioned below each branch with arrow */}
      {hoveredBranchId &&
        doctorList.some((doctor) =>
          doctor.branchs?.some((branch) => branch.id === hoveredBranchId && branch.fullAddress),
        ) && (
          <div
            className="fixed z-[9999] p-2 bg-gray-800 text-white text-xs rounded shadow-lg"
            style={{
              top: (tooltipPositionRef.current?.targetElement?.getBoundingClientRect().bottom || 0) + 5 + "px",
              left: (tooltipPositionRef.current?.targetElement?.getBoundingClientRect().left || 0) + "px",
              maxWidth: "250px",
              pointerEvents: "none", // Prevents the tooltip from interfering with mouse events
            }}
          >
            {/* Arrow pointing up */}
            <div className="absolute -top-2 left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-gray-800" />

            {/* Only show the address */}
            {
              doctorList.flatMap((doctor) => doctor.branchs || []).find((branch) => branch.id === hoveredBranchId)
                ?.fullAddress
            }
          </div>
        )}

      {/* Menu Portal */}
      {doctorList.map(
        (doctor: Doctor) =>
          menuOpen === doctor.employeeId && (
            <MenuPortal
              key={doctor.employeeId}
              isOpen={menuOpen === doctor.employeeId}
              onClose={() => setMenuOpen(null)}
              triggerRect={triggerRect}
            >
              <ul>
                <li
                  className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center gap-2 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMenuAction("view", doctor.employeeId)
                  }}
                >
                  <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  </span>
                  {t("viewDoctorDetail") || "View Doctor Detail"}
                </li>
                <li
                  className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center gap-2 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMenuAction("edit", doctor.employeeId)
                  }}
                >
                  <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  </span>
                  {t("editDoctor") || "Edit Doctor"}
                </li>
                <li
                  className="px-4 py-2 hover:bg-green-50 cursor-pointer flex items-center gap-2 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMenuAction("changeBranch", doctor.employeeId)
                  }}
                >
                  <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  </span>
                  {t("changeBranch") || "Change Branch"}
                </li>
                <li
                  className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-2 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteDoctor(doctor.employeeId)
                  }}
                >
                  <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  </span>
                  {t("deleteDoctor") || "Delete Doctor"}
                </li>
              </ul>
            </MenuPortal>
          ),
      )}

      {/* Add Doctor Form */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <DoctorForm
            onClose={() => setShowForm(false)}
            onSaveSuccess={() => {
              setShowForm(false)
              delayedRefetch() // Use delayed refetch instead of immediate refetch
              toast.success("Doctor added successfully!")
            }}
          />
        </div>
      )}

      {/* Edit Doctor Form */}
      {showEditForm && editDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EditDoctorForm
            initialData={editDoctor}
            onClose={() => {
              setShowEditForm(false)
              setEditDoctor(null)
            }}
            onSaveSuccess={() => {
              setShowEditForm(false)
              setEditDoctor(null)
              delayedRefetch() // Use delayed refetch instead of immediate refetch
            }}
          />
        </div>
      )}

      {/* Change Branch Form */}
      {showChangeBranchForm && changeBranchDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ChangeDoctorBranchForm
            doctor={changeBranchDoctor}
            onClose={() => {
              setShowChangeBranchForm(false)
              setChangeBranchDoctor(null)
            }}
            onSaveSuccess={() => {
              setShowChangeBranchForm(false)
              setChangeBranchDoctor(null)
              delayedRefetch() // Use delayed refetch instead of immediate refetch
            }}
          />
        </div>
      )}

      {/* View All Branches Modal */}
      {viewingBranches && <BranchViewModal branches={viewingBranches} onClose={() => setViewingBranches(null)} />}

      <div className="mt-6">
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalCount={totalCount}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onPageChange={setPageIndex}
        />
      </div>

      {viewDoctor && <ViewDoctorModal viewDoctor={viewDoctor} onClose={() => setViewDoctor(null)} />}
    </div>
  )
}

