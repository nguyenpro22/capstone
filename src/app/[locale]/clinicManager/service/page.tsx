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
import Pagination from "@/components/common/Pagination/Pagination";
import ImageModal from "@/components/clinicManager/ImageModal";


import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MoreVertical } from "lucide-react"; // Import icon ba chấm và icon đóng
import Modal from "@/components/systemAdmin/Modal"; // Component popup để hiển thị thông tin gói

export default function Voucher() {
  const [viewService, setViewService] = useState<any | null>(null); // Cho popup "Xem thông tin"
const [editService, setEditService] = useState<any | null>(null);
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

  const services = data?.value?.items || [];
  const categories = categoriesData?.value || [];
  console.log("Service Data:", services); // Debug
  console.log("Category Data:", categories); // Debug


  const totalCount = data?.value?.totalCount || 0;
  const hasNextPage = data?.value?.hasNextPage;
  const hasPreviousPage = data?.value?.hasPreviousPage;

  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  // const [selectedService, setSelectedService] = useState<any | null>(null);

  const handleToggleMenu = (serviceId: string) => {
    setMenuOpen(menuOpen === serviceId ? null : serviceId);
  };
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (images: string[]) => {
    setSelectedImages(images);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleToggleStatus = async (ServiceId: string) => {
    try {
      await changeStatusService({ ServiceId}).unwrap(); // Đảo trạng thái
      console.log("Service Data:", { ServiceId }); // Debug
      toast.success("Trạng thái gói đã được cập nhật!");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleCloseMenu = () => {
    setMenuOpen(null);
  };

  const handleMenuAction = async (action: string, pkgId: string) => {
    if (action === "view") {
      try {
        const result = await fetchServiceById(pkgId).unwrap();
        setViewService(result.value); // Chỉ đặt giá trị cho View
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
        setEditService(result.value); // Chỉ đặt giá trị cho Edit
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
      setShowEditForm(true); // Chỉ mở form, không mở popup
    }
  
    setMenuOpen(null);
  };
  
  const handleDeleteService = async (ServiceId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gói này?")) {
      try {
        await deleteService(ServiceId).unwrap();
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
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service.id} className="border-t">
                <td className="p-3 border">{(pageIndex - 1) * pageSize + index + 1}</td>
                <td className="p-3 border">{service.name}</td>
                <td className="p-3 border">{service.price.toLocaleString()} VND</td>
                <td className="p-3 border">
                  <div className="flex items-center space-x-2">
                    {service.coverImage.length > 0 && (
                      <img
                        src={service.coverImage[0]}
                        alt="Cover"
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    {service.coverImage.length > 1 && (
                      <button
                        className="text-blue-500 underline text-sm"
                        onClick={() => handleOpenModal(service.coverImage)}
                      >
                        View More
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-3 border">{service.category.name}</td>
                <td className="p-3 border">
                  <input
                    type="checkbox"
                    checked={service.isActivated}
                    className="toggle-checkbox"
                    onChange={() => handleToggleStatus(service.id)}
                  />
                  <span className={service.isActivated ? "text-green-600" : "text-red-600"}>
                    {service.isActivated ? "Active" : "Inactive"}
                  </span>
                </td>
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
                        className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                        onClick={() => handleDeleteService(service.id)}
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
        <ServiceForm
          onClose={() => setShowForm(false)}
          onSaveSuccess={() => {
            setShowForm(false);
            refetch();
            toast.success(" Service added successfully!");
          }}
        />
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



      {/* <div className="flex items-center justify-between mt-4">
        <button
          disabled={!hasPreviousPage}
          onClick={() => setPageIndex((prev) => prev - 1)}
          className="px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900"
        >
          Prev
        </button>

        <span className="text-sm text-gray-500">
          Page {pageIndex} - {Math.ceil(totalCount / pageSize)}
        </span>

        <button
          disabled={!hasNextPage}
          onClick={() => setPageIndex((prev) => prev + 1)}
          className="px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900"
        >
          Next
        </button>
      </div> */}

      <Pagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={setPageIndex}
      />

  {viewService  && (
  <Modal onClose={() => setViewService(null)}>
    <h2 className="text-xl font-bold mb-4">Thông tin gói</h2>
    <p><strong>Tên gói:</strong> {viewService .name}</p>
    <p><strong>Mô tả:</strong> {viewService .description}</p>
    <p><strong>Giá:</strong> {new Intl.NumberFormat("vi-VN").format(Number(viewService?.price || 0))} đ</p>
    <p><strong>Thời gian:</strong> {viewService .duration} tháng</p>
    <p>
      <strong>Trạng thái:</strong>{" "}
      <span className={viewService .isActivated ? "text-green-600" : "text-red-600"}>
        {viewService .isActivated ? "Active" : "Inactive"}
      </span>
    </p>
  </Modal>
  )}

    </div>
  );
}
