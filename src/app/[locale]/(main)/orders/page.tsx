"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function OrderHistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - would be fetched from API in real implementation
  const orders = [
    {
      id: "ORD001",
      packageName: "Premium Facial Treatment Package",
      clinic: "Beauty Clinic Saigon",
      date: "15/05/2023",
      price: 1800000,
      status: "completed",
    },
    {
      id: "ORD002",
      packageName: "Advanced Skin Rejuvenation",
      clinic: "Glow Spa Center",
      date: "22/06/2023",
      price: 2500000,
      status: "processing",
    },
    {
      id: "ORD003",
      packageName: "Hair Removal Package",
      clinic: "Beauty Clinic Saigon",
      date: "10/07/2023",
      price: 3200000,
      status: "pending",
    },
    {
      id: "ORD004",
      packageName: "Body Massage Therapy",
      clinic: "Wellness Center",
      date: "05/08/2023",
      price: 1200000,
      status: "cancelled",
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Hoàn thành
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Đang xử lý
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Chờ xác nhận
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

  const filteredOrders = orders.filter((order) => {
    if (activeTab !== "all" && order.status !== activeTab) return false;
    if (
      searchQuery &&
      !order.packageName.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="sticky top-0 z-10 bg-rose-50/80 dark:bg-gray-900/80 backdrop-blur-sm pt-4 pb-2">
        <div className="container flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Lịch sử đơn hàng</h1>
        </div>
      </div>

      <div className="container pb-6">
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm đơn hàng..."
              className="pl-8 border-primary/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
            <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
            <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="space-y-3">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="overflow-hidden border-primary/10 dark:bg-gray-800/50"
                  >
                    <CardContent className="p-0">
                      <Link href={`/orders/${order.id}`} className="block">
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{order.packageName}</p>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.clinic}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-sm text-muted-foreground">
                              {order.date}
                            </p>
                            <p className="font-bold text-primary">
                              {formatPrice(order.price)}
                            </p>
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
                    Không tìm thấy đơn hàng nào
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <div className="space-y-3">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="overflow-hidden border-primary/10 dark:bg-gray-800/50"
                  >
                    <CardContent className="p-0">
                      <Link href={`/orders/${order.id}`} className="block">
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{order.packageName}</p>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.clinic}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-sm text-muted-foreground">
                              {order.date}
                            </p>
                            <p className="font-bold text-primary">
                              {formatPrice(order.price)}
                            </p>
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
                    Không tìm thấy đơn hàng nào
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="processing" className="mt-4">
            <div className="space-y-3">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="overflow-hidden border-primary/10 dark:bg-gray-800/50"
                  >
                    <CardContent className="p-0">
                      <Link href={`/orders/${order.id}`} className="block">
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{order.packageName}</p>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.clinic}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-sm text-muted-foreground">
                              {order.date}
                            </p>
                            <p className="font-bold text-primary">
                              {formatPrice(order.price)}
                            </p>
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
                    Không tìm thấy đơn hàng nào
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <div className="space-y-3">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="overflow-hidden border-primary/10 dark:bg-gray-800/50"
                  >
                    <CardContent className="p-0">
                      <Link href={`/orders/${order.id}`} className="block">
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{order.packageName}</p>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.clinic}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-sm text-muted-foreground">
                              {order.date}
                            </p>
                            <p className="font-bold text-primary">
                              {formatPrice(order.price)}
                            </p>
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
                    Không tìm thấy đơn hàng nào
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
