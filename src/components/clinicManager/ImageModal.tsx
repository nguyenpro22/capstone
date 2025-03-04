import Image from "next/image";
import React from "react";

interface ImageModalProps {
  images: string[];
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 p-2 text-gray-600 hover:text-black"
        >
          ✖
        </button>
        <h3 className="text-lg font-semibold mb-4 text-center">Service Images</h3>
        <div className="grid grid-cols-2 gap-2">
          {images.map((img, index) => (
            <Image
              key={index} 
              src={img} 
              alt={`Cover ${index}`} 
              width={96} // Thay đổi kích thước phù hợp
              height={96}
              className="w-full h-24 object-cover rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
