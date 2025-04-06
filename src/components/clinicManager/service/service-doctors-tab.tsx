"use client"

import { useState } from "react"
import { Plus, X, Search, Trash2, Mail } from "lucide-react"
import Image from "next/image"
import { toast } from "react-toastify"
import { useAddDoctorToServiceMutation, useRemoveDoctorFromServiceMutation } from "@/features/doctor-service/api"
import { useGetDoctorsQuery } from "@/features/clinic/api"
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import type { Doctor } from "@/features/clinic/types"

interface ServiceDoctorsTabProps {
  serviceId: string
  doctorServices: any[]
  onRefresh: () => void
}

export default function ServiceDoctorsTab({ serviceId, doctorServices, onRefresh }: ServiceDoctorsTabProps) {
  const [isAddingDoctor, setIsAddingDoctor] = useState(false)
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 100

  // Get the token and extract clinicId
  const token = getAccessToken()
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null
  const clinicId = tokenData?.clinicId || ""

  // Role = 1 cho Doctor (theo code của bạn)
  const doctorRole = 1

  // Sử dụng RTK Query hooks với endpoint mới
  const { data: doctorsData, isLoading: isLoadingDoctors } = useGetDoctorsQuery(
    {
      clinicId,
      pageIndex,
      pageSize,
      searchTerm,
      role: doctorRole,
    },
    { skip: !isAddingDoctor || !clinicId },
  )

  const [addDoctorToService, { isLoading: isAdding }] = useAddDoctorToServiceMutation()
  const [removeDoctorFromService, { isLoading: isRemoving }] = useRemoveDoctorFromServiceMutation()

  // Lấy danh sách bác sĩ từ response
  const availableDoctors = doctorsData?.value?.items || []

  // Lọc ra các bác sĩ chưa được gán cho dịch vụ này
  // Chú ý: Sử dụng employeeId thay vì id
  const assignedDoctorIds = doctorServices.map((ds: any) => ds.doctor?.employeeId)
  const filteredAvailableDoctors = availableDoctors.filter(
    (doctor: Doctor) => !assignedDoctorIds.includes(doctor.employeeId),
  )

  const handleAddDoctors = async () => {
    if (selectedDoctors.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một bác sĩ")
      return
    }

    try {
      // Sử dụng employeeId làm doctorId
      await addDoctorToService({
        doctorId: selectedDoctors[0],
        serviceIds: [serviceId],
      }).unwrap()

      // Nếu API hỗ trợ thêm nhiều bác sĩ cùng lúc
      if (selectedDoctors.length > 1) {
        const promises = selectedDoctors.slice(1).map((doctorId) =>
          addDoctorToService({
            doctorId,
            serviceIds: [serviceId],
          }).unwrap(),
        )

        await Promise.all(promises)
      }

      toast.success("Thêm bác sĩ thành công")
      setIsAddingDoctor(false)
      setSelectedDoctors([])

      // Đảm bảo đợi một chút trước khi refresh để API có thời gian cập nhật
      setTimeout(async () => {
        // Gọi onRefresh để cập nhật dữ liệu từ component cha
        await onRefresh()
      }, 400)
    } catch (error) {
      console.error("Error adding doctors:", error)
      toast.error("Không thể thêm bác sĩ")
      setTimeout(async () => {
        // Gọi onRefresh để cập nhật dữ liệu từ component cha
        await onRefresh()
      }, 400)
    }
  }

  const handleRemoveDoctor = async (doctorServiceId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bác sĩ này khỏi dịch vụ?")) {
      return
    }

    try {
      await removeDoctorFromService({
        doctorServiceIds: [doctorServiceId],
      }).unwrap()

      toast.success("Đã xóa bác sĩ khỏi dịch vụ")

      // Đảm bảo đợi một chút trước khi refresh để API có thời gian cập nhật
      setTimeout(async () => {
        // Gọi onRefresh để cập nhật dữ liệu từ component cha
        await onRefresh()
      }, 300)
    } catch (error) {
      console.error("Error removing doctor:", error)
      toast.error("Có lỗi xảy ra khi xóa bác sĩ")
    }
  }

  // Lọc bác sĩ theo searchTerm
  const searchFilteredDoctors = filteredAvailableDoctors.filter((doctor: Doctor) =>
    doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Bác sĩ thực hiện dịch vụ</h3>
        {!isAddingDoctor && (
          <button
            onClick={() => setIsAddingDoctor(true)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Thêm bác sĩ</span>
          </button>
        )}
      </div>

      {isAddingDoctor ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Chọn bác sĩ</h4>
            <button
              onClick={() => {
                setIsAddingDoctor(false)
                setSelectedDoctors([])
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm bác sĩ..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <div className="max-h-60 overflow-y-auto mb-4">
            {isLoadingDoctors ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Đang tải danh sách bác sĩ...</p>
              </div>
            ) : searchFilteredDoctors.length > 0 ? (
              <div className="space-y-2">
                {searchFilteredDoctors.map((doctor: Doctor) => (
                  <div key={doctor.employeeId} className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
                    <input
                      type="checkbox"
                      id={`doctor-${doctor.employeeId}`}
                      checked={selectedDoctors.includes(doctor.employeeId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDoctors([...selectedDoctors, doctor.employeeId])
                        } else {
                          setSelectedDoctors(selectedDoctors.filter((id) => id !== doctor.employeeId))
                        }
                      }}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-3 flex-shrink-0"
                    />
                    <div className="flex items-center min-w-0 flex-1 overflow-hidden">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                        <Image
                          src={doctor.profilePictureUrl || "/placeholder.svg"}
                          alt={doctor.fullName}
                          width={40}
                          height={40}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <h4 className="font-medium text-gray-800 truncate w-full" title={doctor.fullName}>
                          {doctor.fullName}
                        </h4>
                        {doctor.email && (
                          <div className="flex items-center text-sm text-gray-500 w-full overflow-hidden">
                            <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate w-full" title={doctor.email}>
                              {doctor.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">Không tìm thấy bác sĩ</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsAddingDoctor(false)
                setSelectedDoctors([])
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isAdding}
            >
              Hủy
            </button>
            <button
              onClick={handleAddDoctors}
              disabled={isAdding || selectedDoctors.length === 0}
              className={`px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-600 text-white ${
                isAdding || selectedDoctors.length === 0 ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"
              }`}
            >
              {isAdding ? "Đang xử lý..." : "Thêm bác sĩ"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {doctorServices && doctorServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctorServices.map((doctorService: any) => (
                <div
                  key={doctorService.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center w-[calc(100%-30px)] overflow-hidden">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                        <Image
                          src={doctorService.doctor?.profilePictureUrl || "/placeholder.svg"}
                          alt={doctorService.doctor?.fullName || "Doctor"}
                          width={48}
                          height={48}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <h4
                          className="font-medium text-gray-800 truncate w-full"
                          title={doctorService.doctor?.fullName}
                        >
                          {doctorService.doctor?.fullName}
                        </h4>
                        {doctorService.doctor?.email && (
                          <div className="flex items-center text-sm text-gray-500 w-full overflow-hidden">
                            <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate w-full" title={doctorService.doctor.email}>
                              {doctorService.doctor.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveDoctor(doctorService.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                      title="Xóa bác sĩ khỏi dịch vụ"
                      disabled={isRemoving}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-3">Chưa có bác sĩ nào được gán cho dịch vụ này</p>
              <button
                onClick={() => setIsAddingDoctor(true)}
                className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-200 rounded-md hover:bg-purple-50 transition-colors"
              >
                Thêm bác sĩ đầu tiên
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

