"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Trash2,
  Plus,
  Save,
  Clock,
  CalendarDays,
  X,
  CalendarRange,
  Search,
  CalendarIcon,
  Info,
  AlertCircle,
  Users,
  UserCheck,
  Layers,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  format,
  isAfter,
  isBefore,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isEqual,
  parse,
  isValid,
} from "date-fns";
import { vi } from "date-fns/locale";
import { Switch } from "@/components/ui/switch";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";
import type { TimeSlot } from "@/features/working-schedule/types";
import {
  useCreateClinicSchedulesMutation,
  useGetWorkingScheduleQuery,
  useGetWorkingSchedulesByShiftGroupQuery,
} from "@/features/working-schedule/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WorkingScheduleDetailModal } from "@/components/clinicStaff/working-schedule/working-schedule-detail-modal";
import { useTranslations } from "next-intl";

// Thêm import cho các type lỗi từ RTK Query
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type {
  BasicErrorResponse,
  ErrorDetail,
  ErrorMutationResponse,
} from "@/lib/api";

// Updated WorkingSchedule interface with new fields but without status
interface WorkingSchedule {
  shiftGroupId: string;
  numberOfDoctors: string;
  numberOfCustomers: string;
  date: string;
  capacity: number;
  startTime?: string;
  endTime?: string;
  workingScheduleId?: string;
}

// Define a new type that extends WorkingSchedule to include optional doctorName
interface ExtendedWorkingSchedule extends WorkingSchedule {
  doctorName?: string;
  timeSlots?: TimeSlot[];
  error?: {
    field: string;
    message: string;
  };
}

export default function WorkingSchedulePage() {
  const t = useTranslations("workingSchedule");

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [schedules, setSchedules] = useState<ExtendedWorkingSchedule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [searchDate, setSearchDate] = useState("");
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("setup");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: { message: string; index: number; field: string };
  }>({});
  // State để lưu lỗi chung từ server
  const [serverError, setServerError] = useState<string | null>(null);

  // Pagination state for working schedules
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(110);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Add these new states inside your component
  const [selectedSchedule, setSelectedSchedule] =
    useState<WorkingSchedule | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Get the token and extract clinicId
  const token = getAccessToken();
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  const clinicId = tokenData?.clinicId || "";

  // API mutations và queries
  const [createClinicSchedules, { isLoading: isCreating }] =
    useCreateClinicSchedulesMutation();

  // Get working schedules - now used for both tabs
  const {
    data: workingSchedulesData,
    isLoading: isLoadingWorkingSchedules,
    error: workingSchedulesError,
  } = useGetWorkingScheduleQuery(
    {
      pageIndex,
      pageSize,
      searchTerm,
      sortColumn,
      sortOrder,
    },
    {
      skip: !clinicId,
    }
  );

  // Add this query to fetch schedule details
  const {
    data: scheduleDetailsData,
    isLoading: isLoadingScheduleDetails,
    error: scheduleDetailsError,
  } = useGetWorkingSchedulesByShiftGroupQuery(
    {
      shiftGroupId: selectedSchedule?.shiftGroupId || "",
      pageNumber: 1,
      pageSize: 100, // Get all items for this shift group
    },
    {
      skip: !selectedSchedule?.shiftGroupId || !isDetailModalOpen,
    }
  );

  // Refs cho các card ngày
  const dateCardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const timeSlotRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const configSectionRef = useRef<HTMLDivElement | null>(null);
  const scheduleListRef = useRef<HTMLDivElement | null>(null);

  // State cho tính năng chọn khoảng
  const [rangeMode, setRangeMode] = useState(false);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  // Vô hiệu hóa các ngày trong quá khứ
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const disabledDays = { before: today };

  // Add a new state to store original API data
  const [originalApiData, setOriginalApiData] = useState<any[]>([]);

  // Load dữ liệu lịch làm việc khi component được mount
  useEffect(() => {
    if (workingSchedulesData?.value?.items) {
      console.log("API data:", workingSchedulesData.value.items);

      // Chuyển đổi dữ liệu từ API thành state
      const workingDates = workingSchedulesData.value.items.map((item) => {
        // Chuyển đổi chuỗi ngày thành đối tượng Date
        const date = new Date(item.date);
        return date;
      });

      // Lọc ra các ngày duy nhất
      const uniqueDates = Array.from(
        new Set(workingDates.map((date) => date.toDateString()))
      ).map((dateStr) => new Date(dateStr));

      setSelectedDates(uniqueDates);

      // Nhóm các lịch làm việc theo ngày
      const schedulesByDate = workingSchedulesData.value.items.reduce(
        (acc, item) => {
          const dateKey = item.date;
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(item);
          return acc;
        },
        {} as Record<string, any[]>
      );

      // Tạo schedules từ dữ liệu API đã nhóm
      const newSchedules = Object.entries(schedulesByDate).map(
        ([dateKey, schedules]) => {
          // Tính tổng capacity cho ngày này
          const totalCapacity = schedules.reduce(
            (sum, schedule) => sum + (schedule.capacity || 0),
            0
          );

          // Tạo timeSlots từ các lịch làm việc - giữ nguyên tất cả các khung giờ
          const timeSlots = schedules.map((schedule) => ({
            startTime: formatTime(schedule.startTime),
            endTime: formatTime(schedule.endTime),
            capacity: schedule.capacity || 0,
          }));

          return {
            date: dateKey,
            capacity: totalCapacity, // Tổng capacity của tất cả lịch trong ngày
            timeSlots:
              timeSlots.length > 0
                ? timeSlots
                : [{ startTime: "08:00", endTime: "12:00", capacity: 10 }],
            // Include new fields with default values if they don't exist
            shiftGroupId: schedules[0]?.shiftGroupId || "",
            numberOfDoctors: schedules[0]?.numberOfDoctors || "0",
            numberOfCustomers: schedules[0]?.numberOfCustomers || "0",
          };
        }
      );

      setSchedules(newSchedules);

      // Lưu trữ dữ liệu gốc từ API để sử dụng khi chọn lại ngày
      setOriginalApiData(workingSchedulesData.value.items);
    }
  }, [workingSchedulesData]);

  // Xóa lỗi validation khi người dùng thay đổi dữ liệu
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
    // Xóa lỗi server khi người dùng thay đổi dữ liệu
    if (serverError) {
      setServerError(null);
    }
  }, [schedules]);

  // Cập nhật capacity cho ngày
  const updateDayCapacity = (date: string, capacity: number) => {
    setSchedules(
      schedules.map((schedule) => {
        if (schedule.date === date) {
          // Tính toán capacity cho mỗi timeSlot dựa trên tỷ lệ hiện tại
          const timeSlots = schedule.timeSlots || [];
          const totalSlotCapacity = timeSlots.reduce(
            (sum, slot) => sum + slot.capacity,
            0
          );

          // Nếu không có timeSlots hoặc tổng capacity là 0, phân bổ đều
          if (timeSlots.length === 0 || totalSlotCapacity === 0) {
            return {
              ...schedule,
              capacity,
              timeSlots:
                timeSlots.length > 0
                  ? timeSlots.map((slot) => ({
                      ...slot,
                      capacity: Math.floor(capacity / timeSlots.length),
                    }))
                  : [
                      {
                        startTime: "08:00",
                        endTime: "12:00",
                        capacity: capacity,
                      },
                    ],
            };
          }

          // Phân bổ capacity mới dựa trên tỷ lệ hiện tại
          const updatedTimeSlots = timeSlots.map((slot) => {
            const ratio = slot.capacity / totalSlotCapacity;
            return { ...slot, capacity: Math.floor(capacity * ratio) };
          });

          return { ...schedule, capacity, timeSlots: updatedTimeSlots };
        }
        return schedule;
      })
    );
  };

  // Xử lý khi chọn ngày từ lịch
  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) {
      if (!rangeMode) {
        setSelectedDates([]);
        setSchedules([]);
      }
      return;
    }

    // Nếu đang trong chế độ chọn khoảng
    if (rangeMode) {
      // Nếu chưa có ngày bắt đầu, đặt ngày bắt đầu
      if (!rangeStart && dates.length > 0) {
        setRangeStart(dates[dates.length - 1]);
        toast.success(
          `${t("dateFound", {
            date: format(dates[dates.length - 1], "yyyy-MM-dd"),
          })}`
        );
        return;
      }

      // Nếu đã có ngày bắt đầu và chọn ngày kết thúc
      if (rangeStart && dates.length > 0) {
        const endDate = dates[dates.length - 1];
        setRangeEnd(endDate);

        // Xác định ngày bắt đầu và kết thúc
        let start = rangeStart;
        let end = endDate;

        // Đảm bảo start <= end
        if (isAfter(start, end)) {
          [start, end] = [end, start];
        }

        // Lấy tất cả các ngày trong khoảng
        const datesInRange = eachDayOfInterval({ start, end });

        // Lọc ra các ngày không nằm trong quá khứ
        const validDates = datesInRange.filter(
          (date) => !isBefore(date, today)
        );

        // Cập nhật state
        setSelectedDates(validDates);
        updateSchedulesFromDates(validDates);

        toast.success(
          `Đã chọn khoảng ngày từ ${format(start, "yyyy-MM-dd")} đến ${format(
            end,
            "yyyy-MM-dd"
          )}`
        );

        // Reset state chọn khoảng
        setRangeStart(null);
        setRangeEnd(null);
        return;
      }
    } else {
      // Xử lý bình thường nếu không phải chọn khoảng
      // Tìm ngày mới được thêm vào hoặc bị xóa đi
      const addedDates = dates.filter(
        (date) =>
          !selectedDates.some((d) => d.toDateString() === date.toDateString())
      );

      const removedDates = selectedDates.filter(
        (date) => !dates.some((d) => d.toDateString() === date.toDateString())
      );

      // Cập nhật selectedDates
      setSelectedDates(dates);

      // Xử lý các ngày bị xóa
      if (removedDates.length > 0) {
        setSchedules(
          schedules.filter(
            (schedule) =>
              !removedDates.some(
                (date) => schedule.date === format(date, "yyyy-MM-dd")
              )
          )
        );
      }

      // Xử lý các ngày mới thêm
      if (addedDates.length > 0) {
        const newSchedules = addedDates.map((date) => {
          const formattedDate = format(date, "yyyy-MM-dd");

          // Kiểm tra xem ngày này có dữ liệu trong API gốc không
          const apiSchedules = originalApiData.filter(
            (item) => item.date === formattedDate
          );

          if (apiSchedules.length > 0) {
            // Nếu có dữ liệu từ API, sử dụng dữ liệu đó
            const timeSlots = apiSchedules.map((schedule) => ({
              startTime: formatTime(schedule.startTime),
              endTime: formatTime(schedule.endTime),
              capacity: schedule.capacity || 0,
            }));

            // Tính tổng capacity
            const totalCapacity = apiSchedules.reduce(
              (sum, schedule) => sum + (schedule.capacity || 0),
              0
            );

            return {
              date: formattedDate,
              capacity: totalCapacity,
              timeSlots: timeSlots,
              // Include new fields
              shiftGroupId: apiSchedules[0]?.shiftGroupId || "",
              numberOfDoctors: apiSchedules[0]?.numberOfDoctors || "0",
              numberOfCustomers: apiSchedules[0]?.numberOfCustomers || "0",
            };
          } else {
            // Nếu không có dữ liệu từ API, kiểm tra xem đã từng có trong schedules chưa
            const existingSchedule = schedules.find(
              (s) => s.date === formattedDate
            );

            // Nếu đã từng có, sử dụng lại dữ liệu cũ
            if (existingSchedule) {
              return existingSchedule;
            }

            // Nếu chưa từng có, tạo mới với giá trị mặc định
            return {
              date: formattedDate,
              capacity: 10, // Giá trị mặc định
              timeSlots: [
                { startTime: "08:00", endTime: "12:00", capacity: 10 },
              ],
              shiftGroupId: "",
              numberOfDoctors: "0",
              numberOfCustomers: "0",
            };
          }
        });

        setSchedules([...schedules, ...newSchedules]);
      }
    }
  };

  // Cập nhật schedules từ danh sách ngày
  const updateSchedulesFromDates = (dates: Date[]) => {
    // Tìm các ngày đã có trong schedules
    const existingDates = schedules.map((s) => s.date);

    // Tìm các ngày mới cần thêm vào
    const newDates = dates.filter(
      (date) => !existingDates.includes(format(date, "yyyy-MM-dd"))
    );

    // Tạo schedules mới cho các ngày mới
    const newSchedules = newDates.map((date) => {
      const formattedDate = format(date, "yyyy-MM-dd");

      // Kiểm tra xem ngày này có dữ liệu trong API gốc không
      const apiSchedules = originalApiData.filter(
        (item) => item.date === formattedDate
      );

      if (apiSchedules.length > 0) {
        // Nếu có dữ liệu từ API, sử dụng dữ liệu đó
        const timeSlots = apiSchedules.map((schedule) => ({
          startTime: formatTime(schedule.startTime),
          endTime: formatTime(schedule.endTime),
          capacity: schedule.capacity || 0,
        }));

        // Tính tổng capacity
        const totalCapacity = apiSchedules.reduce(
          (sum, schedule) => sum + (schedule.capacity || 0),
          0
        );

        return {
          date: formattedDate,
          capacity: totalCapacity,
          timeSlots: timeSlots,
          // Include new fields
          shiftGroupId: apiSchedules[0]?.shiftGroupId || "",
          numberOfDoctors: apiSchedules[0]?.numberOfDoctors || "0",
          numberOfCustomers: apiSchedules[0]?.numberOfCustomers || "0",
        };
      } else {
        // Nếu không có dữ liệu từ API, tạo mới với giá trị mặc định
        return {
          date: formattedDate,
          capacity: 10, // Giá trị mặc định
          timeSlots: [{ startTime: "08:00", endTime: "12:00", capacity: 10 }],
          shiftGroupId: "",
          numberOfDoctors: "0",
          numberOfCustomers: "0",
        };
      }
    });

    // Cập nhật state
    if (newSchedules.length > 0) {
      setSchedules([...schedules, ...newSchedules]);
    }
  };

  // Bật/tắt chế độ chọn khoảng
  const toggleRangeMode = () => {
    // Nếu đang bật chế độ chọn khoảng, reset state khi tắt
    if (rangeMode) {
      setRangeStart(null);
      setRangeEnd(null);
    }
    setRangeMode(!rangeMode);
  };

  // Chọn tất cả các ngày trong tháng hiện tại (trừ ngày trong quá khứ)
  const selectAllDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    // Đảm bảo không chọn ngày trong quá khứ
    const startDate = isAfter(today, start) ? today : start;

    // Lấy tất cả các ngày trong khoảng
    const datesInMonth = eachDayOfInterval({ start: startDate, end });

    // Tạo mảng mới kết hợp các ngày đã chọn và các ngày trong tháng
    const newSelectedDates = [...selectedDates];

    // Thêm các ngày mới vào mảng đã chọn (nếu chưa có)
    datesInMonth.forEach((date) => {
      if (!newSelectedDates.some((d) => isEqual(d, date))) {
        newSelectedDates.push(date);
      }
    });

    // Cập nhật state
    setSelectedDates(newSelectedDates);
    updateSchedulesFromDates(newSelectedDates);

    toast.success(
      `${t("selectAllInMonth")} ${format(currentMonth, "MM/yyyy")}`
    );
  };

  // Xóa tất cả các ngày đã chọn
  const clearAllSelectedDates = () => {
    setSelectedDates([]);
    setSchedules([]);

    toast.success(t("clearAllDates"));
  };

  // Tìm kiếm ngày
  const handleSearch = () => {
    // Kiểm tra định dạng ngày
    let searchedDate: Date;
    try {
      searchedDate = parse(searchDate, "yyyy-MM-dd", new Date());
      if (!isValid(searchedDate)) {
        throw new Error("Invalid date");
      }
    } catch (error) {
      toast.error(t("searchDateFormat"));
      return;
    }

    // Định dạng ngày để tìm kiếm trong schedules
    const formattedDate = format(searchedDate, "yyyy-MM-dd");

    // Tìm ngày trong danh sách schedules
    const foundSchedule = schedules.find(
      (schedule) => schedule.date === formattedDate
    );

    if (foundSchedule) {
      // Đánh dấu ngày được tìm thấy
      setHighlightedDate(formattedDate);

      // Cuộn đến ngày được tìm thấy
      setTimeout(() => {
        const element = dateCardRefs.current[formattedDate];
        if (element && scheduleListRef.current) {
          // Tính toán vị trí cuộn
          const containerRect = scheduleListRef.current.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const relativeTop = elementRect.top - containerRect.top;

          // Cuộn đến phần tử
          scheduleListRef.current.scrollTop =
            scheduleListRef.current.scrollTop + relativeTop - 20;

          // Xóa highlight sau 3 giây
          setTimeout(() => {
            setHighlightedDate(null);
          }, 3000);
        }
      }, 100);

      toast.success(t("dateFound", { date: formattedDate }));
    } else {
      toast.error(t("dateNotFound", { date: formattedDate }));
    }
  };

  // Hàm chuẩn hóa thời gian để đảm bảo định dạng đúng cho API
  const normalizeTimeFormat = (time: string): string => {
    if (!time || time === "--:--") {
      return "";
    }

    // Nếu thời gian đã có định dạng HH:MM:SS, trả về nguyên bản
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      return time;
    }

    // Nếu thời gian có định dạng HH:MM, thêm giây
    if (/^\d{2}:\d{2}$/.test(time)) {
      // Xử lý đặc biệt cho 12:00 (giữ nguyên là 12:00:00)
      if (time === "12:00") {
        return "12:00:00";
      }
      return `${time}:00`;
    }

    // Xử lý trường hợp có AM/PM
    if (
      time.toLowerCase().includes("am") ||
      time.toLowerCase().includes("pm")
    ) {
      // Tách giờ và phút
      const timePart = time.replace(/\s*[APap][Mm]\s*/, "");
      const isPM = time.toLowerCase().includes("pm");

      const [hourStr, minuteStr] = timePart.split(":");
      let hour = Number.parseInt(hourStr, 10);
      const minute = Number.parseInt(minuteStr || "0", 10);

      // Xử lý 12 AM -> 00:00:00
      if (hour === 12 && !isPM) {
        hour = 0;
      }
      // Xử lý 12 PM -> 12:00:00 (giữ nguyên)
      else if (hour === 12 && isPM) {
        // Giữ nguyên giờ 12
      }
      // Xử lý PM -> +12 giờ (trừ 12 PM)
      else if (isPM) {
        hour += 12;
      }

      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}:00`;
    }

    // Trả về định dạng mặc định nếu không khớp với bất kỳ mẫu nào
    return time;
  };

  // Phân tích mã lỗi từ API để xác định vị trí lỗi
  const parseErrorCode = (errorCode: string) => {
    // Mẫu: WorkingDates[5].StartTime
    const match = errorCode.match(/WorkingDates\[(\d+)\]\.(\w+)/);
    if (match) {
      return {
        index: Number.parseInt(match[1], 10),
        field: match[2].toLowerCase(),
      };
    }
    return null;
  };

  // Tìm ngày và khung giờ từ index lỗi
  const findScheduleFromErrorIndex = (
    index: number,
    apiFormattedSchedules: any[]
  ) => {
    if (index >= 0 && index < apiFormattedSchedules.length) {
      const errorItem = apiFormattedSchedules[index];
      return {
        date: errorItem.date,
        startTime: errorItem.startTime,
        endTime: errorItem.endTime,
        slotIndex: schedules.findIndex((s) => s.date === errorItem.date),
      };
    }
    return null;
  };

  // Cuộn đến vị trí lỗi
  const scrollToError = (date: string, field: string, slotIndex: number) => {
    const timeSlotKey = `${date}-${slotIndex}-${field}`;
    setTimeout(() => {
      // Đầu tiên cuộn đến ngày
      const dateElement = dateCardRefs.current[date];
      const scheduleListElement = scheduleListRef.current;

      if (dateElement && scheduleListElement) {
        // Tính toán vị trí cuộn
        const containerRect = scheduleListElement.getBoundingClientRect();
        const elementRect = dateElement.getBoundingClientRect();
        const relativeTop = elementRect.top - containerRect.top;

        // Cuộn đến phần tử
        scheduleListElement.scrollTop =
          scheduleListElement.scrollTop + relativeTop - 20;

        // Sau đó highlight trường lỗi
        const fieldElement = timeSlotRefs.current[timeSlotKey];
        if (fieldElement) {
          fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
          fieldElement.classList.add(
            "border-red-500",
            "ring-2",
            "ring-red-500"
          );
          setTimeout(() => {
            fieldElement.classList.remove(
              "border-red-500",
              "ring-2",
              "ring-red-500"
            );
          }, 5000);
        }
      }
    }, 100);
  };

  // Thêm hàm kiểm tra loại lỗi
  const isFetchBaseQueryError = (
    error: unknown
  ): error is FetchBaseQueryError => {
    return typeof error === "object" && error != null && "status" in error;
  };

  const isErrorWithMessage = (error: unknown): error is { message: string } => {
    return (
      typeof error === "object" &&
      error != null &&
      "message" in error &&
      typeof (error as any).message === "string"
    );
  };

  // Add a new state for unusual time warnings
  const [unusualTimeWarnings, setUnusualTimeWarnings] = useState<{
    [key: string]: { type: string; message: string };
  }>({});

  // Add a function to check for unusual working hours after the formatTime function
  const checkUnusualWorkingHours = (
    time: string,
    type: "start" | "end"
  ): { isUnusual: boolean; message: string } => {
    if (!time || time === "--:--") {
      return { isUnusual: false, message: "" };
    }

    // Extract hours from time string (format: HH:MM or HH:MM:SS)
    const hours = Number.parseInt(time.split(":")[0], 10);

    // Check for unusual start times (very early morning)
    if (type === "start" && hours >= 0 && hours < 6) {
      return {
        isUnusual: true,
        message: t("earlyStartWarning", { time }),
      };
    }

    // Check for unusual end times (very late night)
    if (type === "end" && hours >= 22) {
      return {
        isUnusual: true,
        message: t("lateEndWarning", { time }),
      };
    }

    // Check for long working hours (more than 12 hours)
    if (type === "end" && hours >= 12 + 12) {
      return {
        isUnusual: true,
        message: t("longHoursWarning"),
      };
    }

    return { isUnusual: false, message: "" };
  };

  // Modify the updateTimeSlot function to check for unusual hours
  const updateTimeSlot = (
    date: string,
    index: number,
    field: string,
    value: string | number
  ) => {
    // Check for unusual working hours if the field is startTime or endTime
    if (
      (field === "startTime" || field === "endTime") &&
      typeof value === "string"
    ) {
      const type = field === "startTime" ? "start" : "end";
      const { isUnusual, message } = checkUnusualWorkingHours(value, type);

      const warningKey = `${date}-${index}-${field}`;

      if (isUnusual) {
        // Set warning for this time slot
        setUnusualTimeWarnings((prev) => ({
          ...prev,
          [warningKey]: { type, message },
        }));
      } else {
        // Remove warning if it exists
        setUnusualTimeWarnings((prev) => {
          const newWarnings = { ...prev };
          delete newWarnings[warningKey];
          return newWarnings;
        });
      }
    }

    setSchedules(
      schedules.map((schedule) => {
        if (schedule.date === date && schedule.timeSlots) {
          const updatedTimeSlots = [...schedule.timeSlots];
          updatedTimeSlots[index] = {
            ...updatedTimeSlots[index],
            [field]: value,
          };

          // Nếu field là capacity, cập nhật tổng capacity của ngày
          if (field === "capacity") {
            const totalCapacity = updatedTimeSlots.reduce(
              (sum, slot) =>
                sum + (typeof slot.capacity === "number" ? slot.capacity : 0),
              0
            );
            return {
              ...schedule,
              timeSlots: updatedTimeSlots,
              capacity: totalCapacity,
            };
          }

          return { ...schedule, timeSlots: updatedTimeSlots };
        }
        return schedule;
      })
    );
  };

  // Add a function to dismiss warnings
  const dismissWarning = (warningKey: string) => {
    setUnusualTimeWarnings((prev) => {
      const newWarnings = { ...prev };
      delete newWarnings[warningKey];
      return newWarnings;
    });
  };

  // Update fields for the schedule
  const updateScheduleField = (
    date: string,
    field: string,
    value: string | number
  ) => {
    setSchedules(
      schedules.map((schedule) => {
        if (schedule.date === date) {
          return {
            ...schedule,
            [field]: value,
          };
        }
        return schedule;
      })
    );
  };

  // Cập nhật hàm handleSubmit để xử lý lỗi đúng cách
  const handleSubmit = async () => {
    if (schedules.length === 0) {
      toast.error(t("selectAtLeastOneDay"));
      return;
    }

    if (!clinicId) {
      toast.error(t("clinicIdNotFound"));
      return;
    }

    try {
      setIsSubmitting(true);
      // Xóa lỗi validation cũ
      setValidationErrors({});
      // Xóa lỗi server cũ
      setServerError(null);

      // Kiểm tra dữ liệu trước khi gửi
      let hasEmptyTimeSlot = false;
      const apiFormattedSchedules = schedules.flatMap(
        (schedule, scheduleIndex) => {
          // Nếu không có timeSlots hoặc mảng rỗng, tạo một khung giờ mặc định
          if (!schedule.timeSlots || schedule.timeSlots.length === 0) {
            return [
              {
                date: schedule.date,
                capacity: schedule.capacity,
                startTime: "08:00",
                endTime: "17:00",
                shiftGroupId: schedule.shiftGroupId,
                numberOfDoctors: schedule.numberOfDoctors,
                numberOfCustomers: schedule.numberOfCustomers,
              },
            ];
          }

          // Tạo một mục riêng biệt cho mỗi khung giờ
          return schedule.timeSlots.map((timeSlot, slotIndex) => {
            const normalizedStartTime = normalizeTimeFormat(timeSlot.startTime);
            const normalizedEndTime = normalizeTimeFormat(timeSlot.endTime);

            // Kiểm tra thời gian trống
            if (!normalizedStartTime || normalizedStartTime === ":00") {
              hasEmptyTimeSlot = true;
              toast.error(
                t("missingStartTime", {
                  date: schedule.date,
                  index: slotIndex + 1,
                })
              );
            }

            if (!normalizedEndTime || normalizedEndTime === ":00") {
              hasEmptyTimeSlot = true;
              toast.error(
                t("missingEndTime", {
                  date: schedule.date,
                  index: slotIndex + 1,
                })
              );
            }

            return {
              date: schedule.date,
              capacity: timeSlot.capacity, // Sử dụng capacity của từng khung giờ
              startTime: normalizedStartTime, // Chuẩn hóa định dạng thời gian
              endTime: normalizedEndTime, // Chuẩn hóa định dạng thời gian
              shiftGroupId: schedule.shiftGroupId,
              numberOfDoctors: schedule.numberOfDoctors,
              numberOfCustomers: schedule.numberOfCustomers,
            };
          });
        }
      );

      // Nếu có khung giờ trống, dừng lại
      if (hasEmptyTimeSlot) {
        setIsSubmitting(false);
        return;
      }

      console.log("Sending data to API:", apiFormattedSchedules);

      // Gọi API mutation để tạo lịch làm việc
      const response = await createClinicSchedules({
        workingDates: apiFormattedSchedules,
      });

      // Kiểm tra response để xác định thành công hay thất bại
      if (response.error) {
        // Xử lý lỗi từ RTK Query
        const error = response.error;

        // Kiểm tra loại lỗi và xử lý tương ứng
        if (isFetchBaseQueryError(error)) {
          const status = error.status as number;

          // Xử lý dựa trên status code
          if (status === 422 && error.data) {
            // Lỗi validation - có mảng errors
            const errorData = error.data as ErrorMutationResponse;

            if (errorData?.errors && Array.isArray(errorData.errors)) {
              // Tạo đối tượng lưu trữ lỗi
              const newValidationErrors: {
                [key: string]: {
                  message: string;
                  index: number;
                  field: string;
                };
              } = {};

              // Xử lý từng lỗi
              errorData.errors.forEach((err: ErrorDetail) => {
                if (err.code && err.message) {
                  const errorInfo = parseErrorCode(err.code);
                  if (errorInfo) {
                    const { index, field } = errorInfo;
                    const scheduleInfo = findScheduleFromErrorIndex(
                      index,
                      apiFormattedSchedules
                    );

                    if (scheduleInfo) {
                      const { date, slotIndex } = scheduleInfo;
                      const errorKey = `${date}-${field}`;

                      // Lưu thông tin lỗi
                      newValidationErrors[errorKey] = {
                        message: err.message,
                        index,
                        field,
                      };

                      // Hiển thị thông báo lỗi cụ thể
                      toast.error(
                        `Lỗi: Ngày ${date}, ${
                          field === "starttime"
                            ? t("startTime")
                            : field === "endtime"
                            ? t("endTime")
                            : field
                        } - ${err.message}`
                      );

                      // Cuộn đến vị trí lỗi
                      scrollToError(date, field, slotIndex);
                    } else {
                      // Nếu không tìm thấy thông tin lịch, hiển thị lỗi chung
                      toast.error(
                        `Lỗi: ${err.message} (Vị trí: ${index}, Trường: ${field})`
                      );
                    }
                  } else {
                    // Nếu không phân tích được mã lỗi, hiển thị lỗi chung
                    toast.error(`Lỗi: ${err.message}`);
                  }
                } else {
                  // Nếu không có mã lỗi hoặc thông báo, hiển thị lỗi chung
                  toast.error(`Lỗi: ${err.message || "Không xác định"}`);
                }
              });

              // Cập nhật state lỗi validation
              setValidationErrors(newValidationErrors);
            } else {
              // Hiển thị lỗi chung từ detail
              const errorMessage =
                errorData?.detail ||
                "Không thể cập nhật lịch làm việc. Vui lòng thử lại sau.";
              toast.error(errorMessage);
              setServerError(errorMessage);
            }
          } else if (status === 500 && error.data) {
            // Lỗi server - không có mảng errors
            const errorData = error.data as BasicErrorResponse;
            const errorMessage = errorData?.detail || t("errorLoading");
            toast.error(errorMessage);
            setServerError(errorMessage);
            console.error("Server error:", errorData);
          } else {
            // Các lỗi khác
            const errorMessage =
              typeof error.data === "object" &&
              error.data !== null &&
              "detail" in error.data
                ? (error.data as any).detail
                : "Không thể cập nhật lịch làm việc. Vui lòng thử lại sau.";
            toast.error(errorMessage);
            setServerError(errorMessage);
          }
        } else {
          // Xử lý SerializedError hoặc lỗi khác
          const errorMessage = isErrorWithMessage(error)
            ? error.message
            : "Không thể cập nhật lịch làm việc. Vui lòng thử lại sau.";
          toast.error(errorMessage);
          setServerError(errorMessage);
        }
      } else {
        // Chỉ hiển thị thông báo thành công khi không có lỗi
        toast.success(t("scheduleUpdated"));
      }
    } catch (error: any) {
      console.error("Error updating schedules:", error);

      // Xử lý lỗi chi tiết hơn
      if (error.status === 422 && error.data?.errors) {
        // Hiển thị lỗi validation
        error.data.errors.forEach((err: ErrorDetail) => {
          const errorInfo = parseErrorCode(err.code);
          if (errorInfo) {
            const { index, field } = errorInfo;
            toast.error(
              `Lỗi validation: ${err.message} (Vị trí: ${index}, Trường: ${field})`
            );
          } else {
            toast.error(`Lỗi validation: ${err.message}`);
          }
        });
      } else {
        // Lỗi khác
        const errorMessage =
          error.message ||
          "Không thể cập nhật lịch làm việc. Vui lòng thử lại sau.";
        toast.error(errorMessage);
        setServerError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sắp xếp lịch làm việc theo thứ tự ngày tháng
  const sortedSchedules = [...schedules].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  // Format time from string format
  const formatTime = (time: string | number | null | undefined): string => {
    if (!time) return "--:--";

    // If it's already a string in the format "HH:MM:SS"
    if (typeof time === "string") {
      // Extract hours and minutes from the time string
      const timeParts = time.split(":");
      if (timeParts.length >= 2) {
        // Xử lý hiển thị đặc biệt cho 24:00
        if (timeParts[0] === "24") {
          return "12:00"; // Hiển thị 24:00 như 12:00
        }
        // Xử lý hiển thị đặc biệt cho 12:00 (nếu là AM)
        if (timeParts[0] === "12" && timeParts[1] === "00") {
          // Giữ nguyên là 12:00
        }
        return `${timeParts[0]}:${timeParts[1]}`;
      }
      return time;
    }

    // If it's a number (legacy format)
    if (typeof time === "number") {
      const timeStr = time.toString().padStart(4, "0");
      return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
    }

    return "--:--";
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: string) => {
    setPageSize(Number.parseInt(newSize));
    setPageIndex(1); // Reset to first page when changing page size
  };

  // Handle sorting
  const handleSort = (column: string) => {
    // If clicking the same column, toggle sort order
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If clicking a new column, set it as sort column with ascending order
      setSortColumn(column);
      setSortOrder("asc");
    }
    // Reset to first page when changing sort
    setPageIndex(1);
  };

  // Function to add a new time slot
  const addTimeSlot = (date: string) => {
    // Thông báo cho người dùng biết về giới hạn của API
    toast.info(t("apiLimitWarning"));

    setSchedules(
      schedules.map((schedule) => {
        if (schedule.date === date) {
          const newTimeSlot = {
            startTime: "08:00",
            endTime: "12:00",
            capacity: 10,
          };
          const updatedTimeSlots = [...(schedule.timeSlots || []), newTimeSlot];

          // Tính toán lại tổng capacity
          const newTotalCapacity = updatedTimeSlots.reduce(
            (sum, slot) =>
              sum + (typeof slot.capacity === "number" ? slot.capacity : 0),
            0
          );

          return {
            ...schedule,
            timeSlots: updatedTimeSlots,
            capacity: newTotalCapacity, // Cập nhật tổng capacity
          };
        }
        return schedule;
      })
    );
  };

  // Function to remove a time slot
  const removeTimeSlot = (date: string, index: number) => {
    setSchedules(
      schedules.map((schedule) => {
        if (schedule.date === date && schedule.timeSlots) {
          const updatedTimeSlots = [...schedule.timeSlots];

          // Lấy capacity của khung giờ sẽ xóa
          const removedCapacity = updatedTimeSlots[index]?.capacity || 0;

          // Xóa khung giờ
          updatedTimeSlots.splice(index, 1);

          // Tính toán lại tổng capacity
          const newTotalCapacity = updatedTimeSlots.reduce(
            (sum, slot) =>
              sum + (typeof slot.capacity === "number" ? slot.capacity : 0),
            0
          );

          return {
            ...schedule,
            timeSlots: updatedTimeSlots,
            capacity: newTotalCapacity, // Cập nhật tổng capacity
          };
        }
        return schedule;
      })
    );
  };

  // Kiểm tra xem một trường có lỗi không
  const hasFieldError = (date: string, field: string) => {
    const errorKey = `${date}-${field.toLowerCase()}`;
    return !!validationErrors[errorKey];
  };

  // Lấy thông báo lỗi cho một trường
  const getFieldErrorMessage = (date: string, field: string) => {
    const errorKey = `${date}-${field.toLowerCase()}`;
    return validationErrors[errorKey]?.message || "";
  };

  // Add this function to handle row click
  const handleScheduleRowClick = (schedule: WorkingSchedule) => {
    setSelectedSchedule(schedule);
    setIsDetailModalOpen(true);
  };

  // Add this function to close the modal
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{t("pageTitle")}</h1>

      <Tabs defaultValue="setup" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="setup">{t("setupTabTitle")}</TabsTrigger>
          <TabsTrigger value="view">{t("viewTabTitle")}</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          {isLoadingWorkingSchedules ? (
            <div className="flex items-center justify-center h-40">
              <p>{t("loading")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("selectDates")}</CardTitle>
                    <CardDescription>
                      {t("selectDatesDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="select-none">
                      <Calendar
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={handleDateSelect}
                        className="rounded-md border"
                        locale={vi}
                        disabled={disabledDays}
                        onMonthChange={setCurrentMonth}
                      />
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      <Switch
                        id="range-mode"
                        checked={rangeMode}
                        onCheckedChange={toggleRangeMode}
                      />
                      <Label htmlFor="range-mode" className="cursor-pointer">
                        <div className="flex items-center">
                          <CalendarRange className="h-4 w-4 mr-2" />
                          {t("rangeMode")}
                        </div>
                      </Label>
                    </div>

                    {rangeMode && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        {!rangeStart
                          ? t("selectStartDate")
                          : t("selectEndDate")}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={selectAllDaysInMonth}
                      >
                        <CalendarDays className="h-4 w-4 mr-2" />
                        {t("selectAllInMonth")}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={clearAllSelectedDates}
                        disabled={selectedDates.length === 0}
                      >
                        <X className="h-4 w-4 mr-2" />
                        {t("clearAllDates")}
                      </Button>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor="search-date">{t("searchDate")}</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="search-date"
                          placeholder={t("searchDatePlaceholder")}
                          value={searchDate}
                          onChange={(e) => setSearchDate(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleSearch}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("searchDateFormat")}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      {t("totalSelectedDates", { count: selectedDates.length })}
                    </p>
                  </CardFooter>
                </Card>
                <div className="mt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting || isCreating || schedules.length === 0
                    }
                    className="w-full gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting || isCreating
                      ? t("saving")
                      : t("saveSchedule")}
                  </Button>
                </div>
              </div>

              <div className="space-y-6" ref={configSectionRef}>
                <Card className="h-full">
                  <CardHeader className="sticky top-0 bg-card z-10">
                    <CardTitle>{t("configTitle")}</CardTitle>
                    <CardDescription>{t("configDescription")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {serverError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{t("serverError")}</AlertTitle>
                        <AlertDescription>{serverError}</AlertDescription>
                      </Alert>
                    )}

                    {Object.keys(validationErrors).length > 0 && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{t("validationError")}</AlertTitle>
                        <AlertDescription>
                          {t("validationErrorDescription")}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div
                      className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2"
                      ref={scheduleListRef}
                    >
                      {sortedSchedules.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          {t("selectDatesDescription")}
                        </div>
                      ) : (
                        sortedSchedules.map((schedule) => (
                          <Card
                            key={schedule.date}
                            className={`border ${
                              highlightedDate === schedule.date
                                ? "border-primary border-2 shadow-lg"
                                : "border-muted"
                            } transition-all duration-300`}
                            ref={(el) => {
                              dateCardRefs.current[schedule.date] = el;
                            }}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                {format(
                                  new Date(schedule.date),
                                  "EEEE, yyyy-MM-dd",
                                  {
                                    locale: vi,
                                  }
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="flex items-center gap-1">
                                    <Label
                                      htmlFor={`capacity-${schedule.date}`}
                                    >
                                      {t("totalDoctorsPerDay")}
                                    </Label>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{t("doctorsTooltip")}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <Input
                                    id={`capacity-${schedule.date}`}
                                    type="number"
                                    min="1"
                                    value={schedule.capacity}
                                    onChange={(e) =>
                                      updateDayCapacity(
                                        schedule.date,
                                        Number.parseInt(e.target.value) || 0
                                      )
                                    }
                                    className={`mt-1 ${
                                      hasFieldError(schedule.date, "capacity")
                                        ? "border-red-500 ring-2 ring-red-500"
                                        : ""
                                    }`}
                                  />
                                  {hasFieldError(schedule.date, "capacity") && (
                                    <p className="text-xs text-red-500 mt-1">
                                      {getFieldErrorMessage(
                                        schedule.date,
                                        "capacity"
                                      )}
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {t("doctorsTooltip")}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <Label>{t("workingHours")}</Label>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addTimeSlot(schedule.date)}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />{" "}
                                    {t("addTimeSlot")}
                                  </Button>
                                </div>

                                {schedule.timeSlots &&
                                schedule.timeSlots.length > 0 ? (
                                  <div className="space-y-3">
                                    {schedule.timeSlots.map((slot, index) => (
                                      <div
                                        key={index}
                                        className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end border p-3 rounded-md"
                                      >
                                        <div>
                                          <Label
                                            htmlFor={`start-${schedule.date}-${index}`}
                                          >
                                            {t("startTime")}
                                          </Label>
                                          <div className="flex items-center mt-1">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <div
                                              ref={(el) => {
                                                timeSlotRefs.current[
                                                  `${schedule.date}-${index}-starttime`
                                                ] = el;
                                              }}
                                              className="w-full"
                                            >
                                              <Input
                                                id={`start-${schedule.date}-${index}`}
                                                type="time"
                                                value={slot.startTime}
                                                onChange={(e) =>
                                                  updateTimeSlot(
                                                    schedule.date,
                                                    index,
                                                    "startTime",
                                                    e.target.value
                                                  )
                                                }
                                                className={
                                                  hasFieldError(
                                                    schedule.date,
                                                    "starttime"
                                                  )
                                                    ? "border-red-500"
                                                    : ""
                                                }
                                              />
                                              {unusualTimeWarnings[
                                                `${schedule.date}-${index}-startTime`
                                              ] && (
                                                <Alert className="mt-2 py-2">
                                                  <AlertCircle className="h-4 w-4" />
                                                  <AlertTitle className="text-xs">
                                                    {t("unusualTimeWarning")}
                                                  </AlertTitle>
                                                  <AlertDescription className="text-xs">
                                                    {
                                                      unusualTimeWarnings[
                                                        `${schedule.date}-${index}-startTime`
                                                      ].message
                                                    }
                                                    <Button
                                                      variant="outline"
                                                      size="sm"
                                                      className="ml-2 h-6 px-2 text-xs"
                                                      onClick={() =>
                                                        dismissWarning(
                                                          `${schedule.date}-${index}-startTime`
                                                        )
                                                      }
                                                    >
                                                      {t("confirm")}
                                                    </Button>
                                                  </AlertDescription>
                                                </Alert>
                                              )}
                                              {hasFieldError(
                                                schedule.date,
                                                "starttime"
                                              ) && (
                                                <p className="text-xs text-red-500 mt-1">
                                                  {getFieldErrorMessage(
                                                    schedule.date,
                                                    "starttime"
                                                  )}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <Label
                                            htmlFor={`end-${schedule.date}-${index}`}
                                          >
                                            {t("endTime")}
                                          </Label>
                                          <div className="flex items-center mt-1">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <div
                                              ref={(el) => {
                                                timeSlotRefs.current[
                                                  `${schedule.date}-${index}-endtime`
                                                ] = el;
                                              }}
                                              className="w-full"
                                            >
                                              <Input
                                                id={`end-${schedule.date}-${index}`}
                                                type="time"
                                                value={slot.endTime}
                                                onChange={(e) =>
                                                  updateTimeSlot(
                                                    schedule.date,
                                                    index,
                                                    "endTime",
                                                    e.target.value
                                                  )
                                                }
                                                className={
                                                  hasFieldError(
                                                    schedule.date,
                                                    "endtime"
                                                  )
                                                    ? "border-red-500"
                                                    : ""
                                                }
                                              />
                                              {unusualTimeWarnings[
                                                `${schedule.date}-${index}-endTime`
                                              ] && (
                                                <Alert className="mt-2 py-2">
                                                  <AlertCircle className="h-4 w-4" />
                                                  <AlertTitle className="text-xs">
                                                    {t("unusualTimeWarning")}
                                                  </AlertTitle>
                                                  <AlertDescription className="text-xs">
                                                    {
                                                      unusualTimeWarnings[
                                                        `${schedule.date}-${index}-endTime`
                                                      ].message
                                                    }
                                                    <Button
                                                      variant="outline"
                                                      size="sm"
                                                      className="ml-2 h-6 px-2 text-xs"
                                                      onClick={() =>
                                                        dismissWarning(
                                                          `${schedule.date}-${index}-endTime`
                                                        )
                                                      }
                                                    >
                                                      {t("confirm")}
                                                    </Button>
                                                  </AlertDescription>
                                                </Alert>
                                              )}
                                              {hasFieldError(
                                                schedule.date,
                                                "endtime"
                                              ) && (
                                                <p className="text-xs text-red-500 mt-1">
                                                  {getFieldErrorMessage(
                                                    schedule.date,
                                                    "endtime"
                                                  )}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <Label
                                            htmlFor={`slot-capacity-${schedule.date}-${index}`}
                                          >
                                            {t("doctorsCount")}
                                          </Label>
                                          <Input
                                            id={`slot-capacity-${schedule.date}-${index}`}
                                            type="number"
                                            min="1"
                                            value={slot.capacity}
                                            onChange={(e) =>
                                              updateTimeSlot(
                                                schedule.date,
                                                index,
                                                "capacity",
                                                Number.parseInt(
                                                  e.target.value
                                                ) || 0
                                              )
                                            }
                                            className={`mt-1 ${
                                              hasFieldError(
                                                schedule.date,
                                                "capacity"
                                              )
                                                ? "border-red-500"
                                                : ""
                                            }`}
                                          />
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            removeTimeSlot(schedule.date, index)
                                          }
                                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 self-end"
                                          disabled={
                                            (schedule.timeSlots?.length || 0) <=
                                            1
                                          }
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-muted-foreground border rounded-md">
                                    {t("noTimeSlots")}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>{t("viewTabTitle")}</CardTitle>
              <CardDescription>{t("viewDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder={`${t("search")}...`}
                    className="w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageIndex(1)}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {t("search")}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="pageSize">{t("display")}</Label>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={handlePageSizeChange}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoadingWorkingSchedules ? (
                <div className="flex items-center justify-center h-40">
                  <p>{t("loading")}</p>
                </div>
              ) : workingSchedulesError ? (
                <div className="text-center py-6 text-destructive">
                  <p>{t("errorLoading")}</p>
                </div>
              ) : !workingSchedulesData?.value?.items?.length ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>{t("noSchedulesFound")}</p>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleSort("date")}
                          >
                            <div className="flex items-center">
                              {t("dateHeader")}
                              {sortColumn === "date" && (
                                <span className="ml-1">
                                  {sortOrder === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleSort("time")}
                          >
                            <div className="flex items-center">
                              {t("timeHeader")}
                              {sortColumn === "time" && (
                                <span className="ml-1">
                                  {sortOrder === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleSort("shiftGroupId")}
                          >
                            <div className="flex items-center">
                              {t("shiftGroupIdHeader")}
                              {sortColumn === "shiftGroupId" && (
                                <span className="ml-1">
                                  {sortOrder === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleSort("numberOfDoctors")}
                          >
                            <div className="flex items-center">
                              {t("doctorsCountHeader")}
                              {sortColumn === "numberOfDoctors" && (
                                <span className="ml-1">
                                  {sortOrder === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleSort("numberOfCustomers")}
                          >
                            <div className="flex items-center">
                              {t("customersCountHeader")}
                              {sortColumn === "numberOfCustomers" && (
                                <span className="ml-1">
                                  {sortOrder === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleSort("capacity")}
                          >
                            <div className="flex items-center">
                              {t("capacityHeader")}
                              {sortColumn === "capacity" && (
                                <span className="ml-1">
                                  {sortOrder === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          </TableHead>
                          <TableHead>{t("statusHeader")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workingSchedulesData.value.items.map((schedule) => (
                          <TableRow
                            key={schedule.shiftGroupId || schedule.date}
                            onClick={() => handleScheduleRowClick(schedule)}
                            className="cursor-pointer hover:bg-muted/50"
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{schedule.date}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {formatTime(schedule.startTime)} -{" "}
                                  {formatTime(schedule.endTime)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                <span>{schedule.shiftGroupId || "-"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                                <span>{schedule.numberOfDoctors || "0"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{schedule.numberOfCustomers || "0"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {schedule.capacity || "0"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-gray-100 text-gray-800">
                                {t("undetermined")}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      {t("showing", {
                        shown: workingSchedulesData.value.items.length,
                        total: workingSchedulesData.value.totalCount,
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pageIndex - 1)}
                        disabled={!workingSchedulesData.value.hasPreviousPage}
                      >
                        {t("previous")}
                      </Button>
                      <span className="text-sm">
                        {t("page", {
                          current: pageIndex,
                          total: Math.ceil(
                            workingSchedulesData.value.totalCount / pageSize
                          ),
                        })}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pageIndex + 1)}
                        disabled={!workingSchedulesData.value.hasNextPage}
                      >
                        {t("next")}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal for schedule details */}
      {selectedSchedule && (
        <WorkingScheduleDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          schedule={selectedSchedule}
          scheduleDetails={scheduleDetailsData?.value?.items}
          isLoading={isLoadingScheduleDetails}
          error={scheduleDetailsError}
        />
      )}
    </div>
  );
}
