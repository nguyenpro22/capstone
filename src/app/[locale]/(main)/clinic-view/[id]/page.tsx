import { ClinicDetail } from "@/components/clinic/clinic-detail";
import { AnimatedGradientBackground } from "@/components/animated-gradient-background";
import type { ClinicDetail as ClinicDetailType } from "@/types/clinic";

// Dữ liệu mẫu cho phòng khám
const sampleClinic: ClinicDetailType = {
  Id: "550e8400-e29b-41d4-a716-446655440000",
  Name: "Phòng Khám Thẩm Mỹ BeautySkin",
  Email: "contact@beautyskin.vn",
  PhoneNumber: "0987654321",
  City: "Hồ Chí Minh",
  Address: "123 Nguyễn Văn Linh",
  District: "Quận 7",
  Ward: "Phường Tân Phú",
  FullAddress: "123 Nguyễn Văn Linh, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh",
  TaxCode: "0123456789",
  BusinessLicenseUrl: "/placeholder.svg?height=600&width=800",
  OperatingLicenseUrl: "/placeholder.svg?height=600&width=800",
  OperatingLicenseExpiryDate: new Date("2025-12-31"),
  ProfilePictureUrl: "/placeholder.svg?height=200&width=200",
  TotalBranches: 3,
  IsActivated: true,
  // Thêm thông tin livestream
  LivestreamUrl: "/placeholder.svg?height=300&width=400",
  LivestreamThumbnail: "/placeholder.svg?height=300&width=400",
  LiveViewerCount: 42,
  Branches: [
    {
      Id: "550e8400-e29b-41d4-a716-446655440001",
      Name: "BeautySkin - Chi nhánh Quận 1",
      Email: "quan1@beautyskin.vn",
      PhoneNumber: "0987654322",
      FullAddress: "45 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      TaxCode: "0123456789-001",
      BusinessLicenseUrl: "/placeholder.svg?height=600&width=800",
      OperatingLicenseUrl: "/placeholder.svg?height=600&width=800",
      OperatingLicenseExpiryDate: new Date("2025-10-15"),
      TotalBranches: 0,
      IsActivated: true,
      Services: [
        {
          id: "service-001",
          name: "Chăm sóc da cơ bản",
          description: "Làm sạch sâu, tẩy tế bào chết và đắp mặt nạ dưỡng ẩm",
          price: 450000,
          duration: 60,
          isPopular: true,
        },
        {
          id: "service-002",
          name: "Trị mụn chuyên sâu",
          description:
            "Điều trị mụn bằng công nghệ hiện đại, giảm viêm và ngăn ngừa tái phát",
          price: 850000,
          duration: 90,
        },
        {
          id: "service-003",
          name: "Massage mặt thư giãn",
          description:
            "Massage mặt với tinh dầu thiên nhiên, giúp thư giãn và cải thiện tuần hoàn máu",
          price: 350000,
          duration: 45,
        },
        {
          id: "service-004",
          name: "Trẻ hóa da công nghệ cao",
          description:
            "Sử dụng công nghệ RF và ánh sáng để kích thích tái tạo collagen, làm săn chắc da",
          price: 1200000,
          duration: 75,
          isPopular: true,
        },
      ],
    },
    {
      Id: "550e8400-e29b-41d4-a716-446655440002",
      Name: "BeautySkin - Chi nhánh Quận 3",
      Email: "quan3@beautyskin.vn",
      PhoneNumber: "0987654323",
      FullAddress: "78 Võ Văn Tần, Phường 6, Quận 3, TP. Hồ Chí Minh",
      TaxCode: "0123456789-002",
      BusinessLicenseUrl: "/placeholder.svg?height=600&width=800",
      OperatingLicenseUrl: "/placeholder.svg?height=600&width=800",
      OperatingLicenseExpiryDate: new Date("2025-11-20"),
      TotalBranches: 0,
      IsActivated: true,
      Services: [
        {
          id: "service-005",
          name: "Điều trị nám và tàn nhang",
          description:
            "Sử dụng công nghệ laser để giảm sắc tố và làm đều màu da",
          price: 1500000,
          duration: 60,
          isPopular: true,
        },
        {
          id: "service-006",
          name: "Tiêm filler môi",
          description: "Làm đầy và định hình môi bằng filler an toàn",
          price: 3500000,
          duration: 45,
        },
        {
          id: "service-007",
          name: "Căng da mặt không phẫu thuật",
          description: "Sử dụng chỉ collagen để nâng cơ và làm săn chắc da mặt",
          price: 5000000,
          duration: 120,
          isPopular: true,
        },
      ],
    },
    {
      Id: "550e8400-e29b-41d4-a716-446655440003",
      Name: "BeautySkin - Chi nhánh Thủ Đức",
      Email: "thuduc@beautyskin.vn",
      PhoneNumber: "0987654324",
      FullAddress:
        "256 Võ Văn Ngân, Phường Bình Thọ, TP. Thủ Đức, TP. Hồ Chí Minh",
      TaxCode: "0123456789-003",
      BusinessLicenseUrl: "/placeholder.svg?height=600&width=800",
      OperatingLicenseUrl: "/placeholder.svg?height=600&width=800",
      OperatingLicenseExpiryDate: new Date("2024-12-31"),
      TotalBranches: 0,
      IsActivated: false,
      Services: [
        {
          id: "service-008",
          name: "Chăm sóc da mụn",
          description:
            "Điều trị da mụn với sản phẩm chuyên biệt, giảm viêm và ngăn ngừa mụn mới",
          price: 550000,
          duration: 60,
        },
        {
          id: "service-009",
          name: "Tẩy tế bào chết toàn thân",
          description:
            "Loại bỏ tế bào chết và làm mịn da toàn thân với muối biển và tinh dầu",
          price: 650000,
          duration: 90,
          isPopular: true,
        },
        {
          id: "service-010",
          name: "Massage body thư giãn",
          description:
            "Massage toàn thân với tinh dầu thảo mộc, giúp thư giãn và giảm căng thẳng",
          price: 450000,
          duration: 60,
        },
      ],
    },
  ],
};

export default function ClinicDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Trong thực tế, bạn sẽ lấy dữ liệu từ API dựa trên params.id

  return (
    <AnimatedGradientBackground>
      <ClinicDetail {...sampleClinic} />
    </AnimatedGradientBackground>
  );
}
