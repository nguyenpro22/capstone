"use client";

import type React from "react";

import { useState } from "react";
import { Video, Calendar, ImageIcon, Lock, Globe } from "lucide-react";
import Image from "next/image";
import { useLivestream } from "./livestream/context";

export default function LivestreamForm() {
  const { submitForm } = useLivestream();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Skincare Tutorial");
  const [isPrivate, setIsPrivate] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitForm({
      title,
      description,
      category,
      isPrivate,
      thumbnailUrl: thumbnailUrl || undefined,
      scheduledTime:
        isScheduled && scheduledTime ? new Date(scheduledTime) : undefined,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Video className="mr-3 text-rose-600" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600">
            Tạo Livestream Mới
          </span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tiêu đề Livestream *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề cho buổi livestream của bạn"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mô tả
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả ngắn về nội dung livestream"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Danh mục
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
          >
            <option value="Skincare Tutorial">Hướng dẫn chăm sóc da</option>
            <option value="Makeup Masterclass">Lớp học trang điểm</option>
            <option value="Spa Treatment Demo">Demo điều trị spa</option>
            <option value="Product Launch">Ra mắt sản phẩm mới</option>
            <option value="Q&A Session">Phiên hỏi đáp</option>
          </select>
        </div>

        {/* Privacy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quyền riêng tư
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setIsPrivate(false)}
              className={`flex items-center px-4 py-2 rounded-lg border ${
                !isPrivate
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              <Globe className="w-4 h-4 mr-2" />
              Công khai
            </button>
            <button
              type="button"
              onClick={() => setIsPrivate(true)}
              className={`flex items-center px-4 py-2 rounded-lg border ${
                isPrivate
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Riêng tư
            </button>
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh thumbnail
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {thumbnailUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={thumbnailUrl || "/placeholder.svg"}
                    alt="Thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="Nhập URL hình ảnh"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nhập URL hình ảnh hoặc để trống để sử dụng ảnh mặc định
              </p>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <div className="flex items-center mb-2">
            <input
              id="schedule"
              type="checkbox"
              checked={isScheduled}
              onChange={() => setIsScheduled(!isScheduled)}
              className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
            />
            <label
              htmlFor="schedule"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Lên lịch livestream
            </label>
          </div>

          {isScheduled && (
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Bắt đầu Livestream
          </button>
        </div>
      </form>
    </div>
  );
}
