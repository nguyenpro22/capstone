"use client";

import React, { useState } from "react";
import Sidebar from "@/components/clinicManager/Sidebar";
import LiveHistoryTable from "@/components/clinicManager/LiveHistoryTable";
import LiveStreamForm from "@/components/clinicManager/LiveStreamForm";
import Image from "next/image";
import { Video, Users, ShoppingCart, DollarSign, Clock, Calendar, BarChart2, Eye, MessageCircle, Share2, Plus, X } from 'lucide-react';

type LiveStreamFormProps = {
  formValues: { id: string; image: string; title: string; description: string };
  onSubmit: (formValues: { id: string; image: string; title: string; description: string }) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCancel: () => void;
};

const LiveStreamManager: React.FC = () => {
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

  const [currentLiveStream, setCurrentLiveStream] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({ 
    id: "", 
    image: "",
    title: "",
    description: ""
  });
  
  // Giả lập dữ liệu thống kê cho luồng trực tiếp hiện tại
  const [liveStats, setLiveStats] = useState({
    viewers: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    sales: 0,
    revenue: 0
  });

  // Cập nhật thống kê mỗi 5 giây nếu đang có luồng trực tiếp
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentLiveStream) {
      interval = setInterval(() => {
        setLiveStats(prev => ({
          viewers: Math.floor(prev.viewers + Math.random() * 10),
          likes: Math.floor(prev.likes + Math.random() * 5),
          comments: Math.floor(prev.comments + Math.random() * 3),
          shares: Math.floor(prev.shares + Math.random() * 2),
          sales: Math.floor(prev.sales + Math.random() * 2),
          revenue: Math.floor(prev.revenue + Math.random() * 100)
        }));
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentLiveStream]);

  // Xử lý khi gửi form
  const handleFormSubmit = (formValues: { id: string; image: string; title: string; description: string }) => {
    setCurrentLiveStream({
      id: formValues.id || `LS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      image: formValues.image || "https://via.placeholder.com/600x300",
      title: formValues.title || "Luồng trực tiếp mới",
      description: formValues.description || "Mô tả luồng trực tiếp",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    });
    
    // Khởi tạo thống kê ban đầu
    setLiveStats({
      viewers: Math.floor(Math.random() * 50),
      likes: Math.floor(Math.random() * 20),
      comments: Math.floor(Math.random() * 10),
      shares: Math.floor(Math.random() * 5),
      sales: 0,
      revenue: 0
    });
    
    setShowForm(false); // Đóng form
    setFormValues({ id: "", image: "", title: "", description: "" }); // Reset form
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Kết thúc luồng
  const handleEndStream = () => {
    if (window.confirm("Bạn có chắc chắn muốn kết thúc luồng trực tiếp này?")) {
      // Thêm luồng hiện tại vào lịch sử (trong thực tế sẽ gọi API)
      // Ở đây chỉ mô phỏng
      setCurrentLiveStream(null);
      setLiveStats({
        viewers: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        sales: 0,
        revenue: 0
      });
    }
  };

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
          
          {!currentLiveStream && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <Plus className="mr-2" size={18} />
              Tạo luồng mới
            </button>
          )}
        </div>

        {/* Hiển thị luồng hiện tại hoặc nút tạo luồng */}
        {currentLiveStream ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transition-all duration-500">
            <div className="relative">
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center z-10 animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                LIVE
              </div>
              <div className="h-[400px] relative bg-gray-900">
                <Image
                  src={currentLiveStream.image || "/placeholder.svg"}
                  alt="Live Stream"
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">{currentLiveStream.title}</h2>
                  <p className="text-gray-200 mb-4">{currentLiveStream.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {currentLiveStream.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {currentLiveStream.time}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {liveStats.viewers} người xem
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-700 font-medium">Thông tin chung</h3>
                    <BarChart2 className="text-purple-500" size={20} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium">{currentLiveStream.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className="text-green-600 font-medium">Đang phát</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời lượng:</span>
                      <span className="font-medium">00:45:12</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-700 font-medium">Tương tác</h3>
                    <MessageCircle className="text-blue-500" size={20} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-500">Người xem</div>
                      <div className="text-xl font-bold text-blue-600 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {liveStats.viewers}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-500">Lượt thích</div>
                      <div className="text-xl font-bold text-red-500">
                        {liveStats.likes}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-500">Bình luận</div>
                      <div className="text-xl font-bold text-purple-600">
                        {liveStats.comments}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-500">Chia sẻ</div>
                      <div className="text-xl font-bold text-green-600 flex items-center">
                        <Share2 className="w-4 h-4 mr-1" />
                        {liveStats.shares}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-700 font-medium">Doanh thu</h3>
                    <DollarSign className="text-green-500" size={20} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-500">Đơn hàng</div>
                      <div className="text-xl font-bold text-orange-500 flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {liveStats.sales}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-500">Doanh thu</div>
                      <div className="text-xl font-bold text-green-600">
                        ${liveStats.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Mục tiêu: $100,000</span>
                      <span>45%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleEndStream}
                  className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                >
                  <X className="mr-2" size={18} />
                  Kết thúc luồng
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8 text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="text-purple-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Không có luồng nào đang phát trực tiếp</h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Tạo một luồng trực tiếp mới để kết nối với khách hàng, giới thiệu sản phẩm và dịch vụ của bạn.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center"
            >
              <Plus className="mr-2" size={20} />
              Tạo luồng trực tiếp mới
            </button>
          </div>
        )}

        {/* Form Tạo Luồng */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Tạo luồng trực tiếp mới</h2>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-4">Cài đặt luồng</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Video className="w-4 h-4 mr-2 text-purple-600" />
                        Cấu hình luồng trực tiếp
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-blue-600" />
                        Quản lý người xem
                      </div>
                      <div className="flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-2 text-green-600" />
                        Thiết lập sản phẩm
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <h4 className="font-medium text-purple-700 mb-2">Mẹo livestream</h4>
                      <ul className="text-sm text-purple-600 space-y-2">
                        <li>• Kiểm tra kết nối internet trước khi bắt đầu</li>
                        <li>• Đảm bảo ánh sáng tốt và âm thanh rõ ràng</li>
                        <li>• Chuẩn bị kịch bản trước khi phát sóng</li>
                        <li>• Tương tác với người xem thường xuyên</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Luồng</label>
                        <input
                          type="text"
                          name="id"
                          value={formValues.id}
                          onChange={handleInputChange}
                          placeholder="Tự động tạo nếu để trống"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="title"
                          value={formValues.title}
                          onChange={handleInputChange}
                          placeholder="Nhập tiêu đề luồng trực tiếp"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                        <textarea
                          name="description"
                          value={formValues.description}
                          onChange={handleInputChange}
                          placeholder="Mô tả ngắn về nội dung luồng trực tiếp"
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh bìa</label>
                        <input
                          type="text"
                          name="image"
                          value={formValues.image}
                          onChange={handleInputChange}
                          placeholder="Nhập URL hình ảnh hoặc để trống để sử dụng mặc định"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Kích thước đề xuất: 1280x720 pixels</p>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormSubmit(formValues)}
                          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Bắt đầu phát sóng
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bảng lịch sử các luồng */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Lịch sử phát sóng</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lượt xem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm đã bán</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {liveHistory.map((stream, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stream.id}</td>
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
                        <div className="text-sm font-medium text-gray-900">{stream.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stream.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stream.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stream.highestViews}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stream.productsSold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{stream.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        stream.status === 'Live' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {stream.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">Hiển thị 1-3 của 3 kết quả</div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
                Trước
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamManager;
