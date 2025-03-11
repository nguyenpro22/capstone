"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarIcon,
  MapPin,
  Phone,
  Mail,
  Star,
  User,
  CreditCard,
  Landmark,
  Wallet,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ============= MOCK DATA =============

// Mock service data dựa trên API response mẫu
const mockServiceData = {
  id: "756ee778-9838-4794-a772-5d3f85bd5c89",
  name: "Nâng mũi S-line",
  description:
    "Dịch vụ nâng mũi S-line giúp tạo dáng mũi cao, thon gọn, tự nhiên và hài hòa với gương mặt.",
  maxPrice: 30000000,
  minPrice: 10000000,
  discountPercent: "10.0",
  discountMaxPrice: 27000000,
  discountMinPrice: 9000000,
  coverImage: [
    {
      id: "2f313ce8-dd1b-4b45-8aae-786fdcccf3d3",
      index: 0,
      url: "https://res.cloudinary.com/dvadlh7ah/image/upload/v1741022064/s6zajofgowg7b0eothjd.png",
    },
  ],
  descriptionImage: [
    {
      id: "c9e5f6b1-415e-49da-a4db-ecf90f6af76e",
      index: 0,
      url: "https://res.cloudinary.com/dvadlh7ah/image/upload/v1741022065/ibb1jv72urqjfgz6hggf.png",
    },
  ],
  clinics: [
    {
      id: "c3f589fd-f064-4587-8fc6-a988d25dd82a",
      name: "Cơ sở Quận 1",
      email: "quan1@beautyclinic.com",
      address: "123 Nguy���n Huệ, Quận 1, TP.HCM",
      phoneNumber: "0846030001",
      profilePictureUrl:
        "https://res.cloudinary.com/dvadlh7ah/image/upload/v1741021998/qbkgfpj2gh1xxqlgg1rq.png",
      isParent: false,
      parentId: "3bfda221-8b3a-417c-a818-51dd6e0f7cbd",
    },
    {
      id: "c3f589fd-f064-4587-8fc6-a988d25dd83a",
      name: "Cơ sở Quận 3",
      email: "quan3@beautyclinic.com",
      address: "45 Võ Văn Tần, Quận 3, TP.HCM",
      phoneNumber: "0846030002",
      profilePictureUrl:
        "https://res.cloudinary.com/dvadlh7ah/image/upload/v1741021998/qbkgfpj2gh1xxqlgg1rq.png",
      isParent: false,
      parentId: "3bfda221-8b3a-417c-a818-51dd6e0f7cbd",
    },
    {
      id: "c3f589fd-f064-4587-8fc6-a988d25dd84a",
      name: "Cơ sở Quận 7",
      email: "quan7@beautyclinic.com",
      address: "1095 Nguyễn Thị Thập, Quận 7, TP.HCM",
      phoneNumber: "0846030003",
      profilePictureUrl:
        "https://res.cloudinary.com/dvadlh7ah/image/upload/v1741021998/qbkgfpj2gh1xxqlgg1rq.png",
      isParent: false,
      parentId: "3bfda221-8b3a-417c-a818-51dd6e0f7cbd",
    },
  ],
  category: {
    id: "11111111-1111-1111-1111-111111111112",
    name: "Nâng mũi",
    description: "Nhóm dịch vụ thẩm mỹ nâng mũi",
  },
  procedures: [
    {
      id: "a5eb49d7-e9a7-4e8b-a6e7-4f9fda800af3",
      name: "Khám và tư vấn",
      description: "Bác sĩ khám và tư vấn phương pháp phù hợp",
      stepIndex: 1,
      coverImage: [
        "https://res.cloudinary.com/dvadlh7ah/image/upload/v1741022250/qi3mkoale7vkuy44doyv.png",
      ],
      procedurePriceTypes: [
        {
          id: "e4c27c66-96d0-4c4b-b6cf-b1840cc33d5c",
          name: "Tư vấn cơ bản",
          price: 500000,
        },
        {
          id: "c10a8679-c996-4b0d-bc69-cc50a008a20a",
          name: "Tư vấn chuyên sâu",
          price: 1000000,
        },
      ],
    },
    {
      id: "a5eb49d7-e9a7-4e8b-a6e7-4f9fda800af4",
      name: "Phẫu thuật nâng mũi",
      description: "Thực hiện phẫu thuật nâng mũi theo phương pháp đã chọn",
      stepIndex: 2,
      coverImage: [
        "https://res.cloudinary.com/dvadlh7ah/image/upload/v1741022250/qi3mkoale7vkuy44doyv.png",
      ],
      procedurePriceTypes: [
        {
          id: "e4c27c66-96d0-4c4b-b6cf-b1840cc33d5d",
          name: "Sụn tự thân",
          price: 25000000,
        },
        {
          id: "c10a8679-c996-4b0d-bc69-cc50a008a20b",
          name: "Sụn nhân tạo",
          price: 15000000,
        },
        {
          id: "c10a8679-c996-4b0d-bc69-cc50a008a20c",
          name: "Sụn kết hợp",
          price: 20000000,
        },
      ],
    },
    {
      id: "a5eb49d7-e9a7-4e8b-a6e7-4f9fda800af5",
      name: "Tái khám và chăm sóc hậu phẫu",
      description: "Tái khám và hướng dẫn chăm sóc sau phẫu thuật",
      stepIndex: 3,
      coverImage: [
        "https://res.cloudinary.com/dvadlh7ah/image/upload/v1741022250/qi3mkoale7vkuy44doyv.png",
      ],
      procedurePriceTypes: [
        {
          id: "e4c27c66-96d0-4c4b-b6cf-b1840cc33d5e",
          name: "Gói cơ bản",
          price: 2000000,
        },
        {
          id: "c10a8679-c996-4b0d-bc69-cc50a008a20d",
          name: "Gói VIP",
          price: 5000000,
        },
      ],
    },
  ],
  promotions: null,
  doctorServices: [
    {
      id: "00000000-0000-0000-0000-000000000001",
      serviceId: "756ee778-9838-4794-a772-5d3f85bd5c89",
      doctor: {
        id: "8bd93d0c-6a75-42e7-a785-08dd51880fb1",
        fullName: "TS.BS Nguyễn Văn A",
        email: "nguyenvana@beautyclinic.com",
        phoneNumber: "0901234567",
        profilePictureUrl: null,
        doctorCertificates: [
          "Chứng chỉ phẫu thuật thẩm mỹ",
          "Chứng nhận bác sĩ thẩm mỹ quốc tế",
        ],
      },
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      serviceId: "756ee778-9838-4794-a772-5d3f85bd5c89",
      doctor: {
        id: "8bd93d0c-6a75-42e7-a785-08dd51880fb2",
        fullName: "PGS.TS Trần Thị B",
        email: "tranthib@beautyclinic.com",
        phoneNumber: "0912345678",
        profilePictureUrl: null,
        doctorCertificates: [
          "Chứng chỉ phẫu thuật tạo hình",
          "Thành viên hiệp hội thẩm mỹ Châu Á",
        ],
      },
    },
    {
      id: "00000000-0000-0000-0000-000000000003",
      serviceId: "756ee778-9838-4794-a772-5d3f85bd5c89",
      doctor: {
        id: "8bd93d0c-6a75-42e7-a785-08dd51880fb3",
        fullName: "BS.CKI Lê Văn C",
        email: "levanc@beautyclinic.com",
        phoneNumber: "0923456789",
        profilePictureUrl: null,
        doctorCertificates: ["Chuyên khoa I Phẫu thuật tạo hình thẩm mỹ"],
      },
    },
  ],
};

// ============= MOCK SERVICE FUNCTIONS =============

// Mock service functions
const mockServiceFunctions = {
  // Lấy thông tin dịch vụ
  getServiceById: async (id: string) => {
    // Giả lập delay của API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockServiceData;
  },

  // Lấy danh sách bác sĩ theo dịch vụ
  getDoctorsByServiceId: async (serviceId: string) => {
    // Giả lập delay của API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Trích xuất danh sách bác sĩ từ doctorServices
    return mockServiceData.doctorServices.map((ds) => ds.doctor);
  },

  // Lấy danh sách cơ sở theo dịch vụ
  getClinicsByServiceId: async (serviceId: string) => {
    // Giả lập delay của API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockServiceData.clinics;
  },

  // Lấy danh sách quy trình theo dịch vụ
  getProceduresByServiceId: async (serviceId: string) => {
    // Giả lập delay của API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockServiceData.procedures;
  },

  // Gửi yêu cầu đặt lịch
  submitBooking: async (bookingData: any) => {
    // Giả lập delay của API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Giả lập tạo booking ID
    const bookingId = `BK-${Math.floor(Math.random() * 1000000)}`;

    return {
      success: true,
      bookingId,
    };
  },

  // Lấy khung giờ trống theo ngày và bác sĩ
  getAvailableTimeSlots: async (doctorId: string, date: Date) => {
    // Giả lập delay của API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Giả lập danh sách khung giờ trống
    const allTimeSlots = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
    ];

    // Ngẫu nhiên loại bỏ một số khung giờ để giả lập khung giờ đã được đặt
    const unavailableCount = Math.floor(Math.random() * 5); // 0-4 khung giờ không khả dụng
    const unavailableSlots = new Set();

    for (let i = 0; i < unavailableCount; i++) {
      const randomIndex = Math.floor(Math.random() * allTimeSlots.length);
      unavailableSlots.add(allTimeSlots[randomIndex]);
    }

    return allTimeSlots.filter((slot) => !unavailableSlots.has(slot));
  },
};

// ============= TYPE DEFINITIONS =============

// Type definitions
export interface ServiceImage {
  id: string;
  index: number;
  url: string;
}

export interface Clinic {
  id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  profilePictureUrl: string | null;
  isParent: boolean;
  parentId: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface ProcedurePriceType {
  id: string;
  name: string;
  price: number;
}

export interface Procedure {
  id: string;
  name: string;
  description: string;
  stepIndex: number;
  coverImage: string[];
  procedurePriceTypes: ProcedurePriceType[];
}

export interface Doctor {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string | null;
  doctorCertificates: string[] | any[];
}

export interface DoctorService {
  id: string;
  serviceId: string;
  doctor: Doctor;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  maxPrice: number;
  minPrice: number;
  discountPercent: string;
  discountMaxPrice: number;
  discountMinPrice: number;
  coverImage: ServiceImage[];
  descriptionImage: ServiceImage[];
  clinics: Clinic[];
  category: Category;
  procedures: Procedure[];
  promotions: any | null;
  doctorServices: DoctorService[];
}

export interface BookingData {
  service: Service;
  doctor: Doctor | null;
  clinic: Clinic | null;
  date: Date | null;
  time: string | null;
  selectedProcedures: {
    procedure: Procedure;
    priceTypeId: string;
  }[];
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    notes: string;
  };
  paymentMethod: "cash" | "credit_card" | "bank_transfer" | null;
}

// ============= BOOKING FLOW COMPONENTS =============

// SelectDoctorStep Component
function SelectDoctorStep({
  bookingData,
  updateBookingData,
}: {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}) {
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
        // Trong trường hợp thực tế, đây sẽ là API call
        const doctorsData = await mockServiceFunctions.getDoctorsByServiceId(
          service.id
        );
        const clinicsData = await mockServiceFunctions.getClinicsByServiceId(
          service.id
        );

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

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

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
            <div key={doctor.id} className="flex">
              <RadioGroupItem
                value={doctor.id}
                id={`doctor-${doctor.id}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`doctor-${doctor.id}`}
                className="flex flex-1 items-start cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="flex w-full gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={doctor.profilePictureUrl || undefined}
                      alt={doctor.fullName}
                    />
                    <AvatarFallback>
                      {getInitials(doctor.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{doctor.fullName}</div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm">4.9</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Chuyên gia {service.category.name}
                    </div>
                    {doctor.doctorCertificates &&
                      doctor.doctorCertificates.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Array.isArray(doctor.doctorCertificates) &&
                            doctor.doctorCertificates
                              .slice(0, 2)
                              .map((cert, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {typeof cert === "string" ? cert : cert.name}
                                </Badge>
                              ))}
                          {doctor.doctorCertificates.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{doctor.doctorCertificates.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </Label>
            </div>
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
                <div key={clinic.id} className="flex">
                  <RadioGroupItem
                    value={clinic.id}
                    id={`clinic-${clinic.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`clinic-${clinic.id}`}
                    className="flex flex-1 items-start cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="flex w-full gap-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <img
                          src={
                            clinic.profilePictureUrl ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          alt={clinic.name}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{clinic.name}</div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {clinic.address}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {clinic.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
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

// SelectDateTimeStep Component
function SelectDateTimeStep({
  bookingData,
  updateBookingData,
}: {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    bookingData.date || undefined
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(
    bookingData.time || null
  );
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { doctor } = bookingData;

  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (selectedDate && doctor) {
        setLoading(true);
        try {
          // Trong trường hợp thực tế, đây sẽ là API call
          const slots = await mockServiceFunctions.getAvailableTimeSlots(
            doctor.id,
            selectedDate
          );
          setAvailableTimeSlots(slots);
        } catch (error) {
          console.error("Error fetching time slots:", error);
          setAvailableTimeSlots([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTimeSlots();
  }, [selectedDate, doctor]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null); // Reset selected time when date changes

      // Chỉ cập nhật nếu ngày thực sự thay đổi
      if (!bookingData.date || date.getTime() !== bookingData.date.getTime()) {
        updateBookingData({ date, time: null });
      }
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);

    // Chỉ cập nhật nếu thời gian thực sự thay đổi
    if (time !== bookingData.time) {
      updateBookingData({ time });
    }
  };

  // Group time slots by period
  const groupTimeSlots = () => {
    const morning = availableTimeSlots.filter((time) => {
      const hour = Number.parseInt(time.split(":")[0]);
      return hour >= 8 && hour < 12;
    });

    const afternoon = availableTimeSlots.filter((time) => {
      const hour = Number.parseInt(time.split(":")[0]);
      return hour >= 12 && hour < 17;
    });

    const evening = availableTimeSlots.filter((time) => {
      const hour = Number.parseInt(time.split(":")[0]);
      return hour >= 17 && hour <= 20;
    });

    return { morning, afternoon, evening };
  };

  const timeSlotGroups = groupTimeSlots();

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Chọn ngày</h3>
        <p className="text-muted-foreground mb-4">
          Vui lòng chọn ngày bạn muốn thực hiện dịch vụ
        </p>

        <div className="bg-muted/30 p-4 rounded-lg">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              // Disable past dates and dates more than 30 days in the future
              const maxDate = new Date();
              maxDate.setDate(maxDate.getDate() + 30);

              return date < today || date > maxDate;
            }}
            className="rounded-md border bg-white shadow"
          />
        </div>
      </div>

      {selectedDate && (
        <div>
          <h3 className="text-lg font-medium mb-4">Chọn giờ</h3>
          <p className="text-muted-foreground mb-4">
            Các khung giờ có sẵn cho ngày {formatDate(selectedDate)}
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">
                Đang tải khung giờ trống...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {timeSlotGroups.morning.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Buổi sáng</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlotGroups.morning.map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          className="flex items-center justify-center"
                          onClick={() => handleTimeSelect(time)}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {timeSlotGroups.afternoon.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Buổi chiều</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlotGroups.afternoon.map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          className="flex items-center justify-center"
                          onClick={() => handleTimeSelect(time)}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {timeSlotGroups.evening.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Buổi tối</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlotGroups.evening.map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          className="flex items-center justify-center"
                          onClick={() => handleTimeSelect(time)}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {availableTimeSlots.length === 0 && (
                <div className="p-8 text-center bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">
                    Không có khung giờ trống cho ngày này. Vui lòng chọn ngày
                    khác.
                  </p>
                </div>
              )}
            </div>
          )}

          {selectedTime && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg">
              <p className="font-medium">Bạn đã chọn:</p>
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="mr-2">
                  {formatDate(selectedDate)}
                </Badge>
                <Badge>
                  <Clock className="h-3 w-3 mr-1" />
                  {selectedTime}
                </Badge>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// SelectProceduresStep Component
function SelectProceduresStep({
  bookingData,
  updateBookingData,
}: {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}) {
  const [selectedProcedures, setSelectedProcedures] = useState<
    {
      procedure: Procedure;
      priceTypeId: string;
    }[]
  >(bookingData.selectedProcedures || []);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(false);

  const { service } = bookingData;

  // Fetch procedures on component mount
  useEffect(() => {
    const fetchProcedures = async () => {
      setLoading(true);
      try {
        // Trong trường hợp thực tế, đây sẽ là API call
        const proceduresData =
          await mockServiceFunctions.getProceduresByServiceId(service.id);
        setProcedures(proceduresData);
      } catch (error) {
        console.error("Error fetching procedures:", error);
        setProcedures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, [service.id]);

  // Calculate total price
  const calculateTotalPrice = () => {
    return selectedProcedures.reduce((total, item) => {
      const priceType = item.procedure.procedurePriceTypes.find(
        (pt) => pt.id === item.priceTypeId
      );
      return total + (priceType?.price || 0);
    }, 0);
  };

  // Check if a procedure is selected
  const isProcedureSelected = (procedureId: string) => {
    return selectedProcedures.some((item) => item.procedure.id === procedureId);
  };

  // Get selected price type for a procedure
  const getSelectedPriceTypeId = (procedureId: string) => {
    const selected = selectedProcedures.find(
      (item) => item.procedure.id === procedureId
    );
    return selected?.priceTypeId || "";
  };

  // Handle procedure selection
  const handleProcedureToggle = (procedure: Procedure, checked: boolean) => {
    if (checked) {
      // Select the default (first) price type when selecting a procedure
      const defaultPriceTypeId = procedure.procedurePriceTypes[0]?.id || "";
      setSelectedProcedures([
        ...selectedProcedures,
        { procedure, priceTypeId: defaultPriceTypeId },
      ]);
    } else {
      setSelectedProcedures(
        selectedProcedures.filter((item) => item.procedure.id !== procedure.id)
      );
    }
  };

  // Handle price type selection
  const handlePriceTypeChange = (procedureId: string, priceTypeId: string) => {
    setSelectedProcedures(
      selectedProcedures.map((item) =>
        item.procedure.id === procedureId ? { ...item, priceTypeId } : item
      )
    );
  };

  // Update parent component when selections change
  useEffect(() => {
    if (
      selectedProcedures.length > 0 ||
      bookingData.selectedProcedures.length > 0
    ) {
      // Chỉ cập nhật nếu có sự thay đổi thực sự
      if (
        JSON.stringify(selectedProcedures) !==
        JSON.stringify(bookingData.selectedProcedures)
      ) {
        updateBookingData({ selectedProcedures });
      }
    }
  }, [selectedProcedures]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Đang tải danh sách dịch vụ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Chọn dịch vụ</h3>
        <p className="text-muted-foreground mb-4">
          Vui lòng chọn các dịch vụ bạn muốn thực hiện
        </p>

        <div className="space-y-4">
          {procedures && procedures.length > 0 ? (
            procedures.map((procedure) => (
              <Card key={procedure.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 flex items-start gap-3">
                    <Checkbox
                      id={`procedure-${procedure.id}`}
                      checked={isProcedureSelected(procedure.id)}
                      onCheckedChange={(checked) =>
                        handleProcedureToggle(procedure, checked === true)
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`procedure-${procedure.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {procedure.name}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {procedure.description}
                      </p>

                      {procedure.coverImage &&
                        procedure.coverImage.length > 0 && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {procedure.coverImage
                              .slice(0, 2)
                              .map((imgUrl, index) => (
                                <div
                                  key={index}
                                  className="relative h-24 rounded-md overflow-hidden"
                                >
                                  <img
                                    src={
                                      imgUrl ||
                                      "/placeholder.svg?height=96&width=160"
                                    }
                                    alt={`${procedure.name} - Hình ảnh ${
                                      index + 1
                                    }`}
                                    className="object-cover h-full w-full"
                                  />
                                </div>
                              ))}
                          </div>
                        )}
                    </div>
                  </div>

                  {isProcedureSelected(procedure.id) && (
                    <div className="bg-muted/30 p-4 border-t">
                      <h4 className="text-sm font-medium mb-2">
                        Chọn loại dịch vụ:
                      </h4>
                      <RadioGroup
                        value={getSelectedPriceTypeId(procedure.id)}
                        onValueChange={(value) =>
                          handlePriceTypeChange(procedure.id, value)
                        }
                        className="space-y-2"
                      >
                        {procedure.procedurePriceTypes.map((priceType) => (
                          <div
                            key={priceType.id}
                            className="flex items-center justify-between space-x-2 rounded-md border p-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={priceType.id}
                                id={`price-${priceType.id}`}
                              />
                              <Label
                                htmlFor={`price-${priceType.id}`}
                                className="cursor-pointer"
                              >
                                {priceType.name}
                              </Label>
                            </div>
                            <div className="font-medium text-primary">
                              {priceType.price.toLocaleString("vi-VN")}đ
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">
              Không có thông tin quy trình chi tiết.
            </p>
          )}
        </div>
      </div>

      <Separator />

      <div className="bg-primary/5 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Tổng chi phí dự kiến</h3>
        <div className="space-y-2">
          {selectedProcedures.map((item) => {
            const priceType = item.procedure.procedurePriceTypes.find(
              (pt) => pt.id === item.priceTypeId
            );
            return (
              <div
                key={`${item.procedure.id}-${item.priceTypeId}`}
                className="flex justify-between"
              >
                <div>
                  <span>{item.procedure.name}</span>
                  {priceType && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {priceType.name}
                    </Badge>
                  )}
                </div>
                <div>{(priceType?.price || 0).toLocaleString("vi-VN")}đ</div>
              </div>
            );
          })}

          <Separator />

          <div className="flex justify-between font-bold">
            <div>Tổng cộng</div>
            <div className="text-primary">
              {calculateTotalPrice().toLocaleString("vi-VN")}đ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// BookingSummary Component
function BookingSummary({
  bookingData,
  updateBookingData,
}: {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}) {
  const {
    service,
    doctor,
    clinic,
    date,
    time,
    selectedProcedures,
    customerInfo,
  } = bookingData;

  // Calculate total price
  const calculateTotalPrice = () => {
    return selectedProcedures.reduce((total, item) => {
      const priceType = item.procedure.procedurePriceTypes.find(
        (pt) => pt.id === item.priceTypeId
      );
      return total + (priceType?.price || 0);
    }, 0);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Handle customer info changes
  const handleCustomerInfoChange = (
    field: keyof typeof customerInfo,
    value: string
  ) => {
    updateBookingData({
      customerInfo: {
        ...customerInfo,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Thông tin đặt lịch</h3>
        <p className="text-muted-foreground mb-4">
          Vui lòng kiểm tra lại thông tin đặt lịch của bạn
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Thông tin dịch vụ</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dịch vụ:</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Danh mục:</span>
                  <Badge variant="outline">{service.category.name}</Badge>
                </div>
                <Separator className="my-2" />
                <div>
                  <h5 className="text-sm font-medium mb-2">
                    Các quy trình đã chọn:
                  </h5>
                  <div className="space-y-2">
                    {selectedProcedures.map((item) => {
                      const priceType = item.procedure.procedurePriceTypes.find(
                        (pt) => pt.id === item.priceTypeId
                      );
                      return (
                        <div
                          key={`${item.procedure.id}-${item.priceTypeId}`}
                          className="flex justify-between text-sm"
                        >
                          <div>
                            <span>{item.procedure.name}</span>
                            {priceType && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {priceType.name}
                              </Badge>
                            )}
                          </div>
                          <div>
                            {(priceType?.price || 0).toLocaleString("vi-VN")}đ
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">
                    {calculateTotalPrice().toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Thông tin lịch hẹn</h4>
              <div className="space-y-3">
                {doctor && (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={doctor.profilePictureUrl || undefined}
                        alt={doctor.fullName}
                      />
                      <AvatarFallback>
                        {getInitials(doctor.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{doctor.fullName}</div>
                      <div className="text-xs text-muted-foreground">
                        Bác sĩ thực hiện
                      </div>
                    </div>
                  </div>
                )}

                {date && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(date)}</span>
                  </div>
                )}

                {time && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{time}</span>
                  </div>
                )}

                {clinic && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <div>{clinic.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {clinic.address}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Thông tin khách hàng</h3>
        <p className="text-muted-foreground mb-4">
          Vui lòng cung cấp thông tin liên hệ của bạn
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Họ và tên <span className="text-destructive">*</span>
              </label>
              <div className="flex">
                <div className="bg-muted p-2 rounded-l-md border border-r-0 border-input">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="name"
                  placeholder="Nhập họ và tên"
                  value={customerInfo.name}
                  onChange={(e) =>
                    handleCustomerInfoChange("name", e.target.value)
                  }
                  className="rounded-l-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Số điện thoại <span className="text-destructive">*</span>
              </label>
              <div className="flex">
                <div className="bg-muted p-2 rounded-l-md border border-r-0 border-input">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="phone"
                  placeholder="Nhập số điện thoại"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    handleCustomerInfoChange("phone", e.target.value)
                  }
                  className="rounded-l-none"
                  required
                  type="tel"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="flex">
              <div className="bg-muted p-2 rounded-l-md border border-r-0 border-input">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="email"
                placeholder="Nhập email (không bắt buộc)"
                value={customerInfo.email}
                onChange={(e) =>
                  handleCustomerInfoChange("email", e.target.value)
                }
                className="rounded-l-none"
                type="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Ghi chú
            </label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt (không bắt buộc)"
              value={customerInfo.notes}
              onChange={(e) =>
                handleCustomerInfoChange("notes", e.target.value)
              }
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// PaymentStep Component
function PaymentStep({
  bookingData,
  updateBookingData,
}: {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}) {
  const { selectedProcedures, paymentMethod } = bookingData;

  // Calculate total price
  const calculateTotalPrice = () => {
    return selectedProcedures.reduce((total, item) => {
      const priceType = item.procedure.procedurePriceTypes.find(
        (pt) => pt.id === item.priceTypeId
      );
      return total + (priceType?.price || 0);
    }, 0);
  };

  const handlePaymentMethodChange = (
    method: "cash" | "credit_card" | "bank_transfer"
  ) => {
    updateBookingData({ paymentMethod: method });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>
        <p className="text-muted-foreground mb-4">
          Vui lòng chọn phương thức thanh toán
        </p>

        <RadioGroup
          value={paymentMethod || ""}
          onValueChange={(value) =>
            handlePaymentMethodChange(
              value as "cash" | "credit_card" | "bank_transfer"
            )
          }
          className="space-y-4"
        >
          <div className="flex">
            <RadioGroupItem
              value="cash"
              id="payment-cash"
              className="peer sr-only"
            />
            <Label
              htmlFor="payment-cash"
              className="flex flex-1 items-start cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex w-full gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Thanh toán tại cơ sở</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Thanh toán trực tiếp tại cơ sở khi đến thực hiện dịch vụ
                  </div>
                </div>
              </div>
            </Label>
          </div>

          <div className="flex">
            <RadioGroupItem
              value="credit_card"
              id="payment-credit-card"
              className="peer sr-only"
            />
            <Label
              htmlFor="payment-credit-card"
              className="flex flex-1 items-start cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex w-full gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Thẻ tín dụng/ghi nợ</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Thanh toán trực tuyến bằng thẻ tín dụng hoặc ghi nợ
                  </div>
                </div>
              </div>
            </Label>
          </div>

          <div className="flex">
            <RadioGroupItem
              value="bank_transfer"
              id="payment-bank-transfer"
              className="peer sr-only"
            />
            <Label
              htmlFor="payment-bank-transfer"
              className="flex flex-1 items-start cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex w-full gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Landmark className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Chuyển khoản ngân hàng</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Chuyển khoản trực tiếp đến tài khoản ngân hàng của chúng tôi
                  </div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {paymentMethod === "credit_card" && (
          <Card className="mt-4">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="card-number" className="text-sm font-medium">
                  Số thẻ
                </label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  className="font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="expiry" className="text-sm font-medium">
                    Ngày hết hạn
                  </label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cvc" className="text-sm font-medium">
                    CVC
                  </label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="name-on-card" className="text-sm font-medium">
                  Tên trên thẻ
                </label>
                <Input id="name-on-card" placeholder="NGUYEN VAN A" />
              </div>
            </CardContent>
          </Card>
        )}

        {paymentMethod === "bank_transfer" && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Thông tin chuyển khoản</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngân hàng:</span>
                  <span className="font-medium">Vietcombank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số tài khoản:</span>
                  <span className="font-mono font-medium">1234567890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chủ tài khoản:</span>
                  <span className="font-medium">CÔNG TY TNHH THẨM MỸ ABC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Nội dung chuyển khoản:
                  </span>
                  <span className="font-mono font-medium">
                    {bookingData.customerInfo.name} - {bookingData.service.name}
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                <p>
                  Vui lòng chuyển khoản trước khi đến thực hiện dịch vụ và giữ
                  lại biên lai chuyển khoản để đối chiếu.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Tóm tắt thanh toán</h3>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              {selectedProcedures.map((item) => {
                const priceType = item.procedure.procedurePriceTypes.find(
                  (pt) => pt.id === item.priceTypeId
                );
                return (
                  <div
                    key={`${item.procedure.id}-${item.priceTypeId}`}
                    className="flex justify-between"
                  >
                    <div>
                      <span>{item.procedure.name}</span>
                      {priceType && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {priceType.name}
                        </Badge>
                      )}
                    </div>
                    <div>
                      {(priceType?.price || 0).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                );
              })}

              <Separator className="my-2" />

              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{calculateTotalPrice().toLocaleString("vi-VN")}đ</span>
              </div>

              <div className="flex justify-between">
                <span>Thuế VAT (10%)</span>
                <span>
                  {Math.round(calculateTotalPrice() * 0.1).toLocaleString(
                    "vi-VN"
                  )}
                  đ
                </span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {Math.round(calculateTotalPrice() * 1.1).toLocaleString(
                    "vi-VN"
                  )}
                  đ
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-md flex items-start gap-2">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Đảm bảo hoàn tiền</p>
            <p className="text-sm mt-1">
              Nếu bạn không hài lòng với dịch vụ, chúng tôi cam kết hoàn tiền
              100% trong vòng 7 ngày.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// BookingConfirmation Component
function BookingConfirmation({
  bookingId,
  bookingData,
  onClose,
}: {
  bookingId: string;
  bookingData: BookingData;
  onClose: () => void;
}) {
  const {
    service,
    doctor,
    clinic,
    date,
    time,
    selectedProcedures,
    customerInfo,
  } = bookingData;

  // Calculate total price
  const calculateTotalPrice = () => {
    const subtotal = selectedProcedures.reduce((total, item) => {
      const priceType = item.procedure.procedurePriceTypes.find(
        (pt) => pt.id === item.priceTypeId
      );
      return total + (priceType?.price || 0);
    }, 0);

    return Math.round(subtotal * 1.1); // Including 10% VAT
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-8">
        <Card className="border-primary/10 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Đặt lịch thành công!</h2>
              <p className="text-muted-foreground">
                Cảm ơn bạn đã đặt lịch dịch vụ tại chúng tôi
              </p>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Mã đặt lịch</h3>
                <Badge variant="outline" className="font-mono">
                  {bookingId}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Vui lòng lưu lại mã đặt lịch này để tra cứu thông tin khi cần
                thiết
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Ngày hẹn</div>
                  <div className="text-sm text-muted-foreground">
                    {date ? formatDate(date) : "Chưa chọn ngày"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Giờ hẹn</div>
                  <div className="text-sm text-muted-foreground">
                    {time || "Chưa chọn giờ"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Địa điểm</div>
                  <div className="text-sm text-muted-foreground">
                    {clinic
                      ? `${clinic.name} - ${clinic.address}`
                      : "Chưa chọn cơ sở"}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 mb-6">
              <h3 className="font-medium">Chi tiết dịch vụ</h3>
              {selectedProcedures.map((item) => {
                const priceType = item.procedure.procedurePriceTypes.find(
                  (pt) => pt.id === item.priceTypeId
                );
                return (
                  <div
                    key={`${item.procedure.id}-${item.priceTypeId}`}
                    className="flex justify-between text-sm"
                  >
                    <div>
                      <span>{item.procedure.name}</span>
                      {priceType && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {priceType.name}
                        </Badge>
                      )}
                    </div>
                    <div>
                      {(priceType?.price || 0).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between font-medium pt-2">
                <span>Tổng cộng (đã bao gồm VAT)</span>
                <span className="text-primary">
                  {calculateTotalPrice().toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Họ và tên:</span>
                  <span className="ml-2">{customerInfo.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Số điện thoại:</span>
                  <span className="ml-2">{customerInfo.phone}</span>
                </div>
                {customerInfo.email && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="ml-2">{customerInfo.email}</span>
                  </div>
                )}
                {customerInfo.notes && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Ghi chú:</span>
                    <span className="ml-2">{customerInfo.notes}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Lưu thông tin
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Chia sẻ
              </Button>
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============= MAIN BOOKING FLOW COMPONENT =============

interface BookingFlowProps {
  service: Service;
  onClose: () => void;
}

export function BookingFlow({ service, onClose }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
    service,
    doctor: null,
    clinic: null,
    date: null,
    time: null,
    selectedProcedures: [],
    customerInfo: {
      name: "",
      phone: "",
      email: "",
      notes: "",
    },
    paymentMethod: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { title: "Chọn bác sĩ", component: SelectDoctorStep },
    { title: "Chọn thời gian", component: SelectDateTimeStep },
    { title: "Chọn dịch vụ", component: SelectProceduresStep },
    { title: "Xác nhận thông tin", component: BookingSummary },
    { title: "Thanh toán", component: PaymentStep },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const updateBookingData = (data: Partial<BookingData>) => {
    // Sử dụng functional update để tránh vòng lặp vô hạn
    setBookingData((prev) => {
      // Kiểm tra xem dữ liệu mới có khác với dữ liệu cũ không
      const newData = { ...prev, ...data };
      if (JSON.stringify(prev) === JSON.stringify(newData)) {
        return prev; // Không thay đổi state nếu dữ liệu không thay đổi
      }
      return newData;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Gọi mock service để gửi yêu cầu đặt lịch
      const result = await mockServiceFunctions.submitBooking(bookingData);

      if (result.success) {
        setBookingId(result.bookingId);
        setBookingComplete(true);
      } else {
        // Xử lý lỗi
        console.error("Booking failed");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if current step is valid and can proceed
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Doctor selection
        return bookingData.doctor !== null && bookingData.clinic !== null;
      case 1: // Date and time
        return bookingData.date !== null && bookingData.time !== null;
      case 2: // Procedures
        return bookingData.selectedProcedures.length > 0;
      case 3: // Summary
        return (
          bookingData.customerInfo.name.trim() !== "" &&
          bookingData.customerInfo.phone.trim() !== ""
        );
      case 4: // Payment
        return bookingData.paymentMethod !== null;
      default:
        return false;
    }
  };

  // Render booking confirmation if complete
  if (bookingComplete && bookingId) {
    return (
      <BookingConfirmation
        bookingId={bookingId}
        bookingData={bookingData}
        onClose={onClose}
      />
    );
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-3xl my-8">
        <Card className="border-primary/10 shadow-lg">
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-primary/5 p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Đặt lịch dịch vụ</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <span className="sr-only">Đóng</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Button>
              </div>

              {/* Progress steps */}
              <div className="flex justify-between mt-4">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-1"
                    style={{ width: `${100 / steps.length}%` }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index < currentStep
                          ? "bg-primary text-white"
                          : index === currentStep
                          ? "bg-primary/80 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div
                      className={`text-xs text-center ${
                        index <= currentStep
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 absolute w-[calc(${
                          100 / steps.length
                        }%-2rem)] ${
                          index < currentStep ? "bg-primary" : "bg-muted"
                        }`}
                        style={{
                          left: `calc(${(index * 100) / steps.length}% + 1rem)`,
                          top: "1.6rem",
                        }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step content */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                </div>
              ) : (
                <CurrentStepComponent
                  bookingData={bookingData}
                  updateBookingData={updateBookingData}
                />
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-muted/30 flex justify-between">
              {currentStep > 0 ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Quay lại
                </Button>
              ) : (
                <Button variant="outline" onClick={onClose}>
                  Hủy
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-1"
                >
                  Tiếp tục
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <GradientButton
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canProceed()}
                  className="flex items-center gap-1"
                >
                  {isSubmitting ? "Đang xử lý..." : "Hoàn tất đặt lịch"}
                </GradientButton>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
