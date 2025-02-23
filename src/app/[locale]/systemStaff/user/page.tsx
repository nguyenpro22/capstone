import Image from "next/image";
import React from "react";

const UserList: React.FC = () => {
  const users = [
    {
      id: 1,
      image: "https://via.placeholder.com/40",
      name: "Apple Watch Series 4",
      email: "user1@gmail.com",
      phone: "123456789",
      role: "Admin System",
      status: "Active",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/40",
      name: "Microsoft Headsquare",
      email: "user1@gmail.com",
      phone: "123456789",
      role: "Admin clinic",
      status: "Active",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/40",
      name: "Women's Dress",
      email: "user1@gmail.com",
      phone: "123456789",
      role: "Staff clinic",
      status: "Active",
    },
    {
      id: 4,
      image: "https://via.placeholder.com/40",
      name: "Samsung A50",
      email: "user1@gmail.com",
      phone: "123456789",
      role: "Staff clinic",
      status: "Inactive",
    },
  ];

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-semibold mb-4">User List</h1>

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
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-3">
                <input type="checkbox" />
              </td>
              <td className="p-3">
                <Image
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.phone}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 text-sm rounded-md ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="p-3">
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
    </div>
  );
};

export default UserList;
