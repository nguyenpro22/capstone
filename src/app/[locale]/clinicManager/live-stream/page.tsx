"use client";

import React, { useState } from "react";
import Sidebar from "@/components/clinicManager/Sidebar";
import LiveHistoryTable from "@/components/clinicManager/LiveHistoryTable";
import LiveStreamForm from "@/components/clinicManager/LiveStreamForm";
import Image from "next/image";

type LiveStreamFormProps = {
  formValues: { id: string; image: string };
  onSubmit: (formValues: { id: string; image: string }) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
};
const LiveStreamManager: React.FC = () => {
  const liveHistory = [
    {
      id: "ID 1",
      image: "https://via.placeholder.com/50",
      productsSold: 100,
      date: "12.09.2019",
      time: "12:53 PM",
      highestViews: 423,
      amount: "$34,295",
      status: "Live",
    },
    {
      id: "ID 2",
      image: "https://via.placeholder.com/50",
      productsSold: 100,
      date: "12.09.2019",
      time: "12:53 PM",
      highestViews: 423,
      amount: "$34,295",
      status: "Finished",
    },
  ];

  const [currentLiveStream, setCurrentLiveStream] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({ id: "", image: "" });

  // Xử lý khi gửi form
  const handleFormSubmit = (formValues: { id: string; image: string }) => {
    setCurrentLiveStream({
      id: formValues.id || "New Stream",
      image: formValues.image || "https://via.placeholder.com/600x300",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    });
    setShowForm(false); // Đóng form
    setFormValues({ id: "", image: "" }); // Reset form
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Kết thúc luồng
  const handleEndStream = () => {
    alert("Luồng trực tiếp đã kết thúc!");
    setCurrentLiveStream(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Live Stream</h1>

      {/* Hiển thị luồng hiện tại hoặc nút tạo luồng */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {currentLiveStream ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Luồng trực tiếp</h2>
            <Image
              src={currentLiveStream.image}
              alt="Live Stream"
              className="w-full rounded-lg mb-4"
            />
            <p>
              <strong>ID:</strong> {currentLiveStream.id}
            </p>
            <p>
              <strong>Ngày:</strong> {currentLiveStream.date}
            </p>
            <p>
              <strong>Thời gian:</strong> {currentLiveStream.time}
            </p>
            <button
              onClick={handleEndStream}
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-600"
            >
              Kết thúc luồng
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-4">
              Không có luồng nào đang phát trực tiếp
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="border-2 border-dashed border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50"
            >
              + Tạo luồng mới
            </button>
          </>
        )}
      </div>

      {/* Form Tạo Luồng */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/5 flex">
            <Sidebar />
            {/* <LiveStreamForm
              formValues={formValues}
              onSubmit={handleFormSubmit}
              onInputChange={handleInputChange}
              onCancel={() => setShowForm(false)}
            /> */}
          </div>
        </div>
      )}

      {/* Bảng lịch sử các luồng */}
      <LiveHistoryTable history={liveHistory} />
    </div>
  );
};

export default LiveStreamManager;
