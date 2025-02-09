import React, { useState } from "react";

interface LiveStreamFormProps {
  onSubmit: (formValues: { id: string; image: string }) => void;
  onCancel: () => void;
}

const LiveStreamForm: React.FC<LiveStreamFormProps> = ({ onSubmit, onCancel }) => {
  const [formValues, setFormValues] = useState({ id: "", image: "" });
  const [preview, setPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Display image preview
      setFormValues({ ...formValues, image: file.name }); // Store file name
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formValues); // Submit data to the parent component
    setFormValues({ id: "", image: "" }); // Reset form fields
    setPreview(null); // Reset image preview
  };

  const handleCancel = () => {
    setFormValues({ id: "", image: "" }); // Reset form values
    setPreview(null); // Reset image preview
    onCancel(); // Close the form
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/5 flex">
        {/* Sidebar Left */}
        <div className="w-1/4 border-r border-gray-300 pr-4">
          <h3 className="text-lg font-bold mb-4">Điều khiển cơ bản</h3>
          <ul className="space-y-4">
            <li className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <img src="/path-to-image.png" alt="icon" className="w-6 h-6" />
              </div>
              <span>Hình ảnh trang</span>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6">
          <h2 className="text-xl font-semibold mb-4">Tạo luồng trực tiếp</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Upload Image */}
            <div>
              <label className="block font-semibold mb-2">Tải ảnh lên:</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="fileInput"
                  className="border border-gray-300 rounded-md w-full p-2 flex items-center justify-center cursor-pointer text-blue-500 hover:underline"
                >
                  {formValues.image || "Chọn hình ảnh"}
                </label>
              </div>
              {preview && (
                <div className="mt-4">
                  <p className="text-gray-700 font-semibold mb-2">Preview:</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover border rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Stream Title */}
            <div>
              <label className="block font-semibold mb-2">Tiêu đề:</label>
              <input
                type="text"
                name="id"
                value={formValues.id}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md w-full p-2"
                placeholder="Nhập tiêu đề luồng phát"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Phát
              </button>
              <button
                type="button"
                onClick={handleCancel} // Trigger handleCancel function
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Right */}
        <div className="w-1/4 border-l border-gray-300 pl-4">
          <h3 className="text-lg font-bold mb-4">Thuộc tính cơ bản</h3>
          <div>
            <label className="block font-semibold mb-2">Tải ảnh lên:</label>
            <div className="border border-gray-300 rounded-md w-full p-2 flex items-center justify-center">
              <span className="text-gray-500">+ Thêm ảnh</span>
            </div>
            <div className="mt-4">
              <label className="block font-semibold mb-2">Vị trí hiển thị:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="position"
                  value="in-page"
                  defaultChecked
                  className="form-radio"
                />
                <span>Trong trang</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamForm;
