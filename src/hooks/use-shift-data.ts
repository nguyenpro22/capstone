"use client";

import { OrderStatus } from "@/features/booking/types";
import { DoctorWorkingSchedule } from "@/features/doctor/types";
import { IListResponse, IResCommon } from "@/lib/api";
import { useState, useEffect } from "react";

// Mock API function to fetch shift data based on the provided sample
// Simulate API delay
const fetchShiftData = async (): Promise<DoctorWorkingSchedule[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // This is the sample data provided by the user
  const mockApiResponse: IResCommon<IListResponse<DoctorWorkingSchedule>> = {
    value: {
      items: [
        {
          id: "a7c8594e-fc8f-48eb-b05a-8c99e8d8e1bc",
          startTime: "08:30:00",
          endTime: "11:30:00",
          date: "2025-04-21",
          doctorId: "a2b21279-5bbd-40c3-8981-6821c7f6b2ea",
          doctorName: "Trần Đình Thiên Tân dốt",
          clinicId: "c0b7058f-8e72-4dee-8742-0df6206d1843",
          workingSchedules: [
            {
              workingScheduleId: "0b3b62f5-7668-4e9e-8b44-ca493d0e2404",
              startTime: "08:30:00",
              endTime: "09:45:00",
              status: "Pending" as OrderStatus,
              stepIndex: "1",
              customerName: "Pham Nghi",
              customerId: "195d5849-981c-4daf-9840-140097d7a9f9",
              serviceId: "f222f1db-fe36-4682-b114-f6d2e031408c",
              serviceName: "Nâng mũi S Line",
              customerScheduleId: "782f6708-0d19-421c-a1d5-293bbc173b0d",
              currentProcedureName: "Cơ bản",
            },
            {
              workingScheduleId: "f0a8b1f2-d68a-4b77-a1b4-cf098dd3c24a",
              startTime: "10:00:00",
              endTime: "11:30:00",
              status: "Completed" as OrderStatus,
              stepIndex: "1",
              customerName: "Nguyễn Văn A",
              customerId: "3b4a9e0b-74d1-4286-a18d-b4f72f20c218",
              serviceId: "9a2fba0e-5db0-4979-9610-b5f3b810c760",
              serviceName: "Cấy tóc",
              customerScheduleId: "ec742db6-fb10-4f78-9ed3-b76faac2e397",
              currentProcedureName: "Thủ tục nâng cao",
            },
          ],
        },
        {
          id: "a7c8594e-fc8f-48eb-b05a-8c99e8d8e1bc",
          startTime: "11:30:00",
          endTime: "16:00:00",
          date: "2025-04-21",
          doctorId: "a2b21279-5bbd-40c3-8981-6821c7f6b2ea",
          doctorName: "Trần Đình Thiên Tân dốt",
          clinicId: "c0b7058f-8e72-4dee-8742-0df6206d1843",
          workingSchedules: [
            {
              workingScheduleId: "d8b93c87-0547-4601-b3c1-5a3504b7c582",
              startTime: "11:30:00",
              endTime: "12:30:00",
              status: "Confirmed" as OrderStatus,
              stepIndex: "2",
              customerName: "Lê Thị Bảo Ngọc",
              customerId: "0d8f83ca-63c7-45ad-8a62-2a08fe79a7f4",
              serviceId: "f823be84-d9ff-4695-9dff-234a671f94f8",
              serviceName: "Làm đẹp da",
              customerScheduleId: "d9b63450-4a56-4eaf-a0bc-71727e4d0b9a",
              currentProcedureName: "Chăm sóc da mặt",
            },
            {
              workingScheduleId: "bfa1d0d8-c6f4-4d9f-b3c4-6cfb0fd0394f",
              startTime: "12:30:00",
              endTime: "13:30:00",
              status: "Pending" as OrderStatus,
              stepIndex: "1",
              customerName: "Trần Thiên Anh",
              customerId: "f3208bfc-cf9c-42c4-b5f2-45f15de2d202",
              serviceId: "cf5bb83b-d54e-477b-bb60-b0608ab4a937",
              serviceName: "Chỉnh sửa môi",
              customerScheduleId: "fcbfd91e-6485-4755-8690-938b23a3e234",
              currentProcedureName: "Tiểu phẫu môi",
            },
            {
              workingScheduleId: "bf2a3f51-bfa7-4c16-9a89-46d33d4b3f72",
              startTime: "13:30:00",
              endTime: "14:30:00",
              status: "Completed" as OrderStatus,
              stepIndex: "4",
              customerName: "Nguyễn Thị Minh Tâm",
              customerId: "cd2e3171-58ed-492a-8c99-06c2b577f1ad",
              serviceId: "b283adbe-d601-44da-8b23-2337c0f1d79a",
              serviceName: "Chữa tàn nhang",
              customerScheduleId: "e83fc271-376a-419a-9417-f8327edfd2b5",
              currentProcedureName: "Điều trị chuyên sâu",
            },
          ],
        },
      ],
      pageIndex: 1,
      pageSize: 100,
      totalCount: 2,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isSuccess: true,
    isFailure: false,
    error: {
      code: "",
      message: "",
    },
  };

  // Generate more data for the calendar
  const today = new Date();
  const shifts: DoctorWorkingSchedule[] = [...mockApiResponse.value.items];

  // Generate additional shifts for the next 30 days
  for (let i = 0; i < 20; i++) {
    const shiftDate = new Date(today);
    shiftDate.setDate(today.getDate() + Math.floor(Math.random() * 30));

    const startHour = 8 + Math.floor(Math.random() * 10);
    const endHour = startHour + 1 + Math.floor(Math.random() * 4);

    const startTime = `${startHour.toString().padStart(2, "0")}:30:00`;
    const endTime = `${endHour.toString().padStart(2, "0")}:30:00`;

    const appointmentCount = Math.floor(Math.random() * 4) + 1;
    const workingSchedules = [];

    // Generate appointments for this shift
    let currentStartTime = startHour;
    for (let j = 0; j < appointmentCount; j++) {
      const appointmentStartTime = `${currentStartTime
        .toString()
        .padStart(2, "0")}:30:00`;
      currentStartTime += 1;
      const appointmentEndTime = `${currentStartTime
        .toString()
        .padStart(2, "0")}:30:00`;

      const status: OrderStatus = OrderStatus.PENDING;

      const services = [
        "Nâng mũi S Line",
        "Cấy tóc",
        "Làm đẹp da",
        "Chỉnh sửa môi",
        "Chữa tàn nhang",
      ];
      const serviceName = services[Math.floor(Math.random() * services.length)];

      const customers = [
        "Nguyễn Văn A",
        "Lê Thị B",
        "Trần C",
        "Phạm D",
        "Hoàng E",
      ];
      const customerName =
        customers[Math.floor(Math.random() * customers.length)];

      workingSchedules.push({
        workingScheduleId: `ws-${i}-${j}`,
        startTime: appointmentStartTime,
        endTime: appointmentEndTime,
        status,
        stepIndex: (Math.floor(Math.random() * 4) + 1).toString(),
        customerName,
        customerId: `cust-${i}-${j}`,
        serviceId: `serv-${i}-${j}`,
        serviceName,
        customerScheduleId: `cs-${i}-${j}`,
        currentProcedureName: "Thủ tục cơ bản",
      });
    }

    shifts.push({
      id: `shift-${i}`,
      startTime,
      endTime,
      date: format(shiftDate, "yyyy-MM-dd"),
      doctorId: "a2b21279-5bbd-40c3-8981-6821c7f6b2ea",
      doctorName: "Trần Đình Thiên Tân",
      clinicId: "c0b7058f-8e72-4dee-8742-0df6206d1843",
      workingSchedules,
    });
  }

  return shifts;
};

// Helper function to format date
function format(date: Date, formatStr: string): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return formatStr
    .replace("yyyy", year.toString())
    .replace("MM", month)
    .replace("dd", day);
}

export function useShiftData() {
  const [shifts, setShifts] = useState<DoctorWorkingSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadShifts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchShiftData();
        setShifts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch shift data")
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadShifts();
  }, []);

  return { shifts, isLoading, error };
}
