"use client";

import { FileText, Calendar, Clock, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface DocumentsTabProps {
  TaxCode: string;
  BusinessLicenseUrl: string;
  OperatingLicenseUrl: string;
  OperatingLicenseExpiryDate?: Date;
  formatDate: (date?: Date) => string;
}

export function DocumentsTab({
  TaxCode,
  BusinessLicenseUrl,
  OperatingLicenseUrl,
  OperatingLicenseExpiryDate,
  formatDate,
}: DocumentsTabProps) {
  return (
    <div className="space-y-6">
      <Card className="glass-effect border-none">
        <CardHeader>
          <CardTitle>Giấy phép kinh doanh</CardTitle>
          <CardDescription>
            Thông tin giấy phép kinh doanh của phòng khám
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Mã số thuế
              </h3>
              <p className="text-lg">{TaxCode}</p>
            </div>
            <Button
              variant="outline"
              className="border-white/20 hover:bg-white/10"
              onClick={() => window.open(BusinessLicenseUrl, "_blank")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Xem giấy phép kinh doanh
              <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
          </div>

          <div className="aspect-video rounded-lg overflow-hidden bg-black/20 relative">
            {BusinessLicenseUrl &&
              (BusinessLicenseUrl.toLowerCase().endsWith(".pdf") ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <Button
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                      onClick={() => window.open(BusinessLicenseUrl, "_blank")}
                    >
                      Mở tài liệu PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <Image
                  src={BusinessLicenseUrl || "/placeholder.svg"}
                  alt="Giấy phép kinh doanh"
                  fill
                  className="object-contain"
                />
              ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-none">
        <CardHeader>
          <CardTitle>Giấy phép hoạt động</CardTitle>
          <CardDescription>
            Thông tin giấy phép hoạt động của phòng khám
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Ngày hết hạn
              </h3>
              <p className="text-lg flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {OperatingLicenseExpiryDate
                  ? formatDate(OperatingLicenseExpiryDate)
                  : "Không có thông tin"}

                {OperatingLicenseExpiryDate &&
                  new Date(OperatingLicenseExpiryDate) < new Date() && (
                    <Badge
                      variant="destructive"
                      className="ml-2 bg-red-500/20 text-red-500"
                    >
                      <Clock className="h-3 w-3 mr-1" /> Đã hết hạn
                    </Badge>
                  )}
              </p>
            </div>
            <Button
              variant="outline"
              className="border-white/20 hover:bg-white/10"
              onClick={() => window.open(OperatingLicenseUrl, "_blank")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Xem giấy phép hoạt động
              <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
          </div>

          <div className="aspect-video rounded-lg overflow-hidden bg-black/20 relative">
            {OperatingLicenseUrl &&
              (OperatingLicenseUrl.toLowerCase().endsWith(".pdf") ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <Button
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                      onClick={() => window.open(OperatingLicenseUrl, "_blank")}
                    >
                      Mở tài liệu PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <Image
                  src={OperatingLicenseUrl || "/placeholder.svg"}
                  alt="Giấy phép hoạt động"
                  fill
                  className="object-contain"
                />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
