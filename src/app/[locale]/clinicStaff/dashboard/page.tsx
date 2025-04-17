"use client";
import { format, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetAppointmentsByDateQuery } from "@/features/booking/api";
import { useGetDoctorsQuery } from "@/features/clinic/api";
import { useTranslations } from "next-intl";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";

export default function DashboardPage() {
  // Get translations for dashboard.clinicStaff namespace
  const t = useTranslations("dashboard.clinicStaff");
  // Get the token and extract clinicId
  const token = getAccessToken();
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  const clinicId = tokenData?.clinicId || "";
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            {t("statusBadges.inProgress")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            {t("statusBadges.pending")}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            {t("statusBadges.cancelled")}
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            {t("statusBadges.completed")}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get today's date in the required format (YYYY-MM-DD)
  const today = new Date();
  const todayFormatted = format(today, "yyyy-MM-dd");

  // Get yesterday's date in the required format
  const yesterday = subDays(today, 1);
  const yesterdayFormatted = format(yesterday, "yyyy-MM-dd");

  // // State to store the clinic ID
  // const [clinicId, setClinicId] = useState<string>("");

  // Fetch today's appointments
  const { data: todayData, isLoading: isLoadingToday } =
    useGetAppointmentsByDateQuery(todayFormatted);

  // Fetch yesterday's appointments
  const { data: yesterdayData, isLoading: isLoadingYesterday } =
    useGetAppointmentsByDateQuery(yesterdayFormatted);

  // // Extract clinic ID from the first appointment (if available)
  // useEffect(() => {
  //   if (
  //     todayData?.value?.appointments &&
  //     todayData.value.appointments.length > 0
  //   ) {
  //     setClinicId(todayData.value.appointments[0].clinic.id);
  //   }
  // }, [todayData]);

  // Fetch doctors for the clinic
  const { data: doctorsData, isLoading: isLoadingDoctors } = useGetDoctorsQuery(
    {
      clinicId,
      pageIndex: 1,
      pageSize: 100, // Fetch a large number to get all doctors
      searchTerm: "",
      role: 1, // Assuming 1 is the role ID for doctors
    },
    { skip: !clinicId } // Skip the query if clinicId is not available
  );

  // Calculate metrics
  const todayAppointments = todayData?.value?.appointments || [];
  const yesterdayAppointments = yesterdayData?.value?.appointments || [];

  const totalAppointments = todayAppointments.length;
  const totalYesterdayAppointments = yesterdayAppointments.length;

  // Calculate percentage change from yesterday
  const percentageChange =
    totalYesterdayAppointments > 0
      ? Math.round(
          ((totalAppointments - totalYesterdayAppointments) /
            totalYesterdayAppointments) *
            100
        )
      : 0;

  // Count confirmed appointments (status "In Progress" or "Completed")
  const confirmedAppointments = todayAppointments.filter(
    (app: any) =>
      app.status.toLowerCase() === "in progress" ||
      app.status.toLowerCase() === "completed"
  ).length;

  // Calculate confirmation rate
  const confirmationRate =
    totalAppointments > 0
      ? Math.round((confirmedAppointments / totalAppointments) * 100)
      : 0;

  // Get total doctors count from the API
  const totalDoctors = doctorsData?.value?.totalCount || 0;
  console.log("data doctor", doctorsData);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("dashboardTitle")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("totalAppointments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingToday || isLoadingYesterday ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("loading")}</span>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold">{totalAppointments}</div>
                <p
                  className={`text-xs mt-1 ${
                    percentageChange >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {percentageChange >= 0 ? "+" : ""}
                  {percentageChange}% {t("fromYesterday")}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("confirmedAppointments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingToday ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("loading")}</span>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold">
                  {confirmedAppointments}
                </div>
                <p className="text-xs text-green-500 mt-1">
                  {confirmationRate}% {t("confirmationRate")}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("availableDoctors")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingDoctors || !clinicId ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("loading")}</span>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold">{totalDoctors}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("atThisClinic")}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("todaySchedule")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingToday ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("customer")}</TableHead>
                  <TableHead>{t("service")}</TableHead>
                  <TableHead>{t("time")}</TableHead>
                  <TableHead>{t("doctor")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      {t("noAppointments")}
                    </TableCell>
                  </TableRow>
                ) : (
                  todayAppointments.map((appointment: any) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={appointment.customer.avatar || ""}
                            />
                            <AvatarFallback>
                              {appointment.customer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{appointment.customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.service.name}</TableCell>
                      <TableCell>{`${appointment.startTime.substring(
                        0,
                        5
                      )} - ${appointment.endTime.substring(0, 5)}`}</TableCell>
                      <TableCell>{appointment.doctor.name}</TableCell>
                      <TableCell>
                        {getStatusBadge(appointment.status)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              {t("viewDetails")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {t("editAppointment")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                              {t("cancel")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
