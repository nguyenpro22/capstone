import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, Users, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";

// Dynamically import components for better performance
const AppointmentSummary = dynamic(
  () => import("@/components/doctor/dashboard/appointment-summary"),
  {
    loading: () => <Skeleton className="w-full h-[200px] rounded-lg" />,
    ssr: false,
  }
);

const UpcomingAppointments = dynamic(
  () => import("@/components/doctor/dashboard/upcoming-appointments"),
  {
    loading: () => <Skeleton className="w-full h-[300px] rounded-lg" />,
  }
);

const TodaySchedule = dynamic(
  () => import("@/components/doctor/dashboard/today-schedule"),
  {
    loading: () => <Skeleton className="w-full h-[300px] rounded-lg" />,
  }
);

export default async function DashboardPage() {
  const t = await getTranslations("doctorDashboard");

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          {t("title")}
        </h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover-effect border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("cards.todayAppointments")}
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              {t("cards.compared", { number: 2 })}
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover-effect border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("cards.pendingConfirmations")}
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              -1 compared to yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover-effect border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("cards.totalPatients")}
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              {t("cards.new", { number: 6 })}
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover-effect border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("cards.completedToday")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              {t("cards.remaining", { number: 5 })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-primary"
          >
            {t("tabs.upcoming")}
          </TabsTrigger>
          <TabsTrigger
            value="today"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-primary"
          >
            {t("tabs.today")}
          </TabsTrigger>
          <TabsTrigger
            value="summary"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-primary"
          >
            {t("tabs.summary")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          <Suspense
            fallback={<Skeleton className="w-full h-[300px] rounded-lg" />}
          >
            <UpcomingAppointments />
          </Suspense>
        </TabsContent>
        <TabsContent value="today" className="space-y-4">
          <Suspense
            fallback={<Skeleton className="w-full h-[300px] rounded-lg" />}
          >
            <TodaySchedule />
          </Suspense>
        </TabsContent>
        <TabsContent value="summary" className="space-y-4">
          <Suspense
            fallback={<Skeleton className="w-full h-[200px] rounded-lg" />}
          >
            <AppointmentSummary />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
