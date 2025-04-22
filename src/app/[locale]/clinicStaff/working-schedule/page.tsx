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
import {
  Plus,
  Save,
  Clock,
  CalendarDays,
  X,
  CalendarRange,
  Search,
  CalendarIcon,
  AlertCircle,
  Layers,
  Check,
  Info,
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
import type {
  ExtendedWorkingSchedule,
  WorkingScheduleResponseGetAll,
  Shift,
} from "@/features/working-schedule/types";
import {
  useCreateClinicSchedulesMutation,
  useGetWorkingScheduleQuery,
  useGetWorkingSchedulesByShiftGroupQuery,
} from "@/features/working-schedule/api";
import { useGetAllShiftsQuery } from "@/features/configs/api";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Thêm import cho các type lỗi từ RTK Query
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type {
  BasicErrorResponse,
  ErrorDetail,
  ErrorMutationResponse,
} from "@/lib/api";

// Define a type for the WorkingSchedule - updated to match API requirements
interface WorkingSchedule {
  date: string;
  capacity: number;
  shiftGroupId: string;
}

// Define a type for shift with capacity for internal use
interface ShiftWithCapacity extends Shift {
  capacity?: number;
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
    useState<WorkingScheduleResponseGetAll | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // New states for shift selection
  const [isShiftSelectionOpen, setIsShiftSelectionOpen] = useState(false);
  // Replace the single selectedShift state with an array
  const [selectedShiftsForModal, setSelectedShiftsForModal] = useState<Shift[]>(
    []
  );
  const [selectedDateForShift, setSelectedDateForShift] = useState<string>("");
  const [multiDateShiftSelection, setMultiDateShiftSelection] = useState(false);
  const [selectedShifts, setSelectedShifts] = useState<{
    [dateKey: string]: Shift;
  }>({});

  // State to store shift capacities
  const [shiftCapacities, setShiftCapacities] = useState<{
    [key: string]: number; // key format: "date-shiftId"
  }>({});

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

  // Add this query to fetch all available shifts
  const {
    data: shiftsData,
    isLoading: isLoadingShifts,
    error: shiftsError,
  } = useGetAllShiftsQuery(
    {
      pageIndex: 1,
      pageSize: 100,
    },
    {
      skip: !clinicId,
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
  const [originalApiData, setOriginalApiData] = useState<
    WorkingScheduleResponseGetAll[]
  >([]);

  // Helper function to get capacity for a shift
  const getShiftCapacity = (date: string, shiftId: string): number => {
    const key = `${date}-${shiftId}`;
    return shiftCapacities[key] || 10; // Default to 10 if not set
  };

  // Helper function to set capacity for a shift
  const setShiftCapacity = (
    date: string,
    shiftId: string,
    capacity: number
  ) => {
    setShiftCapacities((prev) => ({
      ...prev,
      [`${date}-${shiftId}`]: capacity,
    }));
  };

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
        {} as Record<string, WorkingScheduleResponseGetAll[]>
      );

      // Initialize shift capacities from API data
      const newShiftCapacities = { ...shiftCapacities };

      // Tạo schedules từ dữ liệu API đã nhóm
      const newSchedules = Object.entries(schedulesByDate).map(
        ([dateKey, schedules]) => {
          // Fetch shift details for each schedule if available
          const shifts = schedules.map((schedule) => {
            // Store capacity in shiftCapacities state
            const key = `${dateKey}-${schedule.shiftGroupId}`;
            newShiftCapacities[key] = schedule.capacity || 10;

            // Try to find the shift in shiftsData
            if (shiftsData?.value?.items) {
              const matchingShift = shiftsData.value.items.find(
                (shift) => shift.id === schedule.shiftGroupId
              );
              if (matchingShift) {
                return {
                  ...matchingShift,
                  // Don't add capacity to the shift object itself
                };
              }
            }

            // If no matching shift found, create a placeholder with available data
            return {
              id: schedule.shiftGroupId,
              name: `Shift ${schedule.shiftGroupId.substring(0, 6)}...`,
              note: `${formatTime(schedule.startTime)} - ${formatTime(
                schedule.endTime
              )}`,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              createdAt: "",
            };
          });

          // Create timeSlots from shifts
          const timeSlots = schedules.map((schedule) => ({
            startTime: formatTime(schedule.startTime),
            endTime: formatTime(schedule.endTime),
            capacity: schedule.capacity || 10,
          }));

          return {
            date: dateKey,
            timeSlots:
              timeSlots.length > 0
                ? timeSlots
                : [{ startTime: "08:00", endTime: "12:00", capacity: 10 }],
            // Include new fields with default values if they don't exist
            shiftGroupId: schedules[0]?.shiftGroupId || "",
            // Add time properties from the API response
            startTime: schedules[0]?.startTime || "",
            endTime: schedules[0]?.endTime || "",
            // Add the shifts array
            shifts: shifts,
            // Add capacity (will be used for API submission)
            capacity: schedules[0]?.capacity || 10,
          };
        }
      );

      setShiftCapacities(newShiftCapacities);
      setSchedules(newSchedules);

      // Lưu trữ dữ liệu gốc từ API để sử dụng khi chọn lại ngày
      setOriginalApiData(workingSchedulesData.value.items);

      // Also populate selectedShifts state for existing shifts
      const newSelectedShifts = { ...selectedShifts };
      workingSchedulesData.value.items.forEach((item) => {
        if (item.shiftGroupId) {
          // Try to find the shift in shiftsData
          if (shiftsData?.value?.items) {
            const matchingShift = shiftsData.value.items.find(
              (shift) => shift.id === item.shiftGroupId
            );
            if (matchingShift) {
              newSelectedShifts[item.date] = matchingShift;
            }
          }
        }
      });
      setSelectedShifts(newSelectedShifts);
    }
  }, [workingSchedulesData, shiftsData]);

  // Xóa lỗi validation khi người dùng thay đổi dữ liệu
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
    // Xóa lỗi server khi người dùng thay đổi dữ liệu
    if (serverError) {
      setServerError(null);
    }
  }, [schedules, shiftCapacities]);

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

        // Also remove from selectedShifts
        const newSelectedShifts = { ...selectedShifts };
        removedDates.forEach((date) => {
          const dateKey = format(date, "yyyy-MM-dd");
          if (newSelectedShifts[dateKey]) {
            delete newSelectedShifts[dateKey];
          }
        });
        setSelectedShifts(newSelectedShifts);
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

            // Update shift capacities
            apiSchedules.forEach((schedule) => {
              const key = `${formattedDate}-${schedule.shiftGroupId}`;
              setShiftCapacity(
                formattedDate,
                schedule.shiftGroupId,
                schedule.capacity || 10
              );
            });

            return {
              date: formattedDate,
              capacity: apiSchedules[0]?.capacity || 10,
              timeSlots: timeSlots,
              // Include new fields
              shiftGroupId: apiSchedules[0]?.shiftGroupId || "",
              // Add time properties from the API response
              startTime: apiSchedules[0]?.startTime || "",
              endTime: apiSchedules[0]?.endTime || "",
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
              timeSlots: [],
              shiftGroupId: "",
              startTime: "",
              endTime: "",
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

        // Update shift capacities
        apiSchedules.forEach((schedule) => {
          const key = `${formattedDate}-${schedule.shiftGroupId}`;
          setShiftCapacity(
            formattedDate,
            schedule.shiftGroupId,
            schedule.capacity || 10
          );
        });

        return {
          date: formattedDate,
          capacity: apiSchedules[0]?.capacity || 10,
          timeSlots: timeSlots,
          // Include new fields
          shiftGroupId: apiSchedules[0]?.shiftGroupId || "",
          // Add time properties from the API response
          startTime: apiSchedules[0]?.startTime || "",
          endTime: apiSchedules[0]?.endTime || "",
        };
      } else {
        // Nếu không có dữ liệu từ API, tạo mới với giá trị mặc định
        return {
          date: formattedDate,
          capacity: 10, // Giá trị mặc định
          timeSlots: [],
          shiftGroupId: "",
          startTime: "",
          endTime: "",
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
    setSelectedShifts({});

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

  // Open shift selection modal
  const openShiftSelection = (date: string) => {
    setSelectedDateForShift(date);

    // Initialize selected shifts for the modal with any existing shifts for this date
    const existingSchedule = schedules.find((s) => s.date === date);
    const existingShiftIds = existingSchedule?.shifts?.map((s) => s.id) || [];

    // Find the corresponding Shift objects from shiftsData
    const preselectedShifts =
      shiftsData?.value?.items.filter((shift) =>
        existingShiftIds.includes(shift.id)
      ) || [];

    setSelectedShiftsForModal(preselectedShifts);
    setIsShiftSelectionOpen(true);
  };

  // Handle shift selection
  const handleShiftSelect = (shift: Shift) => {
    // Check if shift is already selected
    const isAlreadySelected = selectedShiftsForModal.some(
      (s) => s.id === shift.id
    );

    if (isAlreadySelected) {
      // Remove the shift if already selected
      setSelectedShiftsForModal(
        selectedShiftsForModal.filter((s) => s.id !== shift.id)
      );
    } else {
      // Add the shift if not already selected
      setSelectedShiftsForModal([...selectedShiftsForModal, shift]);
    }
  };

  // Apply selected shift to date(s)
  const applyShiftToDate = () => {
    if (selectedShiftsForModal.length === 0) {
      toast.error(t("selectShiftFirst"));
      return;
    }

    // If multi-date selection is enabled, apply to all selected dates
    if (multiDateShiftSelection) {
      const updatedSchedules = schedules.map((schedule) => {
        if (
          selectedDates.some(
            (date) => format(date, "yyyy-MM-dd") === schedule.date
          )
        ) {
          // Create shift assignments from selected shifts
          const shiftAssignments = selectedShiftsForModal.map((shift) => ({
            ...shift,
            // Don't add capacity to the shift object
          }));

          // Create timeSlots from shifts
          const timeSlots = selectedShiftsForModal.map((shift) => ({
            startTime: formatTime(shift.startTime),
            endTime: formatTime(shift.endTime),
            capacity: 10, // Default capacity
          }));

          // Initialize capacities for each shift
          selectedShiftsForModal.forEach((shift) => {
            setShiftCapacity(schedule.date, shift.id, 10); // Default capacity
          });

          return {
            ...schedule,
            // Use the first shift's ID as the shiftGroupId if needed
            shiftGroupId: selectedShiftsForModal[0]?.id || "",
            timeSlots: timeSlots,
            shifts: shiftAssignments,
          };
        }
        return schedule;
      });

      setSchedules(updatedSchedules);
      toast.success(t("shiftsAppliedToMultipleDates"));
    } else {
      // Apply to single date
      const updatedSchedules = schedules.map((schedule) => {
        if (schedule.date === selectedDateForShift) {
          // Create shift assignments from selected shifts
          const shiftAssignments = selectedShiftsForModal.map((shift) => ({
            ...shift,
            // Don't add capacity to the shift object
          }));

          // Create timeSlots from shifts
          const timeSlots = selectedShiftsForModal.map((shift) => ({
            startTime: formatTime(shift.startTime),
            endTime: formatTime(shift.endTime),
            capacity: 10, // Default capacity
          }));

          // Initialize capacities for each shift
          selectedShiftsForModal.forEach((shift) => {
            setShiftCapacity(schedule.date, shift.id, 10); // Default capacity
          });

          return {
            ...schedule,
            // Use the first shift's ID as the shiftGroupId if needed
            shiftGroupId: selectedShiftsForModal[0]?.id || "",
            timeSlots: timeSlots,
            shifts: shiftAssignments,
          };
        }
        return schedule;
      });

      setSchedules(updatedSchedules);
      toast.success(t("shiftsAppliedToDate", { date: selectedDateForShift }));
    }

    // Close the modal
    setIsShiftSelectionOpen(false);
    setSelectedShiftsForModal([]);
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

  // Function to check if a field has an error
  const hasFieldError = (key: string, field: string): boolean => {
    const errorKey = `${key}-${field}`;
    return !!validationErrors[errorKey];
  };

  // Function to get the error message for a field
  const getFieldErrorMessage = (key: string, field: string): string => {
    const errorKey = `${key}-${field}`;
    return validationErrors[errorKey]?.message || "";
  };

  // Add a function to remove a shift
  const removeShift = (date: string, shiftId: string) => {
    setSchedules(
      schedules.map((schedule) => {
        if (schedule.date === date && schedule.shifts) {
          // Filter out the shift to remove
          const updatedShifts = schedule.shifts.filter(
            (shift) => shift.id !== shiftId
          );

          // Update timeSlots to remove the corresponding time slot
          const updatedTimeSlots = schedule.timeSlots?.filter((slot) => {
            const shiftToRemove = schedule.shifts?.find(
              (s) => s.id === shiftId
            );
            if (shiftToRemove) {
              return !(
                slot.startTime === formatTime(shiftToRemove.startTime) &&
                slot.endTime === formatTime(shiftToRemove.endTime)
              );
            }
            return true;
          });

          return {
            ...schedule,
            shifts: updatedShifts,
            timeSlots: updatedTimeSlots,
            // If we removed all shifts, reset these fields
            shiftGroupId: updatedShifts.length > 0 ? updatedShifts[0].id : "",
          };
        }
        return schedule;
      })
    );

    // Also remove from shiftCapacities
    const key = `${date}-${shiftId}`;
    setShiftCapacities((prev) => {
      const newCapacities = { ...prev };
      delete newCapacities[key];
      return newCapacities;
    });

    toast.success(t("shiftRemoved"));
  };

  // Update the handleSubmit function to handle individual shift capacities
  const handleSubmit = async () => {
    if (schedules.length === 0) {
      toast.error(t("selectAtLeastOneDay"));
      return;
    }

    if (!clinicId) {
      toast.error(t("clinicIdNotFound"));
      return;
    }

    // Check if all dates have shifts assigned
    const datesWithoutShifts = schedules.filter(
      (schedule) => !schedule.shifts || schedule.shifts.length === 0
    );
    if (datesWithoutShifts.length > 0) {
      toast.error(t("assignShiftsToAllDates"));
      return;
    }

    try {
      setIsSubmitting(true);
      // Xóa lỗi validation cũ
      setValidationErrors({});
      // Xóa lỗi server cũ
      setServerError(null);

      // Format data for API - create an entry for each shift in each day
      const apiFormattedSchedules: WorkingSchedule[] = [];

      schedules.forEach((schedule) => {
        if (schedule.shifts && schedule.shifts.length > 0) {
          // Add each shift as a separate entry
          schedule.shifts.forEach((shift) => {
            const capacity = getShiftCapacity(schedule.date, shift.id);
            apiFormattedSchedules.push({
              date: schedule.date,
              capacity: capacity,
              shiftGroupId: shift.id,
            });
          });
        } else {
          // Fallback for schedules without shifts array
          apiFormattedSchedules.push({
            date: schedule.date,
            capacity: schedule.capacity || 10,
            shiftGroupId:
              schedule.shiftGroupId || selectedShifts[schedule.date]?.id || "",
          });
        }
      });

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

  // Add this function to handle row click
  const handleScheduleRowClick = (schedule: WorkingScheduleResponseGetAll) => {
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
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="setup">{t("setupTabTitle")}</TabsTrigger>
            <TabsTrigger value="view">{t("viewTabTitle")}</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Input
              placeholder={t("searchDatePlaceholder")}
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-40 md:w-48"
            />
            <Button variant="outline" size="icon" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="setup">
          {isLoadingWorkingSchedules || isLoadingShifts ? (
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
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      {t("totalSelectedDates", { count: selectedDates.length })}
                    </p>
                  </CardFooter>
                </Card>

                {selectedDates.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("bulkShiftAssignment")}</CardTitle>
                      <CardDescription>
                        {t("bulkShiftAssignmentDescription")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                          id="multi-date-shift"
                          checked={multiDateShiftSelection}
                          onCheckedChange={(checked) =>
                            setMultiDateShiftSelection(checked === true)
                          }
                        />
                        <Label htmlFor="multi-date-shift">
                          {t("applyShiftToAllDates")}
                        </Label>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => {
                          if (multiDateShiftSelection) {
                            // If multi-date is selected, just open the modal
                            setSelectedDateForShift("");
                            setIsShiftSelectionOpen(true);
                          } else {
                            // If not multi-date, show a message
                            toast.info(t("selectShiftForEachDate"));
                          }
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t("selectShiftForMultipleDates")}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6" ref={configSectionRef}>
                <Card className="h-full">
                  <CardHeader className="sticky top-0 bg-card z-10 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{t("configTitle")}</CardTitle>
                      <CardDescription>
                        {t("configDescription")}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        isSubmitting || isCreating || schedules.length === 0
                      }
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSubmitting || isCreating
                        ? t("saving")
                        : t("saveSchedule")}
                    </Button>
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
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <Label>{t("selectedShifts")}</Label>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      openShiftSelection(schedule.date)
                                    }
                                  >
                                    <Plus className="h-4 w-4 mr-1" />{" "}
                                    {t("addShift")}
                                  </Button>
                                </div>

                                {schedule.shifts &&
                                schedule.shifts.length > 0 ? (
                                  <div className="space-y-2">
                                    {schedule.shifts.map((shift, index) => (
                                      <div
                                        key={`${schedule.date}-${shift.id}-${index}`}
                                        className="border p-4 rounded-md"
                                      >
                                        <div className="flex justify-between items-center mb-2">
                                          <div className="flex items-center gap-2">
                                            <div className="font-medium">
                                              {t("shiftId")}: {shift.id}
                                            </div>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive hover:text-destructive"
                                            onClick={() =>
                                              removeShift(
                                                schedule.date,
                                                shift.id
                                              )
                                            }
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                          {shift.note}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                          <div>
                                            <Label className="text-xs">
                                              {t("startTime")}
                                            </Label>
                                            <div className="flex items-center mt-1">
                                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                              <div className="text-sm">
                                                {formatTime(shift.startTime)}
                                              </div>
                                            </div>
                                          </div>
                                          <div>
                                            <Label className="text-xs">
                                              {t("endTime")}
                                            </Label>
                                            <div className="flex items-center mt-1">
                                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                              <div className="text-sm">
                                                {formatTime(shift.endTime)}
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Add capacity input for each shift */}
                                        <div>
                                          <div className="flex items-center gap-1">
                                            <Label
                                              htmlFor={`capacity-${schedule.date}-${shift.id}`}
                                            >
                                              {t("capacity")}
                                            </Label>
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p>{t("capacityTooltip")}</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          </div>
                                          <Input
                                            id={`capacity-${schedule.date}-${shift.id}`}
                                            type="number"
                                            min="1"
                                            value={getShiftCapacity(
                                              schedule.date,
                                              shift.id
                                            )}
                                            onChange={(e) =>
                                              setShiftCapacity(
                                                schedule.date,
                                                shift.id,
                                                Number.parseInt(
                                                  e.target.value
                                                ) || 0
                                              )
                                            }
                                            className={`mt-1 ${
                                              hasFieldError(
                                                `${schedule.date}-${shift.id}`,
                                                "capacity"
                                              )
                                                ? "border-red-500 ring-2 ring-red-500"
                                                : ""
                                            }`}
                                            ref={(el) => {
                                              timeSlotRefs.current[
                                                `${schedule.date}-${index}-capacity`
                                              ] = el;
                                            }}
                                          />
                                          {hasFieldError(
                                            `${schedule.date}-${shift.id}`,
                                            "capacity"
                                          ) && (
                                            <p className="text-xs text-red-500 mt-1">
                                              {getFieldErrorMessage(
                                                `${schedule.date}-${shift.id}`,
                                                "capacity"
                                              )}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="border border-dashed p-4 rounded-md text-center">
                                    <p className="text-muted-foreground">
                                      {t("noShiftsSelected")}
                                    </p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="mt-2"
                                      onClick={() =>
                                        openShiftSelection(schedule.date)
                                      }
                                    >
                                      <Plus className="h-4 w-4 mr-1" />{" "}
                                      {t("addShift")}
                                    </Button>
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

      {/* Modal for shift selection */}
      <Dialog
        open={isShiftSelectionOpen}
        onOpenChange={setIsShiftSelectionOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {multiDateShiftSelection
                ? t("selectShiftForMultipleDates")
                : t("selectShiftForDate", { date: selectedDateForShift })}
            </DialogTitle>
            <DialogDescription>{t("selectShiftDescription")}</DialogDescription>
          </DialogHeader>

          {isLoadingShifts ? (
            <div className="py-6 text-center">
              <p>{t("loadingShifts")}</p>
            </div>
          ) : shiftsError ? (
            <div className="py-6 text-center text-destructive">
              <p>{t("errorLoadingShifts")}</p>
            </div>
          ) : !shiftsData?.value?.items?.length ? (
            <div className="py-6 text-center text-muted-foreground">
              <p>{t("noShiftsAvailable")}</p>
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              <div className="space-y-2">
                {shiftsData.value.items.map((shift) => (
                  <div
                    key={shift.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedShiftsForModal.some((s) => s.id === shift.id)
                        ? "border-primary bg-primary/10"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => handleShiftSelect(shift)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{shift.name}</div>
                      {selectedShiftsForModal.some(
                        (s) => s.id === shift.id
                      ) && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {shift.note}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        {formatTime(shift.startTime)}
                      </div>
                      <div className="text-muted-foreground">-</div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        {formatTime(shift.endTime)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsShiftSelectionOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={applyShiftToDate}
              disabled={selectedShiftsForModal.length === 0}
            >
              {t("applyShift")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
