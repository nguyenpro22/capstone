"use client";

import { useState } from "react";
import {
  useGetServicesQuery,
  useLazyGetServiceByIdQuery,
  useDeleteServiceMutation, 
} from "@/features/clinic-service/api";
import {
  useGetCategoriesQuery 
} from "@/features/category-service/api";
import ServiceForm from "@/components/clinicManager/ServiceForm";
import EditServiceForm from "@/components/clinicManager/EditServiceForm";
import AddProcedure from "@/components/clinicManager/AddProcedure";

import Pagination from "@/components/common/Pagination/Pagination";
import ImageModal from "@/components/clinicManager/ImageModal";
import { Service } from '@/features/clinic-service/types';


import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MoreVertical } from "lucide-react"; // Import icon ba chấm và icon đóng
import Modal from "@/components/systemAdmin/Modal"; // Component popup để hiển thị thông tin gói
import Image from "next/image";

export default function ServicePage() {
  const [viewService, setViewService] = useState<any | null>(null); // Cho popup "Xem thông tin"
const [editService, setEditService] = useState<any | null>(null);
const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;

  const { data, refetch } = useGetServicesQuery({ 
                                                                pageIndex, 
                                                                pageSize,
                                                                searchTerm });
   const { data: categoriesData } = useGetCategoriesQuery({ pageIndex: 1, pageSize: 100, searchTerm: "" });

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
        <h1 className="text-2xl font-bold">Service Lists</h1>
        <input
          type="text"
          placeholder="Search By Service Name"
          className="border px-4 py-2 rounded-md w-1/3"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          Add new Service
        </button>
      </div>

      <div className="bg-white p-4 shadow rounded-lg relative">
      {services.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">No.</th>
              <th className="p-3 border">Service Name</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Cover Image</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
  {services.map((service: Service, index: number) => (
    <tr key={service.id} className="border-t">
      <td className="p-3 border">{(pageIndex - 1) * pageSize + index + 1}</td>
      <td className="p-3 border">{service.name}</td>
      <td className="p-3 border">{service.price.toLocaleString()} VND</td>
      <td className="p-3 border">
        <div className="flex items-center space-x-2">
          {service.coverImage && service.coverImage.length > 0 && (
            <img
              src={service.coverImage[0]}
              alt="Cover"
              className="w-12 h-12 object-cover rounded"
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
  
            <td className="p-3 border relative">
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
              Xem thông tin gói
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleMenuAction("edit", service.id)}
            >
              Chỉnh sửa thông tin gói
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleMenuAction("addProcedure", service.id)}
            >
              Thêm thủ tục
            </li>
            <li
              className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
              onClick={() => handleDeleteService(service?.id)}
            >
              Xóa gói
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
      {isModalOpen && <ImageModal images={selectedImages} onClose={handleCloseModal} />}
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

{selectedServiceId && (
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
    <div className="p-4 space-y-6">
      {/* Tiêu đề Modal */}
      <h2 className="text-2xl font-bold text-black text-center bg-gradient-to-r from-blue-100 to-white py-3 rounded-md">
        Thông tin dịch vụ
      </h2>

      {/* Thông tin Gói & Ảnh bìa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cột Trái: Thông tin Gói */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-blue-600">
            <strong className="text-black">Tên gói:</strong> {viewService?.name}
          </p>
          <p className="text-gray-700">
            <strong className="text-black">Mô tả:</strong> {viewService?.description}
          </p>
          <p className="text-xl font-bold text-orange-500">
            <strong className="text-black">Giá:</strong> {new Intl.NumberFormat("vi-VN").format(Number(viewService?.price || 0))} đ
          </p>
          {viewService?.category && (
            <p>
              <strong className="text-black">Danh mục:</strong>{" "}
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {viewService.category.name}
              </span>
            </p>
          )}
        </div>



        {/* Cột Phải: Ảnh bìa */}
        {viewService?.coverImage?.length > 0 ? (
          <img
            src={viewService.coverImage[0]}
            alt="Cover"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
            Không có ảnh
          </div>
        )}
      </div>

      {/* Danh sách Clinics */}
      {viewService?.clinics?.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-black">Phòng khám</h3>
          <div className="flex space-x-4 overflow-x-auto p-2">
            {viewService.clinics.map((clinic) => (
              <div
                key={clinic.id}
                className="flex items-center space-x-4 bg-white border rounded-lg shadow-md p-3 hover:shadow-lg transition w-72"
              >
                {/* Ảnh Clinic */}
                {clinic.profilePictureUrl ? (
                  <img
                    src={clinic.profilePictureUrl}
                    alt="Clinic"
                    className="w-16 h-16 rounded-full border border-gray-300 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full">
                    ?
                  </div>
                )}

                {/* Thông tin */}
                <div className="text-sm">
                  <p className="font-semibold text-black">{clinic.name}</p>
                  <p className="text-gray-600 flex items-center">
                    📧 {clinic.email}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    📍 {clinic.address}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    📞 {clinic.phoneNumber}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danh sách Procedures */}
      {viewService?.procedures?.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-black">Các thủ tục</h3>
          <div className="space-y-4">
            {viewService.procedures.map((procedure) => (
              <div key={procedure.id} className="border rounded-lg p-3 shadow-sm hover:shadow-md flex space-x-4">
                {/* Ảnh Thủ Tục */}
                {procedure.coverImage?.length > 0 ? (
                  <img
                    src={procedure.coverImage[0]}
                    alt="Procedure"
                    className="w-20 h-20 object-cover rounded-md border border-gray-300"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-200 text-gray-500 rounded-md">
                    No Image
                  </div>
                )}

                {/* Thông tin Thủ Tục */}
                <div className="flex-1">
                  <p className="font-semibold text-blue-600">{procedure.name}</p>
                  <p className="text-gray-700 text-sm">{procedure.description}</p>
                  <p className="text-sm font-medium text-gray-800">
                    Bước: <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{procedure.stepIndex}</span>
                  </p>

                  {/* Danh sách Giá Thủ Tục */}
                  {procedure.procedurePriceTypes?.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-bold text-gray-900">Loại Giá:</h4>
                      <ul className="space-y-2 mt-1">
                        {procedure.procedurePriceTypes.map((priceType) => (
                          <li key={priceType.id} className="border p-2 rounded bg-gray-50">
                            <p className="font-medium">{priceType.name}</p>
                            <p className="text-orange-500 font-semibold">
                              {new Intl.NumberFormat("vi-VN").format(priceType.price)} đ
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
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
