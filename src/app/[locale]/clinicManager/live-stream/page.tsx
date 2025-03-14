"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Video, Plus } from "lucide-react";
import { useState } from "react";
import { useLivestream } from "@/components/clinicManager/livestream/context";
import LivestreamForm from "@/components/clinicManager/LiveStreamForm";
const LiveStreamManager: React.FC = () => {
  const router = useRouter();
  const { formData, isFormSubmitted } = useLivestream();
  const [showForm, setShowForm] = useState<boolean>(false);

  const liveHistory = [
    {
      id: "LS-2023-001",
      image: "https://via.placeholder.com/50",
      title: "Giới thiệu dịch vụ làm đẹp mới",
      productsSold: 100,
      date: "12.09.2023",
      time: "12:53 PM",
      highestViews: 423,
      amount: "$34,295",
      status: "Live",
    },
    {
      id: "LS-2023-002",
      image: "https://via.placeholder.com/50",
      title: "Tư vấn chăm sóc da mùa đông",
      productsSold: 85,
      date: "10.09.2023",
      time: "10:30 AM",
      highestViews: 387,
      amount: "$28,150",
      status: "Finished",
    },
    {
      id: "LS-2023-003",
      image: "https://via.placeholder.com/50",
      title: "Khuyến mãi đặc biệt cuối tuần",
      productsSold: 120,
      date: "08.09.2023",
      time: "14:15 PM",
      highestViews: 512,
      amount: "$41,780",
      status: "Finished",
    },
  ];

  // Handle creating a new livestream
  const handleCreateLivestream = () => {
    setShowForm(true);
  };

  // If there's an active form submission, redirect to host page
  React.useEffect(() => {
    if (formData && isFormSubmitted) {
      router.push("/clinicManager/live-stream/host-page");
    }
  }, [formData, isFormSubmitted, router]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Video className="mr-3 text-purple-600" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Quản lý Livestream
            </span>
          </h1>

          <button
            onClick={handleCreateLivestream}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <Plus className="mr-2" size={18} />
            Tạo luồng mới
          </button>
        </div>

        {showForm && <LivestreamForm />}

        {!showForm && (
          <>
            {/* Information panel */}
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8 text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="text-purple-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Quản lý phát sóng trực tiếp
              </h2>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                Tạo một luồng trực tiếp mới để kết nối với khách hàng, giới
                thiệu sản phẩm và dịch vụ của bạn.
              </p>
              <button
                onClick={handleCreateLivestream}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center"
              >
                <Plus className="mr-2" size={20} />
                Tạo luồng trực tiếp mới
              </button>
            </div>

            {/* Bảng lịch sử các luồng */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  Lịch sử phát sóng
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tiêu đề
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lượt xem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm đã bán
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doanh thu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {liveHistory.map((stream, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {stream.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 mr-3 relative rounded-md overflow-hidden">
                              <Image
                                src={stream.image || "/placeholder.svg"}
                                alt={stream.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {stream.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stream.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stream.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stream.highestViews}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stream.productsSold}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {stream.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              stream.status === "Live"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {stream.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Hiển thị 1-3 của 3 kết quả
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    disabled
                  >
                    Trước
                  </button>
                  <button className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">
                    1
                  </button>
                  <button
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    disabled
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveStreamManager;
