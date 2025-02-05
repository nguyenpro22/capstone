"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const doctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Dermatologist" },
  { id: 2, name: "Dr. Michael Lee", specialty: "Plastic Surgeon" },
  { id: 3, name: "Dr. Emily Chen", specialty: "Cosmetic Dentist" },
]

export default function DoctorSelection({ packageId }: { packageId: string }) {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDoctor) {
      router.push(`/checkout?packageId=${packageId}&doctorId=${selectedDoctor}`)
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Select Your Doctor</CardTitle>
        <CardDescription>Choose a doctor who will be responsible for all appointments in this package</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <RadioGroup onValueChange={setSelectedDoctor} className="space-y-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="flex items-center space-x-2">
                <RadioGroupItem value={doctor.id.toString()} id={`doctor-${doctor.id}`} />
                <Label htmlFor={`doctor-${doctor.id}`} className="flex flex-col">
                  <span className="font-semibold">{doctor.name}</span>
                  <span className="text-sm text-muted-foreground">{doctor.specialty}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!selectedDoctor}>
            Proceed to Checkout
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

