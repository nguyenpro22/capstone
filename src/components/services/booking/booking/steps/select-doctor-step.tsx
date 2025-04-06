"use client";

import { useEffect, useState } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import type { BookingData, Clinic, Doctor } from "../../types/booking";
import { DoctorItem } from "../doctor-item";
import { ClinicItem } from "../clinic-item";
import { BookingService } from "../../utils/booking-service";

interface SelectDoctorStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}

export function SelectDoctorStep({
  bookingData,
  updateBookingData,
}: SelectDoctorStepProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(
    bookingData.doctor?.id || null
  );
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(
    bookingData.clinic?.id || null
  );
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);

  const { service } = bookingData;

  // Fetch doctors and clinics on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [doctorsData, clinicsData] = await Promise.all([
          BookingService.getDoctorsByService(service),
          BookingService.getClinicsByService(service),
        ]);

        setDoctors(doctorsData);
        setClinics(clinicsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [service.id]);

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    const selectedDoctor = doctors.find((doc) => doc.id === doctorId) || null;
    updateBookingData({ doctor: selectedDoctor });
  };

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
        <p className="text-muted-foreground">
          Đang tải danh sách bác sĩ và cơ sở...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Chọn bác sĩ</h3>
        <p className="text-muted-foreground mb-4">
          Vui lòng chọn bác sĩ bạn muốn thực hiện dịch vụ
        </p>

        <RadioGroup
          value={selectedDoctorId || ""}
          onValueChange={handleDoctorSelect}
          className="space-y-3"
        >
          {doctors.map((doctor) => (
            <DoctorItem
              key={doctor.id}
              doctor={doctor}
              serviceCategoryName={service.category.name}
              isSelected={selectedDoctorId === doctor.id}
            />
          ))}
        </RadioGroup>
      </div>

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
