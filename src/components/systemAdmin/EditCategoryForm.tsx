import { useState } from "react";
import { useUpdateCategoryMutation } from "@/features/category-service/api";
import { toast } from "react-toastify";

interface EditCategoryFormProps {
  initialData: any;
  onClose: () => void;
  onSaveSuccess: () => void;
}

interface ValidationErrors {
  name?: string;
  description?: string;
  parentId?: string;
}

export default function EditCategoryForm({ initialData, onClose, onSaveSuccess }: EditCategoryFormProps) {
  const [formData, setFormData] = useState({
    id: initialData.id,
    name: initialData.name || "",
    description: initialData.description || "",
    parentId: initialData.parentId || "",
  });

  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
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
      await updateCategory(formData).unwrap();
      toast.success("Cập nhật danh mục thành công!");
      onSaveSuccess();
    } catch (error: any) {
      console.log("Error response:", error);

      if (error?.status === 400 || error?.status === 422) {
        const validationErrors = error?.data?.errors || [];
        if (validationErrors.length > 0) {
          const newErrors: Record<string, string> = {};
          validationErrors.forEach((err: { code: string; message: string }) => {
            newErrors[err.code.toLowerCase()] = err.message;
          });

          setValidationErrors(newErrors);
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
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa danh mục</h2>
        <form onSubmit={handleSubmit}>
          {/* ID (Read-only) */}
          <label className="block mb-2">ID</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            className="w-full border rounded p-2 mb-4 bg-gray-200"
            readOnly
          />

          {/* Name */}
          <label className="block mb-2">Tên danh mục</label>
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

          {/* Parent ID */}
          <label className="block mb-2">Parent ID</label>
          <input
            type="text"
            name="parentId"
            value={formData.parentId}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
          />
          {validationErrors.parentId && <p className="text-red-500 text-sm">{validationErrors.parentId}</p>}

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
