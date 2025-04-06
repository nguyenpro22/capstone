"use client";

import { useEffect, useState } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ClinicItem } from "../clinic-item";
import { BookingData, Clinic } from "../../types/booking";
import { BookingService } from "../../utils/booking-service";

interface SelectClinicStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}

export function SelectClinicStep({
  bookingData,
  updateBookingData,
}: SelectClinicStepProps) {
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(
    bookingData.clinic?.id || null
  );
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);

  const { service } = bookingData;

  // Fetch clinics on component mount
  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true);
      try {
        if (
          "description" in service &&
          "procedures" in service &&
          "promotions" in service
        ) {
          const clinicsData = await BookingService.getClinicsByService(service);
          setClinics(clinicsData);
        } else {
          console.error("Service is not of type ServiceDetail");
        }
      } catch (error) {
        console.error("Error fetching clinics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, [service.id]);

  const handleClinicSelect = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    const selectedClinic =
      clinics.find((clinic) => clinic.id === clinicId) || null;
    updateBookingData({ clinic: selectedClinic });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Đang tải danh sách cơ sở...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Chọn cơ sở</h3>
        <p className="text-muted-foreground mb-4">
          Vui lòng chọn cơ sở bạn muốn thực hiện dịch vụ
        </p>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Danh sách</TabsTrigger>
            <TabsTrigger value="map">Bản đồ</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <RadioGroup
              value={selectedClinicId || ""}
              onValueChange={handleClinicSelect}
              className="space-y-3"
            >
              {clinics.map((clinic) => (
                <ClinicItem
                  key={clinic.id}
                  clinic={clinic}
                  isSelected={selectedClinicId === clinic.id}
                />
              ))}
            </RadioGroup>
          </TabsContent>
          <TabsContent value="map" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Bản đồ các cơ sở</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
