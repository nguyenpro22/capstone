"use client";
import { MdEditSquare } from "react-icons/md";
import { useState } from "react";
import { MapPin, Mail, Phone, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import {
  useGetServicesQuery,
  useLazyGetServiceByIdQuery,
  useDeleteServiceMutation,
} from "@/features/clinic-service/api";
import { useGetCategoriesQuery } from "@/features/category-service/api";
import ServiceForm from "@/components/clinicManager/ServiceForm";
import PromotionForm from "@/components/clinicManager/PromotionForm";

import EditServiceForm from "@/components/clinicManager/EditServiceForm";
import AddProcedure from "@/components/clinicManager/AddProcedure";
import { useTranslations } from 'next-intl';

import Pagination from "@/components/common/Pagination/Pagination";
import ImageModal from "@/components/clinicManager/ImageModal";
import { Procedure, ProcedurePriceType, Service } from '@/features/clinic-service/types';
import { Clinic } from '@/features/clinic/types';


import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MoreVertical } from "lucide-react"; // Import icon ba chấm và icon đóng
import Modal from "@/components/systemAdmin/Modal"; // Component popup để hiển thị thông tin gói
import Image from "next/image";

export default function ServicePage() {
    const t = useTranslations('service'); // Sử dụng namespace "dashboard"
  
  const [viewService, setViewService] = useState<any | null>(null); // Cho popup "Xem thông tin"
const [editService, setEditService] = useState<any | null>(null);
const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
const [modalType, setModalType] = useState<"promotion" | "procedure" | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;

  const { data, refetch } = useGetServicesQuery({
    pageIndex,
    pageSize,
    searchTerm,
  });
  const { data: categoriesData } = useGetCategoriesQuery({
    pageIndex: 1,
    pageSize: 100,
    searchTerm: "",
  });

  console.log("API Response:", data);
  const [fetchServiceById] = useLazyGetServiceByIdQuery();
  const [deleteService] = useDeleteServiceMutation();

  const services: Service[] = data?.value?.items || [];
  const categories = categoriesData?.value || [];
  console.log("Service Data:", services); // Debug
  console.log("Category Data:", categories); // Debug

  const totalCount = data?.value?.totalCount || 0;
  const hasNextPage = data?.value?.hasNextPage;
  const hasPreviousPage = data?.value?.hasPreviousPage;

  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  // const [selectedService, setSelectedService] = useState<any | null>(null);

  // const handleToggleMenu = (serviceId: string) => {
  //   setMenuOpen(menuOpen === serviceId ? null : serviceId);
  // };
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (images: string[]) => {
    setSelectedImages(images);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const openPromotionForm = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setModalType("promotion");
  };

  const handleCloseMenu = () => {
    setMenuOpen(null);
  };

  const handleMenuAction = async (action: string, pkgId: string) => {
    if (action === "view") {
      try {
        const result = await fetchServiceById(pkgId).unwrap();
        setViewService(result.value);
      } catch (error) {
        console.error(error);
        toast.error("Không thể lấy thông tin gói!");
        setViewService({
          name: "",
          description: "",
          price: "0",
          duration: "",
          isActivated: false,
        });
      }
    }

    if (action === "edit") {
      try {
        const result = await fetchServiceById(pkgId).unwrap();
        setEditService(result.value);
      } catch (error) {
        console.error(error);
        toast.error("Không thể lấy thông tin gói!");
        setEditService({
          name: "",
          description: "",
          price: "0",
          duration: "",
          isActivated: false,
        });
      }
      setShowEditForm(true);
    }
  
    if (action === "addProcedure") {
      setSelectedServiceId(pkgId); // Mở modal AddProcedure
      setModalType("procedure"); // 🆕 Chỉ mở form AddProcedure
    }

    setMenuOpen(null);
  };
  
  
  const handleDeleteService = async (ServiceId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gói này?")) {
      try {
        await deleteService({id: ServiceId}).unwrap();
        toast.success("Gói đã được xóa thành công!");
        refetch();
      } catch (error) {
        console.error(error);
        toast.error("Xóa gói thất bại!");
      }
    }
  };

  return (
    <div className="p-6" onClick={handleCloseMenu}>
      <ToastContainer />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{t('servicesList')}</h1>
        <input
          type="text"
          placeholder="Search By Service Name"
          className="border px-4 py-2 rounded-md w-1/3"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
        >
          <span className="font-medium tracking-wide">{t("addNewService")}</span>
        </motion.button>
      </div>

      <div className="bg-white p-4 shadow rounded-lg relative">
      {services.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">{t('no')}</th>
              <th className="p-3 border">{t('serviceName')}</th>
              <th className="p-3 border">{t('price')}</th>
              <th className="p-3 border">{t('coverImage')}</th>
              <th className="p-3 border">{t('category')}</th>
              <th className="p-3 border">{t('percentDiscount')}</th>
              <th className="p-3 border">{t('action')}</th>
            </tr>
          </thead>
          <tbody>
  {services.map((service: Service, index: number) => (
    <tr key={service.id} className="border-t">
      <td className="p-3 border">{(pageIndex - 1) * pageSize + index + 1}</td>
      <td className="p-3 border">{service.name}</td>
      <td className="p-3 border">
        {service.minPrice.toLocaleString()} - {service.maxPrice.toLocaleString()} VND
        </td>
      <td className="p-3 border">
        <div className="flex items-center space-x-2">
          {service.coverImage && service.coverImage.length > 0 && (
            <Image
              src={service.coverImage[0]}
              alt="Cover"
              className="w-12 h-12 object-cover rounded"
              width={100}
              height={100}
            />
          )}
          {service.coverImage && service.coverImage.length > 1 && (
            <button
              className="text-blue-500 underline text-sm"
              onClick={() => handleOpenModal(service.coverImage || [])}
            >
              View More
            </button>
          )}
        </div>
      </td>
      <td className="p-3 border">{service.category.name}</td>
      <td className="p-3 border flex items-center space-x-2">
                    <span>{service.discountPercent}</span>
                    <button onClick={() => openPromotionForm(service.id)} className="text-blue-500">
                      <MdEditSquare />
                    </button>
                  </td>            <td className="p-3 border relative">
        <button
          className="p-2 rounded-full hover:bg-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(menuOpen === service.id ? null : service.id);
          }}
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {menuOpen === service.id && (
          <ul className="absolute right-0 mt-2 w-48 bg-white border shadow-md rounded-md text-sm py-2 z-50">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleMenuAction("view", service.id)}
            >
              {t('viewServiceDetail')}
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleMenuAction("edit", service.id)}
            >
              {t('editService')}
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleMenuAction("addProcedure", service.id)}
            >
              {t('addProcedure')}
            </li>
            <li
              className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
              onClick={() => handleDeleteService(service?.id)}
            >
              {t('deleteService')}
            </li>
          </ul>
        )}
      </td>

    </tr>
  ))}
</tbody>

        </table>
      ) : (
        <p className="text-gray-500">No Services available.</p>
      )}

        {/* Modal hiển thị ảnh */}
        {isModalOpen && (
          <ImageModal images={selectedImages} onClose={handleCloseModal} />
        )}
      </div>

    {showForm && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)", // Làm mờ nền phía sau
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000, // Đảm bảo hiển thị trên cùng
    }}
  >
    <ServiceForm
      onClose={() => setShowForm(false)}
      onSaveSuccess={() => {
        setShowForm(false);
        refetch();
        toast.success("Service added successfully!");
      }}
    />
  </div>
)}
 {/* Hiển thị PromotionForm khi click */}
 {modalType === "promotion" && selectedServiceId && (
  <PromotionForm serviceId={selectedServiceId} onClose={() => setModalType(null)} />
)}
{modalType === "procedure" && selectedServiceId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <AddProcedure onClose={() => setSelectedServiceId(null)} 
  clinicServiceId={selectedServiceId} />
    </div>
)}
      {showEditForm && editService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EditServiceForm
            initialData={editService}
            categories={categoriesData?.value || []}
            onClose={() => {
              setShowEditForm(false);
              setEditService(null);
            }}
            onSaveSuccess={() => {
              setShowEditForm(false);
              setEditService(null);
              refetch();
            }}
          />
        </div>
      )}

      <Pagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={setPageIndex}
      />

{viewService && (
  <Modal onClose={() => setViewService(null)}>
    <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-serif tracking-wide text-gray-800">{viewService?.name}</h2>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-pink-200 to-purple-200 rounded-full" />
        </div>

        {/* Service Info & Cover Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Information */}
          <div className="space-y-6 p-6 bg-white/80 backdrop-blur rounded-xl shadow-sm">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{viewService?.description}</p>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  {new Intl.NumberFormat("vi-VN").format(Number(viewService?.price || 0))} đ
                </span>
              </div>

              {viewService?.category && (
                <div
                  className="inline-flex items-center px-4 py-1.5 rounded-full 
                              bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100"
                >
                  <span className="text-sm font-medium text-green-700">{viewService.category.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative h-[300px] rounded-xl overflow-hidden group">
            {viewService?.coverImage?.length > 0 ? (
              <Image
                src={viewService.coverImage[0] || "/placeholder.svg"}
                alt="Cover"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                <ImageIcon className="w-12 h-12 mb-2" />
                <span className="text-sm">Không có ảnh</span>
              </div>
            )}
          </div>
        </div>

        {/* Clinics Section */}
        {viewService?.clinics?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-gray-800">Phòng khám</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
              {viewService.clinics.map((clinic: any) => (
                <motion.div
                  key={clinic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      {clinic.profilePictureUrl ? (
                        <Image
                          src={clinic.profilePictureUrl || "/placeholder.svg"}
                          alt={clinic.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <h4 className="font-medium text-gray-800">{clinic.name}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{clinic.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{clinic.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{clinic.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Procedures Section */}
        {viewService?.procedures?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-gray-800">Các thủ tục</h3>
            <div className="space-y-4">
              {viewService.procedures.map((procedure: any, index: number) => (
                <motion.div
                  key={procedure.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="flex gap-6 p-4">
                    {/* Procedure Image */}
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                      {procedure.coverImage?.length ? (
                        <Image
                          src={procedure.coverImage[0] || "/placeholder.svg"}
                          alt={procedure.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Procedure Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-800">{procedure.name}</h4>
                        <p className="text-gray-600 mt-1">{procedure.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Bước:</span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
                          {procedure.stepIndex}
                        </span>
                      </div>

                      {/* Price Types */}
                      {procedure.procedurePriceTypes?.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {procedure.procedurePriceTypes.map((priceType: any) => (
                            <div
                              key={priceType.id}
                              className="p-3 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                            >
                              <div className="text-sm font-medium text-gray-600">{priceType.name}</div>
                              <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                                {new Intl.NumberFormat("vi-VN").format(priceType.price)} đ
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
  </Modal>
)}


    </div>
  );
}
