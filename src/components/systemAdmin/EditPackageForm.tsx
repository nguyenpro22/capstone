import { useState } from "react";
import { useUpdatePackageMutation } from "@/features/package/api";
import { toast } from "react-toastify";

interface EditPackageFormProps {
  initialData: any;
  onClose: () => void;
  onSaveSuccess: () => void;
}

interface ValidationErrors {
  id?: string;
  name?: string;
  description?: string;
  price?: string;
  duration?: string;
}

export default function EditPackageForm({ initialData, onClose, onSaveSuccess }: EditPackageFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [updatePackage, { isLoading }] = useUpdatePackageMutation();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa lỗi khi người dùng sửa input
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePackage(formData).unwrap();
      toast.success("Cập nhật gói thành công!");
      onSaveSuccess();
    } catch (error: any) {
      console.log("Error response:", error); // Debug API response

      // Kiểm tra nếu lỗi là 400 hoặc 422 (Validation Error)
      if (error?.status === 400 || error?.status === 422) {
        const validationErrors = error?.data?.errors || [];

        if (validationErrors.length > 0) {
          // Tạo object chứa lỗi theo trường (field)
          const newErrors: Record<string, string> = {};
          validationErrors.forEach((err: { code: string; message: string }) => {
            newErrors[err.code.toLowerCase()] = err.message; // Chuyển code thành chữ thường
          });

          setValidationErrors(newErrors); // Cập nhật state lỗi để hiển thị trong form
        }

        toast.error(error?.data?.detail || "Dữ liệu không hợp lệ!");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa gói</h2>
        <form onSubmit={handleSubmit}>
          {/* ID */}
          <label className="block mb-2">ID</label>
          <input
            type="text"
            name="id"
            value={formData.documentId}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4 bg-gray-200"
             readOnly// Không cho chỉnh sửa ID
          />
          {validationErrors.id && <p className="text-red-500 text-sm">{validationErrors.id}</p>}

          {/* Name */}
          <label className="block mb-2">Tên gói</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
          />
          {validationErrors.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}

          {/* Description */}
          <label className="block mb-2">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
          />
          {validationErrors.description && <p className="text-red-500 text-sm">{validationErrors.description}</p>}

          {/* Price */}
          <label className="block mb-2">Giá ( đ )</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
          />
          {validationErrors.price && <p className="text-red-500 text-sm">{validationErrors.price}</p>}

          {/* Duration */}
          <label className="block mb-2">Thời gian (tháng)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
          />
          {validationErrors.duration && <p className="text-red-500 text-sm">{validationErrors.duration}</p>}

          {/* Buttons */}
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded mr-2">
              Hủy
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
