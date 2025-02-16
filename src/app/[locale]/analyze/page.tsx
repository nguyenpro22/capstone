"use client";

import { useState } from "react";

export default function FaceAnalysis() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!image) return alert("Vui lòng chọn ảnh!");

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Phân tích thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
      <button
        onClick={handleAnalyze}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Đang phân tích..." : "Phân tích khuôn mặt"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-lg font-bold">Kết quả phân tích:</h2>
          <pre className="text-sm bg-gray-100 p-2 mt-2 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
