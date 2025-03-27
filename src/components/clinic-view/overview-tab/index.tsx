import { CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LivestreamPreview } from "./livestream-preview";

interface OverviewTabProps {
  Name: string;
  Email: string;
  PhoneNumber: string;
  TaxCode: string;
  IsActivated: boolean;
  TotalBranches: number;
  FullAddress?: string;
  Address?: string;
  City?: string;
  District?: string;
  Ward?: string;
  LivestreamThumbnail?: string;
  LiveViewerCount?: number;
  onViewLivestream: () => void;
}

export function OverviewTab({
  Name,
  Email,
  PhoneNumber,
  TaxCode,
  IsActivated,
  TotalBranches,
  FullAddress,
  Address,
  City,
  District,
  Ward,
  LivestreamThumbnail,
  LiveViewerCount = 0,
  onViewLivestream,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Livestream section */}
      {LivestreamThumbnail && (
        <Card className="glass-effect border-none">
          <CardHeader>
            <CardTitle>Livestream</CardTitle>
            <CardDescription>
              Xem trực tiếp hoạt động tại phòng khám
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-[400px]">
              <LivestreamPreview
                thumbnailUrl={LivestreamThumbnail}
                title={`Livestream từ ${Name}`}
                isLive={true}
                viewerCount={LiveViewerCount}
                onView={onViewLivestream}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact information */}
      <Card className="glass-effect border-none">
        <CardHeader>
          <CardTitle>Thông tin liên hệ</CardTitle>
          <CardDescription>Thông tin liên hệ của phòng khám</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Tên phòng khám
              </h3>
              <p className="text-lg">{Name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Email
              </h3>
              <p className="text-lg">{Email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Số điện thoại
              </h3>
              <p className="text-lg">{PhoneNumber}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Mã số thuế
              </h3>
              <p className="text-lg">{TaxCode}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Trạng thái
              </h3>
              <p className="text-lg flex items-center">
                {IsActivated ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Đang hoạt động</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    <span>Ngừng hoạt động</span>
                  </>
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Tổng số chi nhánh
              </h3>
              <p className="text-lg">{TotalBranches}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address information */}
      <Card className="glass-effect border-none">
        <CardHeader>
          <CardTitle>Địa chỉ</CardTitle>
          <CardDescription>Địa chỉ của phòng khám</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FullAddress ? (
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Địa chỉ đầy đủ
              </h3>
              <p className="text-lg">{FullAddress}</p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Địa chỉ
                </h3>
                <p className="text-lg">{Address || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Thành phố
                </h3>
                <p className="text-lg">{City || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Quận/Huyện
                </h3>
                <p className="text-lg">{District || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Phường/Xã
                </h3>
                <p className="text-lg">{Ward || "Chưa cập nhật"}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
