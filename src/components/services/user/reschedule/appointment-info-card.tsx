import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Clock, Stethoscope } from "lucide-react";

interface AppointmentInfoCardProps {
  title: string;
  date: string | Date;
  time?: string;
  endTime?: string;
  doctor?: { name?: string; fullName?: string } | null;
  isNew?: boolean;
}

export function AppointmentInfoCard({
  title,
  date,
  time,
  endTime,
  doctor,
  isNew = false,
}: AppointmentInfoCardProps) {
  const formatTime = (time: string | null | undefined) => {
    if (!time) return "N/A";
    return time.substring(0, 5);
  };

  const bgColorClass = isNew
    ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30"
    : "bg-gray-50 dark:bg-indigo-900/20 border-gray-200 dark:border-indigo-800/30";

  const iconColorClass = isNew
    ? "bg-purple-500/20 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
    : "bg-red-500/20 dark:bg-red-500/10 text-red-600 dark:text-red-400";

  const titleColorClass = isNew
    ? "text-purple-800 dark:text-purple-200"
    : "text-gray-800 dark:text-indigo-200";

  const formattedDate = typeof date === "string" ? parseISO(date) : date;

  return (
    <div className={`${bgColorClass} rounded-lg p-3 shadow-sm`}>
      <h4
        className={`font-medium text-sm ${titleColorClass} mb-3 flex items-center`}
      >
        <Clock className="h-4 w-4 mr-1.5 text-inherit" />
        {title}
      </h4>
      <div className="space-y-2">
        <div className="flex items-start p-2 rounded-lg bg-white/80 dark:bg-indigo-950/40">
          <div
            className={`${iconColorClass} rounded-full p-1.5 mr-2 flex-shrink-0`}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-indigo-300/70 mb-0.5">
              Ngày hẹn
            </p>
            <p className="font-medium text-xs dark:text-indigo-200">
              {format(formattedDate, "EEEE, dd/MM/yyyy", {
                locale: vi,
              })}
            </p>
          </div>
        </div>

        <div className="flex items-start p-2 rounded-lg bg-white/80 dark:bg-indigo-950/40">
          <div
            className={`${iconColorClass} rounded-full p-1.5 mr-2 flex-shrink-0`}
          >
            <Clock className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-indigo-300/70 mb-0.5">
              Thời gian
            </p>
            <p className="font-medium text-xs dark:text-indigo-200">
              {time && formatTime(time)}
              {endTime && ` - ${formatTime(endTime)}`}
            </p>
          </div>
        </div>

        {doctor && (
          <div className="flex items-start p-2 rounded-lg bg-white/80 dark:bg-indigo-950/40">
            <div
              className={`${iconColorClass} rounded-full p-1.5 mr-2 flex-shrink-0`}
            >
              <Stethoscope className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-indigo-300/70 mb-0.5">
                Bác sĩ
              </p>
              <p className="font-medium text-xs dark:text-indigo-200">
                {doctor.name || doctor.fullName}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
