import React, { useState } from "react";
import { useAddProcedureMutation } from "@/features/clinic-service/api";
import { toast } from "react-toastify";

const AddProcedure = ({ onClose, clinicServiceId }: { onClose: () => void; clinicServiceId: string }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [procedureCoverImage, setProcedureCoverImage] = useState<File | null>(null);
  const [priceTypes, setPriceTypes] = useState([{ name: "", duration: 0, price: 0 }]);

  const [addProcedure, { isLoading }] = useAddProcedureMutation();

  const handleAddPriceType = () => {
    setPriceTypes([...priceTypes, { name: "", duration: 0, price: 0 }]);
  };

  const handleRemovePriceType = (index: number) => {
    setPriceTypes(priceTypes.filter((_, i) => i !== index));
  };

  const handlePriceTypeChange = (index: number, field: string, value: any) => {
    const updatedPriceTypes = priceTypes.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setPriceTypes(updatedPriceTypes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        toast.error("Tên thủ tục không được để trống!");
        return;
      }
      if (!description.trim()) {
        toast.error("Mô tả không được để trống!");
        return;
      }
      if (priceTypes.length === 0) {
        toast.error("Phải có ít nhất một loại giá!");
        return;
      }
    
      // Chuyển đổi format đúng theo API yêu cầu
      const procedurePriceTypes = priceTypes.map((item) => ({
        Name: item.name,
        Duration: item.duration,
        Price: item.price,
      }));
    const formData = new FormData();
    formData.append("clinicServiceId", clinicServiceId);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("stepIndex", stepIndex.toString());
    if (procedureCoverImage) {
      formData.append("procedureCoverImage", procedureCoverImage);
    }
    formData.append("procedurePriceTypes", JSON.stringify(procedurePriceTypes));

    try {
      await addProcedure({ data: formData }).unwrap();
      toast.success("Thêm thủ tục thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm Procedure:", error);
      toast.error("Thêm thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Thêm Thủ Tục</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Tên Thủ Tục</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Mô Tả</label>
            <textarea
              className="w-full p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Step Index</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={stepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Hình Ảnh</label>
            <input
              type="file"
              className="w-full p-2 border rounded"
              onChange={(e) => setProcedureCoverImage(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="block font-medium">Loại Giá Dịch Vụ</label>
            {priceTypes.map((item, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Tên"
                  className="p-2 border rounded w-1/3"
                  value={item.name}
                  onChange={(e) => handlePriceTypeChange(index, "name", e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Thời gian (phút)"
                  className="p-2 border rounded w-1/3"
                  value={item.duration}
                  onChange={(e) => handlePriceTypeChange(index, "duration", Number(e.target.value))}
                  required
                />
                <input
                  type="number"
                  placeholder="Giá (VND)"
                  className="p-2 border rounded w-1/3"
                  value={item.price}
                  onChange={(e) => handlePriceTypeChange(index, "price", Number(e.target.value))}
                  required
                />
                {index > 0 && (
                  <button type="button" onClick={() => handleRemovePriceType(index)} className="text-red-500">
                    Xóa
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddPriceType} className="text-blue-500 mt-2">
              + Thêm Loại Giá
            </button>
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Hủy
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {isLoading ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProcedure;
