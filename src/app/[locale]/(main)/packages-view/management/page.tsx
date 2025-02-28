"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, ChevronRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradientButton } from "@/components/ui/gradient-button";

export default function PackageManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active");
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Mock data - would be fetched from API in real implementation
  const packages = [
    {
      id: "PKG001",
      name: "Premium Facial Treatment Package",
      clinic: "Beauty Clinic Saigon",
      clinicAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      totalSessions: 5,
      completedSessions: 3,
      remainingSessions: 2,
      status: "active",
      nextAppointment: {
        date: "25/08/2023",
        time: "15:00",
        status: "confirmed",
      },
      appointments: [
        {
          id: "APT001",
          date: "15/05/2023",
          time: "14:00",
          status: "completed",
          notes:
            "Đã hoàn thành buổi điều trị đầu tiên. Khách hàng hài lòng với kết quả.",
        },
        {
          id: "APT002",
          date: "01/06/2023",
          time: "15:30",
          status: "completed",
          notes: "Buổi điều trị thứ hai. Da mặt đã có sự cải thiện rõ rệt.",
        },
        {
          id: "APT003",
          date: "20/06/2023",
          time: "16:00",
          status: "completed",
          notes: "Buổi điều trị thứ ba. Tiếp tục thấy kết quả tích cực.",
        },
        {
          id: "APT004",
          date: "25/08/2023",
          time: "15:00",
          status: "confirmed",
          notes: "Buổi điều trị thứ tư.",
        },
        {
          id: "APT005",
          date: "",
          time: "",
          status: "pending",
          notes: "Buổi điều trị cuối cùng.",
        },
      ],
    },
    {
      id: "PKG002",
      name: "Advanced Skin Rejuvenation",
      clinic: "Glow Spa Center",
      clinicAddress: "456 Lê Lợi, Quận 1, TP.HCM",
      totalSessions: 3,
      completedSessions: 0,
      remainingSessions: 3,
      status: "upcoming",
      nextAppointment: {
        date: "30/08/2023",
        time: "10:00",
        status: "confirmed",
      },
      appointments: [
        {
          id: "APT006",
          date: "30/08/2023",
          time: "10:00",
          status: "confirmed",
          notes: "Buổi điều trị đầu tiên.",
        },
        {
          id: "APT007",
          date: "",
          time: "",
          status: "pending",
          notes: "Buổi điều trị thứ hai.",
        },
        {
          id: "APT008",
          date: "",
          time: "",
          status: "pending",
          notes: "Buổi điều trị cuối cùng.",
        },
      ],
    },
    {
      id: "PKG003",
      name: "Hair Removal Package",
      clinic: "Beauty Clinic Saigon",
      clinicAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      totalSessions: 4,
      completedSessions: 4,
      remainingSessions: 0,
      status: "completed",
      nextAppointment: null,
      appointments: [
        {
          id: "APT009",
          date: "10/03/2023",
          time: "09:00",
          status: "completed",
          notes: "Buổi điều trị đầu tiên. Khách hàng hài lòng với kết quả.",
        },
        {
          id: "APT010",
          date: "25/03/2023",
          time: "09:30",
          status: "completed",
          notes: "Buổi điều trị thứ hai.",
        },
        {
          id: "APT011",
          date: "10/04/2023",
          time: "10:00",
          status: "completed",
          notes: "Buổi điều trị thứ ba.",
        },
        {
          id: "APT012",
          date: "25/04/2023",
          time: "09:00",
          status: "completed",
          notes: "Buổi điều trị cuối cùng. Hoàn thành gói dịch vụ.",
        },
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Hoàn thành
          </Badge>
        );
      case "confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Đã xác nhận
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Chưa đặt lịch
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getPackageStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Đang điều trị
          </Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Sắp tới
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Hoàn thành
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    if (activeTab === "all") return true;
    return pkg.status === activeTab;
  });

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment);
    setRescheduleDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="sticky top-0 z-10 bg-rose-50/80 dark:bg-gray-900/80 backdrop-blur-sm pt-4 pb-2">
        <div className="container flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Quản lý gói dịch vụ</h1>
        </div>
      </div>

      <div className="container pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="active">Đang điều trị</TabsTrigger>
            <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="space-y-4">
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className="overflow-hidden border-primary/10 dark:bg-gray-800/50"
                  >
                    <CardContent className="p-0">
                      <Link
                        href={`/packages/management/${pkg.id}`}
                        className="block"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{pkg.name}</p>
                            {getPackageStatusBadge(pkg.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pkg.clinic}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{pkg.clinicAddress}</span>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {pkg.completedSessions}/{pkg.totalSessions}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Buổi đã hoàn thành
                                </p>
                                <p className="text-xs font-medium">
                                  {pkg.remainingSessions} buổi còn lại
                                </p>
                              </div>
                            </div>

                            {pkg.nextAppointment && (
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  Lịch hẹn tiếp theo
                                </p>
                                <div className="flex items-center gap-1 justify-end">
                                  <Calendar className="h-3 w-3 text-primary" />
                                  <p className="text-xs font-medium">
                                    {pkg.nextAppointment.date}{" "}
                                    {pkg.nextAppointment.time}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="bg-muted px-4 py-2 flex items-center justify-between">
                          <p className="text-sm">Xem chi tiết</p>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Không tìm thấy gói dịch vụ nào
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <div className="space-y-4">
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className="overflow-hidden border-primary/10 dark:bg-gray-800/50"
                  >
                    <CardContent className="p-0">
                      <Link
                        href={`/packages/management/${pkg.id}`}
                        className="block"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{pkg.name}</p>
                            {getPackageStatusBadge(pkg.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pkg.clinic}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{pkg.clinicAddress}</span>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {pkg.completedSessions}/{pkg.totalSessions}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Buổi đã hoàn thành
                                </p>
                                <p className="text-xs font-medium">
                                  {pkg.remainingSessions} buổi còn lại
                                </p>
                              </div>
                            </div>

                            {pkg.nextAppointment && (
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  Lịch hẹn tiếp theo
                                </p>
                                <div className="flex items-center gap-1 justify-end">
                                  <Calendar className="h-3 w-3 text-primary" />
                                  <p className="text-xs font-medium">
                                    {pkg.nextAppointment.date}{" "}
                                    {pkg.nextAppointment.time}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="bg-muted px-4 py-2 flex items-center justify-between">
                          <p className="text-sm">Xem chi tiết</p>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Không tìm thấy gói dịch vụ nào
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <div className="space-y-4">
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className="overflow-hidden border-primary/10 dark:bg-gray-800/50"
                  >
                    <CardContent className="p-0">
                      <Link
                        href={`/packages/management/${pkg.id}`}
                        className="block"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{pkg.name}</p>
                            {getPackageStatusBadge(pkg.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pkg.clinic}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{pkg.clinicAddress}</span>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {pkg.completedSessions}/{pkg.totalSessions}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Buổi đã hoàn thành
                                </p>
                                <p className="text-xs font-medium">
                                  {pkg.remainingSessions} buổi còn lại
                                </p>
                              </div>
                            </div>

                            {pkg.nextAppointment && (
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  Lịch hẹn tiếp theo
                                </p>
                                <div className="flex items-center gap-1 justify-end">
                                  <Calendar className="h-3 w-3 text-primary" />
                                  <p className="text-xs font-medium">
                                    {pkg.nextAppointment.date}{" "}
                                    {pkg.nextAppointment.time}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="bg-muted px-4 py-2 flex items-center justify-between">
                          <p className="text-sm">Xem chi tiết</p>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Không tìm thấy gói dịch vụ nào
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog
          open={rescheduleDialogOpen}
          onOpenChange={setRescheduleDialogOpen}
        >
          <DialogContent className="border-primary/10 dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>Đổi lịch hẹn</DialogTitle>
              <DialogDescription>
                Chọn ngày và giờ mới cho lịch hẹn của bạn.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Chọn ngày</p>
                <Select defaultValue="2023-08-30">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn ngày" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-08-30">30/08/2023</SelectItem>
                    <SelectItem value="2023-08-31">31/08/2023</SelectItem>
                    <SelectItem value="2023-09-01">01/09/2023</SelectItem>
                    <SelectItem value="2023-09-02">02/09/2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Chọn giờ</p>
                <Select defaultValue="10:00">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRescheduleDialogOpen(false)}
              >
                Hủy
              </Button>
              <GradientButton onClick={() => setRescheduleDialogOpen(false)}>
                Xác nhận
              </GradientButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
