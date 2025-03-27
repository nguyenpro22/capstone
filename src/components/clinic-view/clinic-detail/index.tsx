"use client";

import { useState } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ClinicHeader } from "./clinic-header";
import { OverviewTab } from "./overview-tab";
import { BranchesTab } from "./branches-tab";
import { DocumentsTab } from "./documents-tab";
import { LivestreamModal } from "./livestream-modal";
import type { ClinicDetail as ClinicDetailType } from "@/types/clinic";

// Thêm livestreamUrl vào interface ClinicDetailProps
interface ClinicService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number; // Thời gian thực hiện (phút)
  imageUrl?: string;
  isPopular?: boolean;
}

interface ClinicBranch {
  Id: string;
  Name: string;
  Email: string;
  PhoneNumber: string;
  City?: string;
  Address?: string;
  District?: string;
  Ward?: string;
  FullAddress?: string;
  TaxCode: string;
  BusinessLicenseUrl: string;
  OperatingLicenseUrl: string;
  OperatingLicenseExpiryDate?: Date;
  ProfilePictureUrl?: string;
  TotalBranches: number;
  IsActivated: boolean;
  Services?: ClinicService[]; // Thêm danh sách dịch vụ cho chi nhánh
  LivestreamUrl?: string; // Thêm URL livestream cho chi nhánh
}

interface ClinicDetailProps {
  Id: string;
  Name: string;
  Email: string;
  PhoneNumber: string;
  City?: string;
  Address?: string;
  District?: string;
  Ward?: string;
  FullAddress?: string;
  TaxCode: string;
  BusinessLicenseUrl: string;
  OperatingLicenseUrl: string;
  OperatingLicenseExpiryDate?: Date;
  ProfilePictureUrl?: string;
  TotalBranches: number;
  IsActivated: boolean;
  Branches?: ClinicBranch[];
  LivestreamUrl?: string; // Thêm URL livestream cho phòng khám
  LivestreamThumbnail?: string; // Thêm thumbnail cho livestream
  LiveViewerCount?: number; // Số người đang xem livestream
}

// Thêm state cho livestream modal
export function ClinicDetail({
  Id,
  Name,
  Email,
  PhoneNumber,
  City,
  Address,
  District,
  Ward,
  FullAddress,
  TaxCode,
  BusinessLicenseUrl,
  OperatingLicenseUrl,
  OperatingLicenseExpiryDate,
  ProfilePictureUrl,
  TotalBranches,
  IsActivated,
  Branches = [],
  LivestreamUrl,
  LivestreamThumbnail,
  LiveViewerCount = 0,
}: ClinicDetailType) {
  const [activeTab, setActiveTab] = useState("overview");
  const [livestreamModalOpen, setLivestreamModalOpen] = useState(false);

  // Format date with Vietnamese locale
  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return format(date, "dd MMMM yyyy", { locale: vi });
  };

  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Thêm hàm mở modal livestream
  const openLivestreamModal = () => {
    setLivestreamModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2">
          <Home className="mr-2 h-4 w-4" />
          Trang chủ
        </Button>
        <span className="text-muted-foreground mx-2">/</span>
        <span className="text-muted-foreground">Chi tiết phòng khám</span>
      </div>

      {/* Clinic Header */}
      <ClinicHeader
        Name={Name}
        Email={Email}
        PhoneNumber={PhoneNumber}
        FullAddress={FullAddress}
        ProfilePictureUrl={ProfilePictureUrl}
        IsActivated={IsActivated}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass-effect mb-6">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="branches">
            Chi nhánh ({TotalBranches})
          </TabsTrigger>
          <TabsTrigger value="documents">Giấy phép</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            Name={Name}
            Email={Email}
            PhoneNumber={PhoneNumber}
            TaxCode={TaxCode}
            IsActivated={IsActivated}
            TotalBranches={TotalBranches}
            FullAddress={FullAddress}
            Address={Address}
            City={City}
            District={District}
            Ward={Ward}
            LivestreamThumbnail={LivestreamThumbnail}
            LiveViewerCount={LiveViewerCount}
            onViewLivestream={openLivestreamModal}
          />
        </TabsContent>

        <TabsContent value="branches">
          <BranchesTab branches={Branches} formatPrice={formatPrice} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab
            TaxCode={TaxCode}
            BusinessLicenseUrl={BusinessLicenseUrl}
            OperatingLicenseUrl={OperatingLicenseUrl}
            OperatingLicenseExpiryDate={OperatingLicenseExpiryDate}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>

      {/* Livestream Modal */}
      <LivestreamModal
        open={livestreamModalOpen}
        onOpenChange={setLivestreamModalOpen}
        clinicName={Name}
        thumbnailUrl={LivestreamThumbnail}
        viewerCount={LiveViewerCount}
      />
    </div>
  );
}
