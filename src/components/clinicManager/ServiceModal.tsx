import Image from "next/image";

interface ServiceModalProps {
  viewService: any;
  onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ viewService, onClose }) => {
  if (!viewService) return null;

  return (
    <div className="p-4 space-y-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-black text-center bg-gradient-to-r from-blue-100 to-white py-3 rounded-md">
        Thông tin dịch vụ
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-blue-600">
            <strong className="text-black">Tên gói:</strong> {viewService?.name}
          </p>
          <p className="text-gray-700">
            <strong className="text-black">Mô tả:</strong> {viewService?.description}
          </p>
          <p className="text-xl font-bold text-orange-500">
            <strong className="text-black">Giá:</strong> {new Intl.NumberFormat("vi-VN").format(Number(viewService?.price || 0))} đ
          </p>
          {viewService?.category && (
            <p>
              <strong className="text-black">Danh mục:</strong>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {viewService.category.name}
              </span>
            </p>
          )}
        </div>

        {viewService?.coverImage?.length > 0 ? (
          <Image
            src={viewService.coverImage[0]}
            alt="Cover"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
            width={100}
            height={100}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
            Không có ảnh
          </div>
        )}
      </div>

      {viewService?.clinics?.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-black">Phòng khám</h3>
          <div className="flex space-x-4 overflow-x-auto p-2">
            {viewService.clinics.map((clinic: any) => (
              <div key={clinic.id} className="flex items-center space-x-4 bg-white border rounded-lg shadow-md p-3 hover:shadow-lg transition w-72">
                {clinic.profilePictureUrl ? (
                  <Image
                    src={clinic.profilePictureUrl}
                    alt="Clinic"
                    className="w-16 h-16 rounded-full border border-gray-300 object-cover"
                    width={100}
                    height={100}
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full">?</div>
                )}
                <div className="text-sm">
                  <p className="font-semibold text-black">{clinic.name}</p>
                  <p className="text-gray-600">📧 {clinic.email}</p>
                  <p className="text-gray-600">📍 {clinic.address}</p>
                  <p className="text-gray-600">📞 {clinic.phoneNumber}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewService?.procedures?.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-black">Các thủ tục</h3>
          <div className="space-y-4">
            {viewService.procedures.map((procedure: any) => (
              <div key={procedure.id} className="border rounded-lg p-3 shadow-sm hover:shadow-md flex space-x-4">
                {procedure.coverImage?.length ? (
                  <Image
                    src={procedure.coverImage[0]}
                    alt="Procedure"
                    className="w-20 h-20 object-cover rounded-md border border-gray-300"
                    width={100}
                    height={100}
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-200 text-gray-500 rounded-md">
                    No Image
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-blue-600">{procedure.name}</p>
                  <p className="text-gray-700 text-sm">{procedure.description}</p>
                  <p className="text-sm font-medium text-gray-800">
                    Bước: <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{procedure.stepIndex}</span>
                  </p>
                  {procedure.procedurePriceTypes?.length ? (
                    <div className="mt-2">
                      <h4 className="text-sm font-bold text-gray-900">Loại Giá:</h4>
                      <ul className="space-y-2 mt-1">
                        {procedure.procedurePriceTypes.map((priceType: any) => (
                          <li key={priceType.id} className="border p-2 rounded bg-gray-50">
                            <p className="font-medium">{priceType.name}</p>
                            <p className="text-orange-500 font-semibold">
                              {new Intl.NumberFormat("vi-VN").format(priceType.price)} đ
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceModal;
