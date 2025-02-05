"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Order {
  id: string
  packageName: string
  date: string
  status: string
  price: number
  doctor: string
  appointments: Array<{
    id: number
    date: string
    status: "Completed" | "Scheduled" | "Pending"
  }>
}

export default function OrderDetail({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    // Fetch order data here
    // For now, we'll use mock data
    const mockOrder: Order = {
      id,
      packageName: "Facial Rejuvenation",
      date: "2023-05-15",
      status: "In Progress",
      price: 299,
      doctor: "Dr. Sarah Johnson",
      appointments: [
        { id: 1, date: "2023-05-20", status: "Completed" },
        { id: 2, date: "2023-06-05", status: "Scheduled" },
        { id: 3, date: "2023-06-20", status: "Pending" },
      ],
    }
    setOrder(mockOrder)
  }, [id])

  if (!order) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>{order.packageName}</CardTitle>
        <CardDescription>Order Date: {order.date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-semibold">Status: {order.status}</p>
        <p className="text-2xl font-bold mt-2">${order.price}</p>
        <p className="mt-4">Doctor: {order.doctor}</p>
        <h3 className="text-lg font-semibold mt-6 mb-2">Appointments:</h3>
        <ul className="space-y-2">
          {order.appointments.map((appointment) => (
            <li key={appointment.id} className="flex justify-between items-center">
              <span>{appointment.date}</span>
              <span
                className={`font-semibold ${
                  appointment.status === "Completed"
                    ? "text-green-600"
                    : appointment.status === "Scheduled"
                      ? "text-blue-600"
                      : "text-yellow-600"
                }`}
              >
                {appointment.status}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardContent>
        <Link href={`/appointments/schedule/${id}`} passHref>
          <Button className="w-full">Schedule Appointments</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

