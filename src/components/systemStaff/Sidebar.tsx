'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; // Sử dụng usePathname
import Link from 'next/link'; // Import next/link để điều hướng mà không tải lại trang
import {
  HomeIcon,
  UserIcon,
  ChartBarIcon,
  TicketIcon,
  ArchiveIcon,
  CogIcon,
  LogoutIcon,
} from '@heroicons/react/outline';

type SidebarProps = {
  role: 'systemAdmin' | 'user' | 'manager';
  onClose: () => void;
};

export default function Sidebar({ role, onClose }: SidebarProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  useEffect(() => {
    // Đảm bảo component chỉ render trên client
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Trả về null khi chưa mount trên client
  }

  // Lấy phần đường dẫn mà không có tiền tố /en hoặc /vi
  const normalizePath = (path: string) => {
    return path.replace(/^\/(en|vi)/, ''); // Loại bỏ tiền tố ngôn ngữ (en hoặc vi)
  };

  // Kiểm tra đường dẫn có chứa /en hoặc /vi
  const normalizedPathname = normalizePath(pathname); // Chuẩn hóa pathname

  // In ra các giá trị để kiểm tra
  console.log('Current pathname:', pathname);
  console.log('Normalized pathname:', normalizedPathname);

  const menuItems = {
    systemAdmin: [
      { label: 'Dashboard', path: '/systemAdmin/dashboard', icon: <ChartBarIcon className="w-5 h-5" /> },
      { label: 'Voucher', path: '/systemAdmin/voucher', icon: <TicketIcon className="w-5 h-5" /> },
      { label: 'Package', path: '/systemAdmin/package', icon: <ArchiveIcon className="w-5 h-5" /> }, // Thêm Package
      { label: 'Settings', path: '/systemAdmin/settings', icon: <CogIcon className="w-5 h-5" /> }, // Thêm Settings
      { label: 'Logout', path: '/logout', icon: <LogoutIcon className="w-5 h-5" /> }, // Thêm Logout
    ],
    user: [
      { label: 'Home', path: '/user/home', icon: <HomeIcon className="w-5 h-5" /> },
      { label: 'Profile', path: '/user/profile', icon: <UserIcon className="w-5 h-5" /> },
      { label: 'Package', path: '/user/package', icon: <ArchiveIcon className="w-5 h-5" /> }, // Thêm Package
      { label: 'Settings', path: '/user/settings', icon: <CogIcon className="w-5 h-5" /> }, // Thêm Settings
      { label: 'Logout', path: '/logout', icon: <LogoutIcon className="w-5 h-5" /> }, // Thêm Logout
    ],
  };

  return (
    <div className="w-64 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-bold text-center">BeautyClinic</h1>
        <button
          onClick={onClose}
          className="text-gray-700 hover:text-gray-900 lg:hidden"
        >
          &times; {/* Biểu tượng đóng */}
        </button>
      </div>

      {/* Menu điều hướng */}
      <nav className="p-4">
        <ul className="space-y-4">
          {menuItems[role].map((item) => {
            // In ra giá trị của item.path để kiểm tra
            console.log('item.path for', item.label, ':', item.path);

            // Loại bỏ tiền tố ngôn ngữ từ item.path
            const normalizedItemPath = normalizePath(item.path);

            // Kiểm tra xem đường dẫn có khớp với pathname hay không
            const isActive = normalizedPathname === normalizedItemPath;

            // In ra giá trị của isActive và các đường dẫn để kiểm tra
            console.log(`Normalized pathname for ${item.label}:`, normalizedPathname);
            console.log(`Normalized item path for ${item.label}:`, normalizedItemPath);
            console.log(`isActive for ${item.label}:`, isActive);

            return (
              <li
                key={item.path}
                className={`flex items-center space-x-3 ${
                  isActive ? 'bg-blue-100 text-blue-700 rounded-md' : ''
                }`}
              >
                <Link href={item.path} className={`flex items-center space-x-3 p-2 w-full`}>
                  <span className={`text-gray-500 ${isActive ? 'text-blue-700' : ''}`}>
                    {item.icon}
                  </span>
                  <span
                    className={`${
                      isActive ? 'font-bold underline' : 'text-blue-600 hover:underline'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
