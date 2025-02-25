import Image from "next/image";
import React from "react";

const Sidebar: React.FC = () => (
  <div className="w-1/4 border-r border-gray-300 pr-4">
    <h3 className="text-lg font-bold mb-4">Điều khiển cơ bản</h3>
    <ul className="space-y-4">
      <li className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <Image src="/path-to-image.png" alt="icon" className="w-6 h-6" />
        </div>
        <span>Hình ảnh trang</span>
      </li>
      <li className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <Image src="/path-to-icon.png" alt="icon" className="w-6 h-6"
           width={96} // Thay đổi kích thước phù hợp
           height={96} />
        </div>
        <span>Thoát lưu giữ</span>
      </li>
    </ul>
  </div>
);

export default Sidebar;
