"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { cn } from "@/lib/utils"

// Enhanced sample data with dates
const schedules = [
  {
    id: 1,
    customer: "Emma Thompson",
    service: "Facial Treatment",
    time: "10:00 AM",
    date: new Date(2025, 2, 28), // March 28, 2025
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "1h",
  },
  {
    id: 2,
    customer: "James Wilson",
    service: "Hair Styling",
    time: "11:30 AM",
    date: new Date(2025, 2, 28), // March 28, 2025
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "45m",
  },
  {
    id: 3,
    customer: "Sophia Garcia",
    service: "Manicure & Pedicure",
    time: "2:00 PM",
    date: new Date(2025, 2, 29), // March 29, 2025
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "1h 30m",
  },
  {
    id: 4,
    customer: "Michael Brown",
    service: "Massage Therapy",
    time: "3:30 PM",
    date: new Date(2025, 2, 30), // March 30, 2025
    status: "cancelled",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "1h",
  },
  {
    id: 5,
    customer: "Olivia Martinez",
    service: "Skin Consultation",
    time: "5:00 PM",
    date: new Date(2025, 2, 31), // March 31, 2025
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "30m",
  },
  {
    id: 6,
    customer: "William Johnson",
    service: "Haircut",
    time: "9:00 AM",
    date: new Date(2025, 3, 1), // April 1, 2025
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "45m",
  },
  {
    id: 7,
    customer: "Ava Rodriguez",
    service: "Full Body Massage",
    time: "1:00 PM",
    date: new Date(2025, 3, 1), // April 1, 2025
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "1h 30m",
  },
]

export default function AppointmentsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Get days of current month for the calendar
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get appointments for the selected date
  const selectedDateAppointments = schedules.filter((appointment) => isSameDay(appointment.date, selectedDate))

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Set today as the selected date when component mounts
  useEffect(() => {
    setSelectedDate(new Date())
  }, [])

  // Count appointments by status
  const totalAppointments = schedules.length
  const confirmedAppointments = schedules.filter((s) => s.status === "confirmed").length
  const pendingAppointments = schedules.filter((s) => s.status === "pending").length
  const cancelledAppointments = schedules.filter((s) => s.status === "cancelled").length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Appointments</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-pink-700">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-700">{totalAppointments}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{confirmedAppointments}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700">{pendingAppointments}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{cancelledAppointments}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Header - Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium text-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the start of the month */}
              {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                <div key={`empty-start-${index}`} className="h-24 p-1 bg-gray-50 rounded-md"></div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((day) => {
                // Get appointments for this day
                const dayAppointments = schedules.filter((appointment) => isSameDay(appointment.date, day))

                // Count appointments by status for this day
                const confirmedCount = dayAppointments.filter((a) => a.status === "confirmed").length
                const pendingCount = dayAppointments.filter((a) => a.status === "pending").length
                const cancelledCount = dayAppointments.filter((a) => a.status === "cancelled").length

                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "h-24 p-1 border rounded-md transition-colors hover:bg-gray-50 cursor-pointer",
                      isSameDay(day, selectedDate) && "border-blue-500 bg-blue-50",
                      !isSameMonth(day, currentMonth) && "text-gray-300",
                    )}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="text-right text-sm font-medium">{format(day, "d")}</div>

                      {dayAppointments.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-1">
                          {confirmedCount > 0 && (
                            <div className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                              {confirmedCount} confirmed
                            </div>
                          )}
                          {pendingCount > 0 && (
                            <div className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                              {pendingCount} pending
                            </div>
                          )}
                          {cancelledCount > 0 && (
                            <div className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full">
                              {cancelledCount} cancelled
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Empty cells for days after the end of the month */}
              {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
                <div key={`empty-end-${index}`} className="h-24 p-1 bg-gray-50 rounded-md"></div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointments for Selected Day */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>{format(selectedDate, "MMMM d, yyyy")}</CardDescription>
            </div>
            <Button className="gap-2">
              <Plus size={16} />
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDateAppointments.length > 0 ? (
                selectedDateAppointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <div
                      className={`h-1 ${
                        appointment.status === "confirmed"
                          ? "bg-green-500"
                          : appointment.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={appointment.avatar} />
                            <AvatarFallback>{appointment.customer.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{appointment.customer}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.service}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-medium">{appointment.time}</p>
                            <p className="text-sm text-muted-foreground">Duration: {appointment.duration}</p>
                          </div>
                          <div>
                            {appointment.status === "confirmed" && <CheckCircle2 className="text-green-500" />}
                            {appointment.status === "pending" && <AlertCircle className="text-yellow-500" />}
                            {appointment.status === "cancelled" && <XCircle className="text-red-500" />}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 px-4 py-2 flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      {appointment.status === "pending" ? (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          Confirm
                        </Button>
                      ) : (
                        <Button size="sm">Check In</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No appointments scheduled for this day.
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Plus size={14} />
                      Add Appointment
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

