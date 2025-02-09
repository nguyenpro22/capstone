'use client'
import React, { useState } from "react";

const BranchsList: React.FC = () => {
  const [clinics, setClinics] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/40",
      name: "Apple Watch Series 4",
      email: "user1@gmail.com",
      phone: "123456789",
      totalBranch: 5,
      status: true,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/40",
      name: "Microsoft Headsquare",
      email: "user1@gmail.com",
      phone: "123456789",
      totalBranch: 5,
      status: true,
    },
    {
      id: 3,
      image: "https://via.placeholder.com/40",
      name: "Women's Dress",
      email: "user1@gmail.com",
      phone: "123456789",
      totalBranch: 5,
      status: true,
    },
    {
      id: 4,
      image: "https://via.placeholder.com/40",
      name: "Samsung A50",
      email: "user1@gmail.com",
      phone: "123456789",
      totalBranch: 5,
      status: true,
    },
  ]);

  const [editingClinic, setEditingClinic] = useState<any | null>(null); // Clinic đang được chỉnh sửa

  const handleToggleStatus = (id: number) => {
    setClinics((prevClinics) =>
      prevClinics.map((clinic) =>
        clinic.id === id ? { ...clinic, status: !clinic.status } : clinic
      )
    );
  };

  const handleEditClinic = (id: number) => {
    const clinic = clinics.find((clinic) => clinic.id === id);
    setEditingClinic(clinic); // Gán clinic đang chỉnh sửa vào state
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingClinic((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    setClinics((prevClinics) =>
      prevClinics.map((clinic) =>
        clinic.id === editingClinic.id ? editingClinic : clinic
      )
    );
    setEditingClinic(null); // Đóng form chỉnh sửa
  };

  return (
    <div>

<h1 className="text-2xl font-semibold mb-4">Clinics List</h1>

    <div className="container mx-auto p-6 bg-white shadow-lg rounded-md">

      <div className="flex justify-between items-center mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Export
        </button>
        <input
          type="text"
          placeholder="Search By Phone/Email"
          className="border px-4 py-2 rounded-md w-1/3"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Add User
        </button>
      </div>

      <table className="table-auto w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">
              <input type="checkbox" />
            </th>
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Full Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Total Branch</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {clinics.map((clinic) => (
            <tr key={clinic.id} className="border-t">
              <td className="p-3">
                <input type="checkbox" />
              </td>
              <td className="p-3">
                <img
                  src={clinic.image}
                  alt={clinic.name}
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="p-3">{clinic.name}</td>
              <td className="p-3">{clinic.email}</td>
              <td className="p-3">{clinic.phone}</td>
              <td className="p-3">{clinic.totalBranch}</td>
              <td className="p-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={clinic.status}
                    className="toggle-checkbox"
                    onChange={() => handleToggleStatus(clinic.id)}
                  />
                  <span>{clinic.status ? "Active" : "Inactive"}</span>
                </label>
              </td>
              <td className="p-3 flex space-x-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleEditClinic(clinic.id)}
                >
                  ✏️
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  ...
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <div>
          Rows per page:
          <select className="border ml-2 px-2 py-1 rounded-md">
            <option>5</option>
            <option>10</option>
            <option>15</option>
          </select>
        </div>
        <div>1-5 of 6</div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md">❮</button>
          <button className="px-3 py-1 border rounded-md">❯</button>
        </div>
      </div>

      {editingClinic && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit Clinic</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={editingClinic.name}
                onChange={handleFormChange}
                placeholder="Name"
                className="w-full border px-4 py-2 rounded-md"
              />
              <input
                type="email"
                name="email"
                value={editingClinic.email}
                onChange={handleFormChange}
                placeholder="Email"
                className="w-full border px-4 py-2 rounded-md"
              />
              <input
                type="text"
                name="phone"
                value={editingClinic.phone}
                onChange={handleFormChange}
                placeholder="Phone"
                className="w-full border px-4 py-2 rounded-md"
              />
              <input
                type="number"
                name="totalBranch"
                value={editingClinic.totalBranch}
                onChange={handleFormChange}
                placeholder="Total Branch"
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={() => setEditingClinic(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleSaveChanges}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default BranchsList;
