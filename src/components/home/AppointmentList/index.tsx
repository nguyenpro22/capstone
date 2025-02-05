"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Appointment {
  id: number
  packageName: string
  date: string
  time: string
  status: "Pending" | "Approved" | "Rejected"
  notes?: string
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    // Fetch appointments data here
    // For now, we'll use mock data
    const mockAppointments: Appointment[] = [
      {
        id: 1,
        packageName: "Facial Rejuvenation",
        date: "2023-06-20",
        time: "10:00",
        status: "Approved",
        notes: "Please arrive 15 minutes early.",
      },
      { id: 2, packageName: "Body Sculpting", date: "2023-06-25", time: "14:00", status: "Pending" },
      {
        id: 3,
        packageName: "Hair Restoration",
        date: "2023-07-01",
        time: "11:00",
        status: "Rejected",
        notes: "Doctor unavailable, please reschedule.",
      },
    ]
    setAppointments(mockAppointments)
  }, [])

  return (
    <div className="space-y-6">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardHeader>
            <CardTitle>{appointment.packageName}</CardTitle>
            <CardDescription>
              {appointment.date} at {appointment.time}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                appointment.status === "Approved"
                  ? "default"
                  : appointment.status === "Pending"
                    ? "secondary"
                    : "destructive"
              }
            >
              {appointment.status}
            </Badge>
            {appointment.notes && <p className="mt-4 text-sm text-muted-foreground">{appointment.notes}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

