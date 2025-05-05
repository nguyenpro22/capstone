"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import { Stethoscope, Building2, X, Eye, Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetDoctorsQuery,
  useLazyGetDoctorByIdQuery,
  useDeleteDoctorMutation,
} from "@/features/clinic/api";
import { useTranslations } from "next-intl";
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch";
import { useDebounce } from "@/hooks/use-debounce";

import Pagination from "@/components/common/Pagination/Pagination";
import DoctorForm from "@/components/clinicManager/doctor/DoctorForm";
import EditDoctorForm from "@/components/clinicManager/doctor/EditDoctorForm";
import ViewDoctorModal from "@/components/clinicManager/doctor/view-doctor-modal";
import ChangeDoctorBranchForm from "@/components/clinicManager/doctor/ChangeDoctorBranchForm";
import DoctorCertificateForm from "@/components/clinicManager/doctor/DoctorCertificateForm";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MoreVertical } from "lucide-react";
import { MenuPortal } from "@/components/ui/menu-portal";
import Image from "next/image";

// Add the import for getAccessToken and GetDataByToken
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";
import type { Doctor } from "@/features/clinic/types";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import type { Certificate as CertificateType } from "@/features/doctor/types";

interface BranchViewModalProps {
  branches: Array<{ id: string; name: string; fullAddress?: string }>;
  onClose: () => void;
}

interface CertificateViewModalProps {
  certificates: CertificateType[];
  doctorName: string;
  onClose: () => void;
}

const BranchViewModal = ({ branches, onClose }: BranchViewModalProps) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
          All Branches
        </h3>

        <div className="max-h-60 overflow-y-auto">
          {branches.map((branch, index) => (
            <div
              key={branch.id}
              className="p-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            >
              <div className="flex flex-col">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 text-purple-500 dark:text-purple-400 mr-2" />
                  <span className="font-medium dark:text-gray-200">
                    {branch.name}
                  </span>
                </div>
                {branch.fullAddress && (
                  <div className="mt-1 ml-6 text-xs text-gray-500 dark:text-gray-400">
                    {branch.fullAddress}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CertificateViewModal = ({
  certificates,
  doctorName,
  onClose,
}: CertificateViewModalProps) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
          {doctorName}&apos;s Certificates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 max-h-[70vh] overflow-y-auto p-2">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-gray-800">
                {cert.certificateUrl ? (
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <Image
                      src={cert.certificateUrl || "/placeholder.svg"}
                      alt={cert.certificateName}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // If image fails to load, replace with a placeholder
                        (e.target as HTMLImageElement).src =
                          "/formal-certificate.png";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all">
                      <Eye className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </a>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    No image available
                  </div>
                )}
              </div>
              <div className="p-3">
                <h4
                  className="font-medium text-sm mb-1 truncate"
                  title={cert.certificateName}
                >
                  {cert.certificateName}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                </p>
                {cert.note && (
                  <p
                    className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate"
                    title={cert.note}
                  >
                    Note: {cert.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function DoctorPage() {
  const t = useTranslations("staffDoctor"); // Using namespace "doctor"

  // Get the token and extract clinicId
  const token = getAccessToken();
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  const clinicId = tokenData?.clinicId || "";

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
  const [viewDoctor, setViewDoctor] = useState<Doctor | null>(null);
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [changeBranchDoctor, setChangeBranchDoctor] = useState<Doctor | null>(
    null
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [viewingBranches, setViewingBranches] = useState<Array<{
    id: string;
    name: string;
    fullAddress?: string;
  }> | null>(null);

  // State for viewing certificates
  const [viewingCertificates, setViewingCertificates] = useState<{
    certificates: CertificateType[];
    doctorName: string;
  } | null>(null);

  // State to track which branch is being hovered
  const [hoveredBranchId, setHoveredBranchId] = useState<string | null>(null);
  // Ref to store tooltip position
  const tooltipPositionRef = useRef<{
    x: number;
    y: number;
    targetElement?: HTMLElement;
  } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showChangeBranchForm, setShowChangeBranchForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;

  const { data, refetch } = useGetDoctorsQuery({
    clinicId,
    pageIndex,
    pageSize,
    searchTerm: debouncedSearchTerm,
    role: 1, // Use role=1 for doctors
  });

  // Reset page index when search term changes
  useEffect(() => {
    setPageIndex(1);
  }, [debouncedSearchTerm]);

  // Use the delayed refetch hook
  const delayedRefetch = useDelayedRefetch(refetch);

  const [fetchDoctorById] = useLazyGetDoctorByIdQuery();
  const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorMutation();

  // Update to match the actual response structure with nested items
  const doctorList: Doctor[] = data?.value?.items || [];

  // Get pagination info from the response
  const totalCount = data?.value?.totalCount || 0;
  const hasNextPage = !!data?.value?.hasNextPage;
  const hasPreviousPage = !!data?.value?.hasPreviousPage;

  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const [showCertificateForm, setShowCertificateForm] = useState(false);

  const handleCloseMenu = () => {
    setMenuOpen(null);
  };

  const handleViewAllBranches = (
    branches: Array<{ id: string; name: string; fullAddress?: string }> = []
  ) => {
    setViewingBranches(branches);
  };

  const handleViewAllCertificates = (doctor: Doctor) => {
    if (doctor.doctorCertificates && doctor.doctorCertificates.length > 0) {
      setViewingCertificates({
        certificates: doctor.doctorCertificates,
        doctorName: doctor.fullName,
      });
    }
  };

  // Handle mouse enter on branch with position capture
  const handleBranchMouseEnter = (branchId: string, e: React.MouseEvent) => {
    // Store the target element for tooltip positioning
    tooltipPositionRef.current = {
      x: e.clientX,
      y: e.clientY,
      targetElement: e.currentTarget as HTMLElement,
    };
    setHoveredBranchId(branchId);
  };

  const handleMenuAction = async (action: string, doctorId: string) => {
    if (action === "view") {
      try {
        const result = await fetchDoctorById({
          clinicId,
          employeeId: doctorId,
        }).unwrap();
        setViewDoctor(result.value);
      } catch (error) {
        console.error(error);
        toast.error("Không thể lấy thông tin bác sĩ!");
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
        });
      }
    }

    if (action === "edit") {
      try {
        const result = await fetchDoctorById({
          clinicId,
          employeeId: doctorId,
        }).unwrap();
        setEditDoctor(result.value);
      } catch (error) {
        console.error(error);
        toast.error("Không thể lấy thông tin bác sĩ!");
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
        });
      }
      setShowEditForm(true);
    }

    if (action === "changeBranch") {
      try {
        const result = await fetchDoctorById({
          clinicId,
          employeeId: doctorId,
        }).unwrap();
        setChangeBranchDoctor(result.value);
      } catch (error) {
        console.error(error);
        toast.error("Không thể lấy thông tin bác sĩ!");
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
        });
      }
      setShowChangeBranchForm(true);
    }
    if (action === "delete") {
      setDoctorToDelete(doctorId);
      setConfirmDialogOpen(true);
    }

    setMenuOpen(null);
  };

  // Update the handleDeleteDoctor function to use the correct API structure
  const handleDeleteDoctor = async (doctorId: string, branchId?: string) => {
    try {
      // Find the doctor to get their branch ID if not provided
      const doctorToDelete = doctorList.find(
        (doc) => doc.employeeId === doctorId
      );
      const branchIdToUse =
        branchId ||
        (doctorToDelete?.branchs && doctorToDelete.branchs.length > 0
          ? doctorToDelete.branchs[0].id
          : null);

      // Check if we have a valid branch ID
      if (!branchIdToUse) {
        toast.error(
          "Branch ID not found. Please try again or contact support."
        );
        return;
      }

      await deleteDoctor({
        id: branchIdToUse,
        accountId: doctorId,
      }).unwrap();

      toast.success("Bác sĩ đã được xóa thành công!");
      delayedRefetch();
    } catch (error: any) {
      console.error(error);
      toast.error(error.data.detail);
    }
  };

  // Maximum number of certificates to show before "View More" button
  const MAX_CERTIFICATES_TO_SHOW = 2;

  return (
    <div className="p-6 dark:bg-gray-950" onClick={handleCloseMenu}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
          {t("doctorList") || "Doctor List"}
        </h1>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={`${t("searchByName") || "Search by name"}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500 focus:ring-opacity-50 transition-all dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="font-medium tracking-wide">
              {t("addNewDoctor") || "Add New Doctor"}
            </span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 shadow-md dark:shadow-gray-900/20 rounded-lg relative">
        {doctorList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-left">
                  <th className="p-3 border border-gray-200 dark:border-gray-700 rounded-tl-lg dark:text-gray-200 w-[5%]">
                    {t("no") || "No."}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-200 w-[20%]">
                    {t("fullName") || "Full Name"}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-200 w-[25%]">
                    {t("email") || "Email"}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-200 w-[15%]">
                    {t("phoneNumber") || "Phone Number"}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-200 w-[15%]">
                    {t("doctorCertificates") || "Certificates"}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-200 w-[15%]">
                    {t("branches") || "Branches"}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 rounded-tr-lg dark:text-gray-200 w-[5%]">
                    {t("action") || "Action"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {doctorList.map((doctor: Doctor, index: number) => (
                  <tr
                    key={doctor.employeeId}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                  >
                    <td className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-300">
                      {(pageIndex - 1) * pageSize + index + 1}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium dark:text-gray-200">
                      {doctor.fullName}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 font-medium">
                        {doctor.email}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-300">
                      {doctor.phoneNumber || "-"}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        {doctor.doctorCertificates &&
                        doctor.doctorCertificates.length > 0 ? (
                          <div className="flex items-center">
                            <div className="flex -space-x-1 mr-2">
                              {doctor.doctorCertificates
                                .slice(0, MAX_CERTIFICATES_TO_SHOW)
                                .map((cert: CertificateType) => (
                                  <div
                                    key={cert.id}
                                    className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm hover:z-10 transition-all"
                                    title={cert.certificateName}
                                  >
                                    <a
                                      href={cert.certificateUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block w-full h-full"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewAllCertificates(doctor);
                                        return false;
                                      }}
                                    >
                                      <Image
                                        src={
                                          cert.certificateUrl ||
                                          "/placeholder.svg"
                                        }
                                        alt={cert.certificateName}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                          // If image fails to load, replace with a placeholder
                                          (e.target as HTMLImageElement).src =
                                            "/formal-certificate.png";
                                        }}
                                      />
                                    </a>
                                  </div>
                                ))}
                            </div>
                            {doctor.doctorCertificates.length > 0 && (
                              <button
                                onClick={() =>
                                  handleViewAllCertificates(doctor)
                                }
                                className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 whitespace-nowrap"
                              >
                                {doctor.doctorCertificates.length}{" "}
                                {doctor.doctorCertificates.length === 1
                                  ? "cert"
                                  : "certs"}
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            No certificates
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDoctorId(doctor.employeeId);
                            setShowCertificateForm(true);
                          }}
                          className="ml-auto w-6 h-6 flex items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
                          title="Add Certificate"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      {doctor.branchs && doctor.branchs.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {doctor.branchs.slice(0, 2).map((branch, idx) => (
                            <div key={idx} className="relative">
                              <span
                                className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors max-w-[100px] inline-block truncate align-bottom"
                                onMouseEnter={(e) =>
                                  handleBranchMouseEnter(branch.id, e)
                                }
                                onMouseLeave={() => setHoveredBranchId(null)}
                              >
                                {branch.name}
                              </span>
                            </div>
                          ))}
                          {doctor.branchs.length > 2 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{doctor.branchs.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                          No branches
                        </span>
                      )}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 relative text-center">
                      <button
                        className="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          // Get the button's position for the menu
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTriggerRect(rect);
                          // Toggle the menu
                          setMenuOpen(
                            menuOpen === doctor.employeeId
                              ? null
                              : doctor.employeeId
                          );
                        }}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-purple-300 dark:text-purple-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {t("noDoctorsAvailable") || "No Doctors available."}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 border border-purple-200 dark:border-purple-700 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
            >
              {t("addYourFirstDoctor") || "Add your first doctor"}
            </button>
          </div>
        )}
      </div>

      {/* Tooltip for branch addresses - positioned below each branch with arrow */}
      {hoveredBranchId &&
        doctorList.some((doctor) =>
          doctor.branchs?.some(
            (branch) => branch.id === hoveredBranchId && branch.fullAddress
          )
        ) && (
          <div
            className="fixed z-[9999] p-2 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded shadow-lg"
            style={{
              top:
                (tooltipPositionRef.current?.targetElement?.getBoundingClientRect()
                  .bottom || 0) +
                5 +
                "px",
              left:
                (tooltipPositionRef.current?.targetElement?.getBoundingClientRect()
                  .left || 0) + "px",
              maxWidth: "250px",
              pointerEvents: "none", // Prevents the tooltip from interfering with mouse events
            }}
          >
            {/* Arrow pointing up */}
            <div className="absolute -top-2 left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-gray-800 dark:border-b-gray-700" />

            {/* Only show the address */}
            {
              doctorList
                .flatMap((doctor) => doctor.branchs || [])
                .find((branch) => branch.id === hoveredBranchId)?.fullAddress
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
                  className="px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer flex items-center gap-2 transition-colors dark:text-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("view", doctor.employeeId);
                  }}
                >
                  <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400"></span>
                  </span>
                  {t("viewDoctorDetail") || "View Doctor Detail"}
                </li>
                <li
                  className="px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer flex items-center gap-2 transition-colors dark:text-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("edit", doctor.employeeId);
                  }}
                >
                  <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                  </span>
                  {t("editDoctor") || "Edit Doctor"}
                </li>
                <li
                  className="px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/30 cursor-pointer flex items-center gap-2 transition-colors dark:text-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("changeBranch", doctor.employeeId);
                  }}
                >
                  <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></span>
                  </span>
                  {t("changeBranch") || "Change Branch"}
                </li>
                <li
                  className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-300 cursor-pointer flex items-center gap-2 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("delete", doctor.employeeId);
                  }}
                >
                  <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400"></span>
                  </span>
                  {t("deleteDoctor") || "Delete Doctor"}
                </li>
              </ul>
            </MenuPortal>
          )
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
              setShowForm(false);
              delayedRefetch(); // Use delayed refetch instead of immediate refetch
              toast.success("Doctor added successfully!");
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
              setShowEditForm(false);
              setEditDoctor(null);
            }}
            onSaveSuccess={() => {
              setShowEditForm(false);
              setEditDoctor(null);
              delayedRefetch(); // Use delayed refetch instead of immediate refetch
            }}
            onSaveSuccessCertificate={(doctorId) => {
              // Fetch updated doctor details after certificate operations
              fetchDoctorById({
                clinicId,
                employeeId: doctorId,
              }).then((result) => {
                if (result.data) {
                  setEditDoctor(result.data.value);
                }
                delayedRefetch(); // Also refresh the list
              });
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
              setShowChangeBranchForm(false);
              setChangeBranchDoctor(null);
            }}
            onSaveSuccess={() => {
              setShowChangeBranchForm(false);
              setChangeBranchDoctor(null);
              delayedRefetch(); // Use delayed refetch instead of immediate refetch
            }}
          />
        </div>
      )}

      {/* View All Branches Modal */}
      {viewingBranches && (
        <BranchViewModal
          branches={viewingBranches}
          onClose={() => setViewingBranches(null)}
        />
      )}

      {/* View All Certificates Modal */}
      {viewingCertificates && (
        <CertificateViewModal
          certificates={viewingCertificates.certificates}
          doctorName={viewingCertificates.doctorName}
          onClose={() => setViewingCertificates(null)}
        />
      )}

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

      {viewDoctor && (
        <ViewDoctorModal
          viewDoctor={viewDoctor}
          onClose={() => setViewDoctor(null)}
        />
      )}

      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={() => {
          if (doctorToDelete) {
            handleDeleteDoctor(doctorToDelete);
            setConfirmDialogOpen(false);
          }
        }}
        title={t("confirmDelete")}
        message={
          t("deleteDoctorConfirmation") ||
          "Bạn có chắc chắn muốn xóa bác sĩ này? Hành động này không thể hoàn tác."
        }
        confirmButtonText={t("deleteDoctor")}
        cancelButtonText={t("cancel")}
        isLoading={isDeleting}
        type="delete"
      />

      {/* Certificate Form Modal */}
      {showCertificateForm && selectedDoctorId && (
        <DoctorCertificateForm
          doctorId={selectedDoctorId}
          onClose={() => {
            setShowCertificateForm(false);
            setSelectedDoctorId(null);
          }}
          onSaveSuccess={() => {
            setShowCertificateForm(false);
            setSelectedDoctorId(null);
            delayedRefetch();
            toast.success("Certificate added successfully!");
          }}
        />
      )}
    </div>
  );
}
