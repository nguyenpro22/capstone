"use client";
import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  User,
} from "lucide-react";

// Define TypeScript interfaces for the API response
interface DoctorCertificate {
  id: string;
  title: string;
  description?: string;
  issueDate: string;
  expiryDate?: string;
  imageUrl: string;
  isVerified: boolean;
}

interface Doctor {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  doctorCertificates: DoctorCertificate[];
}

interface DoctorService {
  id: string;
  serviceId: string;
  doctor: Doctor;
}

interface ServiceDetails {
  id: string;
  name: string;
  doctorServices: DoctorService[];
  [key: string]: any; // For other properties
}

interface DoctorCertificateCardProps {
  service: ServiceDetails;
  compact?: boolean;
}

// Format date function
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Sample certificate data for demonstration
const sampleCertificates: DoctorCertificate[] = [
  {
    id: "cert-1",
    title: "Chứng chỉ hành nghề khoa thẩm mỹ",
    description:
      "Chứng nhận đủ điều kiện hành nghề trong lĩnh vực thẩm mỹ và phẫu thuật tạo hình",
    issueDate: "2018-05-15",
    expiryDate: "2028-05-15",
    imageUrl: "https://placehold.co/400x300.png",
    isVerified: true,
  },
  {
    id: "cert-2",
    title: "Chứng nhận chuyên khoa phẫu thuật tạo hình",
    description:
      "Chứng nhận hoàn thành khóa đào tạo chuyên sâu về phẫu thuật tạo hình khuôn mặt",
    issueDate: "2019-03-22",
    imageUrl: "https://placehold.co/400x300.png",
    isVerified: true,
  },
];

// Certificate Card Component for Dialog
const CertificateCard = ({
  certificate,
}: {
  certificate: DoctorCertificate;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden border-purple-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
      <CardContent className="p-0">
        <div className="relative">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={certificate.imageUrl || "https://placehold.co/400x300.png"}
              alt={certificate.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          {certificate.isVerified && (
            <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Đã xác thực
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{certificate.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Ngày cấp: {formatDate(certificate.issueDate)}</span>
          </div>
          {certificate.expiryDate && (
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <Clock className="h-4 w-4 mr-2" />
              <span>Hiệu lực đến: {formatDate(certificate.expiryDate)}</span>
            </div>
          )}

          {certificate.description && (
            <>
              <div
                className={`text-sm text-muted-foreground transition-all duration-300 overflow-hidden ${
                  isExpanded ? "" : "line-clamp-2"
                }`}
              >
                {certificate.description}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-purple-600 hover:text-purple-700 p-0 h-auto"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <span className="flex items-center">
                    Thu gọn <ChevronUp className="ml-1 h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex items-center">
                    Xem thêm <ChevronDown className="ml-1 h-4 w-4" />
                  </span>
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Empty Certificates Component
const EmptyCertificates = () => {
  return (
    <div className="text-center py-8">
      <FileText className="h-12 w-12 mx-auto text-purple-200 dark:text-gray-700 mb-4" />
      <h3 className="text-lg font-medium mb-2">Chưa có chứng chỉ</h3>
      <p className="text-muted-foreground max-w-md mx-auto text-sm">
        Bác sĩ này chưa cập nhật thông tin chứng chỉ. Vui lòng liên hệ trực tiếp
        để biết thêm chi tiết.
      </p>
    </div>
  );
};

// Main Component
export default function DoctorCertificateCard({
  service,
  compact = false,
}: DoctorCertificateCardProps) {
  // For demonstration, we'll use the first doctor in the service
  const doctor = service.doctorServices[0]?.doctor;

  // For demonstration, we'll use sample certificates
  // In a real application, you would use doctor.doctorCertificates
  const certificates = sampleCertificates;

  // If there's no doctor, show a message
  if (!doctor) {
    return (
      <div className="text-center py-4">
        <User className="h-8 w-8 mx-auto text-purple-200 dark:text-gray-700 mb-2" />
        <p className="text-sm text-muted-foreground">
          Không có thông tin bác sĩ
        </p>
      </div>
    );
  }

  // Compact view for service list
  if (compact) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer hover:text-purple-600 transition-colors">
            <GraduationCap className="h-4 w-4" />
            <span className="text-sm">Xem chứng chỉ bác sĩ</span>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chứng chỉ của bác sĩ {doctor.fullName}</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {/* Doctor Profile */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-purple-50 dark:bg-gray-800 border border-purple-100 dark:border-gray-700">
                {doctor.profilePictureUrl ? (
                  <Image
                    src={doctor.profilePictureUrl || "/placeholder.svg"}
                    alt={doctor.fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <User className="h-8 w-8 text-purple-200 dark:text-gray-700" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-lg">{doctor.fullName}</h3>
                <p className="text-sm text-muted-foreground">{doctor.email}</p>
                {doctor.phoneNumber && (
                  <p className="text-sm text-muted-foreground">
                    {doctor.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Certificates */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Chứng chỉ chuyên môn</h3>
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-0">
                  {certificates.length} chứng chỉ
                </Badge>
              </div>

              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((certificate) => (
                    <CertificateCard
                      key={certificate.id}
                      certificate={certificate}
                    />
                  ))}
                </div>
              ) : (
                <EmptyCertificates />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Full view for service detail page
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-6">Thông tin bác sĩ</h2>

      {/* Doctor Profile */}
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <div className="w-full md:w-1/4">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-purple-50 dark:bg-gray-800 border border-purple-100 dark:border-gray-700">
            {doctor.profilePictureUrl ? (
              <Image
                src={doctor.profilePictureUrl || "/placeholder.svg"}
                alt={doctor.fullName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="h-20 w-20 text-purple-200 dark:text-gray-700" />
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <h3 className="text-xl font-bold mb-2">{doctor.fullName}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {doctor.email && (
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2">{doctor.email}</span>
              </div>
            )}

            {doctor.phoneNumber && (
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground">Điện thoại:</span>
                <span className="ml-2">{doctor.phoneNumber}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-0">
              Bác sĩ thẩm mỹ
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Award className="h-3 w-3" />5 năm kinh nghiệm
            </Badge>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Certificates */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Chứng chỉ chuyên môn</h3>
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-0">
            {certificates.length} chứng chỉ
          </Badge>
        </div>

        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        ) : (
          <EmptyCertificates />
        )}
      </div>

      <div className="mt-8 text-center">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          Xem thêm thông tin bác sĩ
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
