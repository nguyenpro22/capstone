import { ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 animate-fadeIn"
      onClick={onClose} // Đóng khi click bên ngoài modal
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-full md:w-[600px] max-h-[90vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng modal khi click vào nội dung bên trong
      >
        {/* Nút đóng */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 bg-gray-100 hover:bg-gray-200 rounded-full p-1"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Nội dung modal */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
