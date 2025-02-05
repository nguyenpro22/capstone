"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface Appointment {
  id: number
  date: Date | undefined
  time: string
  status: "Pending" | "Approved" | "Rejected"
}

export default function AppointmentScheduler({ orderId }: { orderId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")

  useEffect(() => {
    // Fetch appointments data here
    // For now, we'll use mock data
    const mockAppointments: Appointment[] = [
      { id: 1, date: new Date(2023, 5, 20), time: "10:00", status: "Approved" },
      { id: 2, date: new Date(2023, 6, 5), time: "14:00", status: "Pending" },
      { id: 3, date: undefined, time: "", status: "Pending" },
    ]
    setAppointments(mockAppointments)
  }, [])

  const handleSchedule = (appointmentId: number) => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive",
      })
      return
    }

    // Check for conflicts
    const conflict = appointments.find(
      (app) => app.date?.toDateString() === selectedDate.toDateString() && app.time === selectedTime,
    )

    if (conflict) {
      toast({
        title: "Scheduling Conflict",
        description: "This time slot conflicts with another appointment. Do you want to proceed?",
        action: <Button onClick={() => confirmSchedule(appointmentId)}>Proceed Anyway</Button>,
      })
    } else {
      confirmSchedule(appointmentId)
    }
  }

  const confirmSchedule = (appointmentId: number) => {
    // Update appointment
    setAppointments(
      appointments.map((app) =>
        app.id === appointmentId ? { ...app, date: selectedDate, time: selectedTime, status: "Pending" } : app,
      ),
    )

    toast({
      title: "Appointment Scheduled",
      description: "Your appointment has been scheduled and is pending approval.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Appointments for Order #{orderId}</CardTitle>
        <CardDescription>Select date and time for each appointment</CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.map((appointment, index) => (
          <div key={appointment.id} className="mb-6 p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">Appointment {index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Calendar
                  mode="single"
                  selected={appointment.date}
                  onSelect={(date) => setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-4">
                <Select onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => handleSchedule(appointment.id)} disabled={appointment.status !== "Pending"}>
                  {appointment.status === "Pending" ? "Schedule" : appointment.status}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

