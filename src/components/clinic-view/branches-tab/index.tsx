"use client";

import { useState } from "react";
import {
  Building2,
  Phone,
  MapPin,
  Sparkles,
  ChevronDown,
  DollarSign,
  Timer,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ClinicBranch, ClinicService } from "@/types/clinic";

interface BranchesTabProps {
  branches: ClinicBranch[];
  formatPrice: (price: number) => string;
}

export function BranchesTab({ branches, formatPrice }: BranchesTabProps) {
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);

  // Toggle branch expansion
  const toggleBranchExpansion = (branchId: string) => {
    if (expandedBranch === branchId) {
      setExpandedBranch(null);
    } else {
      setExpandedBranch(branchId);
    }
  };

  if (!branches || branches.length === 0) {
    return (
      <Card className="glass-effect border-none">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Không có chi nhánh</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Phòng khám này chưa có chi nhánh nào được thêm vào hệ thống.
          </p>
          <Button className="bg-gradient">Thêm chi nhánh mới</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {branches.map((branch) => (
        <Card
          key={branch.Id}
          className={`glass-effect border-none hover:shadow-lg transition-all ${
            expandedBranch === branch.Id ? "ring-2 ring-primary/30" : ""
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-gradient">{branch.Name}</CardTitle>
              {branch.IsActivated ? (
                <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                  Hoạt động
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="bg-red-500/20 text-red-500 hover:bg-red-500/30"
                >
                  Ngừng hoạt động
                </Badge>
              )}
            </div>
            <CardDescription>{branch.Email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{branch.PhoneNumber}</span>
            </div>
            {branch.FullAddress && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{branch.FullAddress}</span>
              </div>
            )}

            {/* Hiển thị số lượng dịch vụ */}
            {branch.Services && branch.Services.length > 0 && (
              <div className="flex items-center text-sm">
                <Sparkles className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{branch.Services.length} dịch vụ có sẵn</span>
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                Xem chi tiết
              </Button>

              {branch.Services && branch.Services.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => toggleBranchExpansion(branch.Id)}
                  className="text-primary"
                >
                  {expandedBranch === branch.Id ? "Ẩn dịch vụ" : "Xem dịch vụ"}
                  <ChevronDown
                    className={`ml-2 h-4 w-4 transition-transform ${
                      expandedBranch === branch.Id ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              )}
            </div>
          </CardContent>

          {/* Phần hiển thị dịch vụ của chi nhánh */}
          {branch.Services &&
            branch.Services.length > 0 &&
            expandedBranch === branch.Id && (
              <CardFooter className="flex flex-col pt-4 border-t border-white/10">
                <h3 className="text-lg font-medium mb-4 text-gradient">
                  Dịch vụ tại chi nhánh
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {branch.Services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              </CardFooter>
            )}
        </Card>
      ))}
    </div>
  );
}

interface ServiceCardProps {
  service: ClinicService;
  formatPrice: (price: number) => string;
}

function ServiceCard({ service, formatPrice }: ServiceCardProps) {
  return (
    <div className="bg-white/10 rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{service.name}</h4>
        {service.isPopular && (
          <Badge className="bg-secondary/20 text-secondary">Phổ biến</Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {service.description}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-primary font-medium">
          <DollarSign className="h-4 w-4 mr-1" />
          {formatPrice(service.price)}
        </div>
        {service.duration && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Timer className="h-3 w-3 mr-1" />
            {service.duration} phút
          </div>
        )}
      </div>
    </div>
  );
}
