"use client"

import { useEffect, useState } from "react"
import { RadioGroup } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ClinicItem } from "../clinic-item"
import type { BookingData, Clinic } from "../../types/booking"
import { BookingService } from "../../utils/booking-service"
import { useTranslations } from "next-intl" // Import useTranslations

interface SelectClinicStepProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
}

export function SelectClinicStep({ bookingData, updateBookingData }: SelectClinicStepProps) {
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(bookingData.clinic?.id || null)
  const [loading, setLoading] = useState(false)
  const [clinics, setClinics] = useState<Clinic[]>([])
  const t = useTranslations("bookingFlow") // Use the hook with the namespace

  const { service } = bookingData

  // Fetch clinics on component mount
  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true)
      try {
        if ("description" in service && "procedures" in service && "promotions" in service) {
          const clinicsData = await BookingService.getClinicsByService(service)
          setClinics(clinicsData)
        } else {
          console.error("Service is not of type ServiceDetail")
        }
      } catch (error) {
        console.error("Error fetching clinics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClinics()
  }, [service])

  const handleClinicSelect = (clinicId: string) => {
    // Only allow selection of active clinics
    const selectedClinic = clinics.find((clinic) => clinic.id === clinicId) || null
    
    if (selectedClinic && selectedClinic.isActivated !== false) {
      setSelectedClinicId(clinicId)
      updateBookingData({ clinic: selectedClinic })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">{t("loadingClinics")}</p>
      </div>
    )
  }

  // Check if we have any active clinics
  const hasActiveClinic = clinics.some(clinic => clinic.isActivated !== false)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">{t("selectClinic")}</h3>
        <p className="text-muted-foreground mb-4">{t("pleaseSelectClinic")}</p>

        {!hasActiveClinic && clinics.length > 0 && (
          <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-300">
            <p>{t("noActiveClinicWarning")}</p>
          </div>
        )}

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">{t("list")}</TabsTrigger>
            <TabsTrigger value="map">{t("map")}</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <RadioGroup value={selectedClinicId || ""} onValueChange={handleClinicSelect} className="space-y-3">
              {clinics.map((clinic) => (
                <ClinicItem 
                  key={clinic.id} 
                  clinic={clinic} 
                  isSelected={selectedClinicId === clinic.id}
                  isActive={clinic.isActivated !== false}
                  disabled={clinic.isActivated === false}
                />
              ))}
            </RadioGroup>
          </TabsContent>
          <TabsContent value="map" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">{t("clinicMap")}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}