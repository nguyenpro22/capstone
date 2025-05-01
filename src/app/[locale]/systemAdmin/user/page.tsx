import Image from "next/image";
import type React from "react";

const CustomerList: React.FC = () => {
  const customers = [
    {
      id: 1,
      image: "https://placehold.co/40x40.png",
      name: "Nguyễn Văn Anh",
      email: "nguyenvananh@gmail.com",
      phone: "0912345678",
      type: "Premium",
      status: "Active",
      lastPurchase: "15/04/2023",
      totalSpent: "28.500.000₫",
    },
    {
      id: 2,
      image: "https://placehold.co/40x40.png",
      name: "Trần Thị Hương",
      email: "tranthihuong@gmail.com",
      phone: "0987654321",
      type: "Standard",
      status: "Active",
      lastPurchase: "10/04/2023",
      totalSpent: "18.200.000₫",
    },
    {
      id: 3,
      image: "https://placehold.co/40x40.png",
      name: "Lê Minh Tuấn",
      email: "leminhtuanvn@gmail.com",
      phone: "0965432109",
      type: "Corporate",
      status: "Active",
      lastPurchase: "05/04/2023",
      totalSpent: "56.750.000₫",
    },
    {
      id: 4,
      image: "https://placehold.co/40x40.png",
      name: "Phạm Thị Mai",
      email: "phamthimai@gmail.com",
      phone: "0932109876",
      type: "Standard",
      status: "Inactive",
      lastPurchase: "20/03/2023",
      totalSpent: "8.150.000₫",
    },
  ];

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-semibold mb-4">Customer List</h1>

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
          Add Customer
        </button>
      </div>

      <table className="table-auto w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">
              <input type="checkbox" />
            </th>
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Customer Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Last Purchase</th>
            <th className="p-3 text-left">Total Spent</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t">
              <td className="p-3">
                <input type="checkbox" />
              </td>
              <td className="p-3">
                <Image
                  src={customer.image || "/placeholder.svg"}
                  alt={customer.name}
                  className="w-10 h-10 rounded-full"
                  width={40}
                  height={40}
                />
              </td>
              <td className="p-3">{customer.name}</td>
              <td className="p-3">{customer.email}</td>
              <td className="p-3">{customer.phone}</td>
              <td className="p-3">{customer.type}</td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 text-sm rounded-md ${
                    customer.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {customer.status}
                </span>
              </td>
              <td className="p-3">{customer.lastPurchase}</td>
              <td className="p-3">{customer.totalSpent}</td>
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
        <div>1-4 of 4</div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md">❮</button>
          <button className="px-3 py-1 border rounded-md">❯</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
