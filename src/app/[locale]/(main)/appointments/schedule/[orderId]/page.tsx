import AppointmentScheduler from "@/components/home/AppointmentScheduler";

export default function ScheduleAppointmentsPage({ params }: { params: { orderId: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Schedule Appointments</h1>
      <AppointmentScheduler orderId={params.orderId} />
    </div>
  )
}

