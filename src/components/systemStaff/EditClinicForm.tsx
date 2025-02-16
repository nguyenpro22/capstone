import React, { useState } from "react";
import { Clinic } from "@/features/clinic/types";
import { useUpdateClinicMutation } from "@/features/clinic/api";

interface EditClinicFormProps {
  initialData: Partial<Clinic>;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const EditClinicForm: React.FC<EditClinicFormProps> = ({ initialData, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState<Partial<Clinic>>(initialData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updateClinic, { isLoading }] = useUpdateClinicMutation();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveChanges = async () => {
    if (!formData.id) return;

    const updatedFormData = new FormData();
    updatedFormData.append("clinicId", formData.id);
    updatedFormData.append("name", formData.name || "");
    updatedFormData.append("email", formData.email || "");
    updatedFormData.append("phoneNumber", formData.phoneNumber || "");
    updatedFormData.append("address", formData.address || "");

    if (selectedFile) {
      updatedFormData.append("profilePicture", selectedFile);
    }

    try {
      await updateClinic({ clinicId: formData.id, data: updatedFormData }).unwrap();
      alert("Clinic updated successfully!");
      onSaveSuccess();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update clinic.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
      <h2 className="text-xl font-semibold mb-4">Edit Clinic</h2>
      <div className="space-y-4">
        <input type="text" name="name" value={formData.name || ""} onChange={handleFormChange} className="w-full border px-4 py-2 rounded-md" placeholder="Clinic Name" />
        <input type="email" name="email" value={formData.email || ""} onChange={handleFormChange} className="w-full border px-4 py-2 rounded-md" placeholder="Email" readOnly />
        <input type="text" name="phoneNumber" value={formData.phoneNumber || ""} onChange={handleFormChange} className="w-full border px-4 py-2 rounded-md" placeholder="Phone Number" />
        <input type="text" name="address" value={formData.address || ""} onChange={handleFormChange} className="w-full border px-4 py-2 rounded-md" placeholder="Address" />
        <input type="file" onChange={handleFileChange} className="w-full border px-4 py-2 rounded-md" />
        {formData.profilePictureUrl && <img src={formData.profilePictureUrl} alt="Profile" className="w-24 h-24 object-cover rounded-md" />}
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <button className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={onClose}>Cancel</button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleSaveChanges} disabled={isLoading}>Save</button>
      </div>
    </div>
  );
};

export default EditClinicForm;
